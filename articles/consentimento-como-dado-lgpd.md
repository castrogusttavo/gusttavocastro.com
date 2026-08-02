---
title: Consentimento não é um checkbox no signup. É um evento com dono, versão e timestamp de servidor
description: "Como modelamos consentimento LGPD/GDPR como dado desde a primeira onda — antes de qualquer tela existir — e o bug que quase deixou o gate inteiro inútil."
slug: consentimento-como-dado-lgpd
image: /static/images/consentimento-lgpd.png
date: "2026-07-23"
---

Antes: "Ao criar sua conta você concorda com nossos termos", texto plano, sem checkbox, sem registro de quando ou de qual versão.

Legalmente, isso é consentimento implícito. E consentimento implícito não é consentimento — LGPD Art. 7/8 e GDPR Art. 6/7 exigem opt-in explícito. Qualquer auditoria apontaria que o aceite era nulo.

Levou sete etapas para resolver isso direito. A ordem entre elas foi a parte que mais importou.

---

## Onda 1: o dado antes da tela

A primeira etapa não tocou em nenhuma interface visível ao usuário.

Construiu o modelo de dados — colunas de timestamp de aceite no usuário, uma tabela de eventos de consentimento append-only, e constantes de versão para cada documento legal. Nada disso tinha consumidor ainda.

A decisão deliberada: plantar o vocabulário e a estrutura de auditoria primeiro, para que cada etapa seguinte tivesse onde escrever, em vez de cada uma inventar seu próprio formato de registro sob pressão.

---

## Timestamp de servidor, nunca do cliente

Um detalhe pequeno carrega o peso legal inteiro: quem determina a hora do aceite não é o navegador do usuário.

O formulário de cadastro envia um timestamp junto com a submissão, mas o servidor ignora esse valor e grava o horário próprio no momento em que processa o pedido. Um cliente malicioso não consegue forjar a data do aceite — nem para trás, alegando ter aceitado antes de uma mudança de termos, nem para frente.

Isso foi testado de forma direta: uma submissão com data de 1990 no campo de aceite resultou em um registro com a hora real do servidor, com menos de um minuto de diferença. A defesa não é teórica — está coberta por teste que tenta exatamente essa manipulação.

---

## O bug que quase deixou o gate inútil

Durante a validação de uma das etapas seguintes, uma checagem simples com `curl` nas páginas de termos e privacidade revelou algo que nenhum dos testes automatizados tinha capturado: as páginas legais estavam redirecionando para a tela de login.

A causa: a lista de rotas públicas do middleware ainda listava dois caminhos antigos, que já não existiam no código, e nunca tinha sido atualizada para incluir as páginas legais novas. O middleware bloqueava quem tentava acessar sem sessão — inclusive um usuário anônimo tentando ler os termos antes de aceitar.

Sem esse fix, o gate de consentimento estaria funcionalmente quebrado em produção: o usuário seria obrigado a marcar dois checkboxes apontando para páginas que ele não conseguia abrir. O bug não fazia parte do escopo declarado da etapa — mas ignorá-lo por estar "fora do escopo" teria significado entregar uma feature de compliance que não cumpria compliance nenhuma.

---

## OAuth não passa pelo mesmo caminho

Cadastro por e-mail e senha permite interceptar o momento exato do aceite, antes da conta existir. Login via Google ou GitHub não. O fluxo de OAuth cria a conta sem passar pelo ponto do código onde os campos de aceite são processados.

Duas opções foram avaliadas: um checkbox obrigatório antes de habilitar o botão de OAuth, ou uma tela de consentimento separada, exibida logo após a primeira autenticação, com um portão que bloqueia qualquer área privada até o aceite existir.

A segunda venceu por três motivos que se acumulam: um checkbox antes de um clique de OAuth é uma defesa legal mais frágil que uma submissão dedicada; não fecha a possibilidade de alguém chamar a API de cadastro diretamente, sem passar pela interface, criando conta sem aceite; e o fluxo de OAuth não tem onde persistir o "momento do aceite" como evento distinto sem gambiarra.

O portão ficou no layout que envolve toda a área privada da aplicação — não no middleware de borda, que roda num ambiente que não fala diretamente com o banco de dados. E ele lê o estado de aceite direto do banco, não do cache de sessão: o cache tem alguns minutos de validade, e confiar nele criaria um loop — usuário aceita, mas continua vendo a tela de consentimento por causa de um cache desatualizado.

---

## Banner de cookies: binário, sem esconder a opção difícil

O banner de cookies gateia três ferramentas de rastreamento, não apenas a que a especificação original mencionava — porque a base legal para tratar dado de comportamento é a mesma para todas as três, e o custo de código de gatear uma ou três é idêntico.

A escolha de design foi um botão de aceitar e um de rejeitar, com o mesmo peso visual. Nada de "Aceitar tudo" em destaque e "Personalizar" escondido num link discreto — LGPD exige que as opções tenham proeminência equivalente, e esse é exatamente o anti-padrão que a lei tenta impedir.

Categorias separadas por tipo de cookie não entraram. Hoje só existe um tipo de coleta acontecendo; criar categorias sem canais reais para diferenciar seria complexidade decorativa.

---

## Revogar termos não existe. Existe excluir conta

A tela de preferências deixa revogar consentimento de cookies a qualquer momento, com um simples toggle.

Termos de serviço e política de privacidade não têm o mesmo botão. Manter uma conta ativa sem esses dois aceites seria um estado inconsistente — o próprio portão de consentimento redirecionaria esse usuário de volta assim que ele tentasse acessar qualquer área privada. Em vez de simular uma revogação que não revoga de verdade, o texto da tela aponta diretamente para a opção real: excluir a conta.

É um anti-padrão comum o suficiente para merecer nome: o botão de revogar que, tecnicamente, não revoga nada. Preferimos não criar essa ilusão.

---

## Testes onde o tipo não protege

A cobertura de teste não tentou ser exaustiva. Focou onde a defesa só existe em tempo de execução — o hook que sobrescreve o timestamp, o caráter append-only da tabela de eventos, o portão que compara um campo nulo.

Onde o comportamento já era trivial e verificável por inspeção direta — o banner de cookies aparecer sem cookie e sumir com ele, por exemplo — não entrou teste automatizado só para exibir cobertura. Isso já tinha sido confirmado durante o desenvolvimento, com uma verificação direta e simples.

O redirect do portão de consentimento, por rodar num componente de servidor, ficou como lacuna conhecida — validar isso de ponta a ponta exige um navegador real controlado por teste, ferramenta que ainda não fazia parte do projeto. Registrado como pendência, não escondido.

---

## O aprendizado

Consentimento não é uma tela que aparece no cadastro.

É um evento com dono, versão do documento aceito, e timestamp em que ninguém além do servidor pode mentir. Construir isso de trás para frente — dado antes de interface — foi o que permitiu que cada etapa seguinte tivesse onde escrever, em vez de inventar seu próprio formato sob pressão de prazo.
