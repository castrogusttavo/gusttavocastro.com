---
title: 13 chamadas de console.log e nenhuma resposta para "quem fez o quê, quando"
description: "Como estruturamos trilha de auditoria para SOC2, ISO 27001 e LGPD: por que a auditoria vive na camada de service e não no repositório, e por que retenção de dado não é decisão de código."
slug: audit-logging-soc2-iso-lgpd
image: /static/images/audit-logging.png
date: "2026-07-20"
---

Já contamos aqui como estruturamos observabilidade em camadas — métrica, erro individual, evento auditável.

Esse post é sobre a terceira camada, a que menos parece urgente até alguém perguntar "quem alterou este dado, e quando" e a resposta ser silêncio.

Antes desta mudança: treze chamadas de `console.*` em código de produção, rotas sem logging estruturado, mutação de dado sem rastro nenhum.

---

## Log de erro não é trilha de auditoria

As duas coisas parecem a mesma coisa. Não são.

Um log de erro registra que algo deu errado, com stack trace e contexto técnico — serve para debugar.

Trilha de auditoria registra que alguém fez algo, com sucesso ou falha, com identidade e alvo explícitos — serve para responder, meses depois, uma pergunta que SOC2 (CC7.2), ISO 27001 (A.12.4) e LGPD (Art. 46) exigem que você consiga responder: quem acessou, quem alterou, quando, e o resultado.

`console.error('deu ruim')` não responde nenhuma dessas perguntas.

---

## Por que logar na camada de service, não no repositório

A decisão de onde colocar a auditoria não foi trivial.

O repositório é a camada mais próxima do banco — parecia o lugar óbvio para capturar toda mutação. Mas o repositório não sabe quem está pedindo a mutação, nem se a operação era autorizada. Ele só sabe executar.

O service é o único ponto que tem as duas coisas juntas: identidade de quem está agindo e a decisão de autorização já resolvida. Colocar a auditoria ali significa que cada caminho de falha — acesso negado, conflito de dado, erro de banco — emite o evento de auditoria com motivo específico antes de devolver a resposta, no mesmo lugar que decidiu se a operação podia acontecer.

Manter o repositório agnóstico de identidade também evita um acoplamento incômodo: a camada de acesso a dado não deveria precisar saber quem é o ator para funcionar.

---

## Auth via hooks, não via middleware genérico

Eventos de autenticação — conta criada, e-mail verificado, sessão criada — não passam por uma rota HTTP que dá para envolver com um wrapper. Eles nascem dentro do fluxo interno do provedor de autenticação.

A solução foi plugar a auditoria diretamente nos hooks do ciclo de vida do usuário e da sessão. Um detalhe: o provedor de autenticação não expõe um hook explícito de "tentativa de login". O evento de sessão criada é o proxy mais próximo disponível — não é perfeito, mas é a melhor aproximação sem reescrever a camada de autenticação inteira só para capturar um evento.

---

## Retenção de 365 dias não é decisão de código

O prazo mínimo de retenção exigido por SOC2 (CC7.2) é operacional, não algo que se resolve com uma linha de configuração no SDK.

A plataforma de logs não expõe retenção via código — é ajustada manualmente no painel, e precisa ser conferida periodicamente para confirmar que continua valendo. Ficou registrado como procedimento, não como constante no repositório: se o escopo de compliance mudar — PCI-DSS, por exemplo — o prazo sobe para sete anos, e isso também vai ser uma mudança operacional, não um deploy.

Vale registrar isso explicitamente porque é o tipo de decisão que se perde fácil quando só existe na memória de quem configurou.

---

## console.* virou trilha auditável

Treze chamadas foram substituídas, cada uma virando ou log estruturado, ou evento de auditoria:

* Erros de conexão do Redis — viraram log estruturado com componente e mensagem, não mais texto solto.
* Falhas do serviço de status — mesma coisa, com código de erro quando existia.
* Quatro chamadas dentro do fluxo de autenticação — deixaram de ser erros opacos e viraram eventos de auditoria de verdade, com resultado e motivo.
* Falha de upload no storage — virou evento de auditoria de mutação, com o motivo específico da falha.
* Uma chamada no client — virou log estruturado via hook de logger, não mais um `console.error` solto no navegador.

Nenhuma dessas mudanças foi sobre "logar mais". Foi sobre logar de um jeito que alguém consegue consultar depois.

---

## O que ficou fora, de propósito

* **Logging de erro de JavaScript no cliente** — já coberto por outra peça da observabilidade, não precisava duplicar.
* **Regras de alerta sobre os logs** — definir limiar de alerta antes de ter um mês de dado real de baseline seria adivinhação. Fica para depois de acumular histórico.
* **Rotação automática da chave de ingestão** — não há rotação prevista; a chave vive só em variável de ambiente, gerenciada via segredo cifrado.

---

## O aprendizado

Compliance não pede para logar tudo.

Pede para responder, de forma consistente e sempre da mesma maneira, uma pergunta específica: quem fez o quê, quando, e o que aconteceu se falhou.

Isso é schema, não volume. Um sistema que loga pouco mas de forma estruturada responde essa pergunta melhor do que um sistema que loga tudo em texto livre.
