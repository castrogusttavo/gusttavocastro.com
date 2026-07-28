---
title: Recomendei 7 dias de retenção. Guardamos 30. Os dois números estavam certos
description: "Como automatizamos a limpeza de sessões e tokens de verificação expirados — e por que o número final de dias não veio só da lei, veio de uma conversa sobre o que estávamos otimizando."
slug: retencao-automatica-de-dados
image: /static/images/retencao-dados.png
date: "2026-08-24"
---

Antes desta mudança, qualquer sessão ou token de verificação que vencia ficava no banco para sempre.

Não por decisão. Por ausência de uma.

Isso é risco direto de LGPD e ruído operacional acumulando silenciosamente — dado morto que ninguém vai olhar até uma auditoria perguntar por que ele ainda está lá.

---

## O desacordo que ficou registrado

A primeira recomendação foi apagar sessões vencidas em sete dias, ou imediatamente — LGPD Art. 16 fala em manter dado pelo mínimo necessário, e sessão vencida não serve mais a nenhum propósito funcional.

A decisão final foi trinta dias. Não por descuido — por uma prioridade diferente: preservar uma janela forense. Se algo estranho acontecer, poder rastrear IP e user-agent de logins recentes por mais tempo vale mais do que a minimização estrita.

As duas posições eram defensáveis. A diferença estava no que cada uma otimizava: uma minimizava exposição de dado pessoal ao máximo permitido pela lei; a outra preservava capacidade de investigar incidente. Ficou registrado que a escolha foi consciente — PII continua por trinta dias além do momento em que deixa de ser útil, e isso foi decidido, não esquecido.

---

## Verificações: o job só cobre quem foi embora sem terminar

Token de verificação de e-mail consumido com sucesso já é apagado no mesmo instante pelo próprio fluxo de autenticação — não precisa de limpeza posterior.

O job de retenção cobre só o outro caso: token que expirou sem nunca ter sido usado, porque alguém abandonou o fluxo no meio. Vinte e quatro horas depois de vencer, some.

Não foi preciso adicionar nenhuma coluna nova para saber se um token tinha sido consumido. O campo de expiração que já existia bastava — o corte é sempre "venceu há mais de X", não "foi usado ou não".

---

## Uma linha muda a política inteira

As janelas de retenção — trinta dias para sessão, vinte e quatro horas para verificação — vivem como constantes nomeadas, não como números soltos espalhados pelo código.

Mudar a política de retenção significa mudar uma linha, não caçar todo lugar onde um prazo foi hardcoded. Parece óbvio escrito assim; é fácil não fazer isso sob pressão de prazo, e pagar o preço meses depois quando a política precisa mudar e ninguém lembra onde ela está codificada.

A cadência de execução é diária, de madrugada. Volume de dado vencido é pequeno o suficiente para não justificar rodar de hora em hora — isso seria desperdício de execução. Semanal acumularia dado morto demais entre uma limpeza e outra.

---

## O placeholder que grita, de propósito

A fila de ciclo de vida de conta — que vai processar exclusão de conta numa etapa futura — não tinha processor real ainda nesta etapa. Em vez de um stub silencioso que aceita o job e não faz nada, o processor lança erro deliberadamente.

Um stub silencioso esconderia uma regressão: se algo tentasse enfileirar exclusão de conta antes da lógica existir, o job desapareceria sem rastro, e ninguém notaria até um usuário perguntar por que a conta dele não foi excluída. Um erro alto, registrado e visível, é a defesa mais barata contra esse cenário.

Falhar ruidosamente de propósito é, às vezes, a decisão mais responsável disponível.

---

## O que ficou fora, de propósito

* **Exclusão de conta em si** ficou fora desta etapa, mesmo com a infraestrutura de fila já pronta para suportar um job atrasado de trinta dias. Implementar agora seria adiantar uma lógica que pertence a outra frente de trabalho — e misturar as duas teria inflado o escopo sem necessidade.
* **Retenção de log** é gerenciada fora da aplicação, direto na plataforma de observabilidade — não é decisão de código.
* **Backup de banco de dados** continua como tarefa agendada no nível de infraestrutura, não como job do worker. São categorias diferentes de "coisa que precisa rodar periodicamente", e nem toda uma precisa virar fila.

---

## O aprendizado

Dado que passou da validade e continua no banco não é neutro. É passivo, não ativo — ocupa espaço, é superfície de exposição, é a linha que alguém vai apontar numa auditoria perguntando "por que isso ainda existe aqui".

Mas "quanto tempo guardar" não é uma pergunta que a lei responde sozinha. É decisão de produto tanto quanto de compliance — e o número certo depende do que você está disposto a trocar: minimização estrita, ou capacidade de investigar o que deu errado depois que já deu.
