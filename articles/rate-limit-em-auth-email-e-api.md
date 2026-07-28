---
title: Rate limit não é sobre bloquear abuso. É sobre decidir quem sofre quando o Redis cai
description: "Como implementamos rate limiting em três superfícies (auth, email, API) e por que a decisão mais importante não foi a biblioteca, foi o que acontece quando o Redis fica indisponível."
slug: rate-limit-em-auth-email-e-api
image: /static/images/rate-limit-auth.png
date: "2026-07-24"
---

Antes disso, qualquer endpoint de autenticação, envio de e-mail ou rota de API estava sem nenhuma proteção.

Não era descuido. Era prioridade.

Mas prioridade tem prazo de validade.

---

## O problema real

Sem controle, três frentes ficavam expostas ao mesmo tempo:

* Credential stuffing e brute force contra login
* Abuso de envio de e-mail transacional
* Consumo descontrolado de API por cliente único

Já tínhamos aprendido, com a conta de 8 mil reais na Azure, que ausência de controle não é neutra. Ela vira custo. Ou vira incidente de segurança.

Rate limit deixou de ser item de backlog.

---

## A escolha da biblioteca

Entre `@upstash/ratelimit` e `rate-limiter-flexible`, escolhemos o segundo.

Motivo:

* `@upstash/ratelimit` exige cliente HTTP próprio da Upstash e não suporta Redis em modo Sentinel (issue aberta desde 2024)
* `rate-limiter-flexible` se integra direto ao Redis que já mantínhamos em produção
* Suporta Sentinel, bloqueio progressivo e um limiter de emergência em memória

Não escolhemos a lib mais popular. Escolhemos a que não nos obrigava a mudar infraestrutura para resolver um problema de segurança.

---

## Três superfícies, três políticas

Rate limit não é uma regra única aplicada em todo lugar. Definimos três:

* **Auth**: 10 pontos a cada 15 minutos, com bloqueio progressivo de 30 minutos
* **E-mail**: 5 envios por usuário a cada hora
* **API geral**: 100 requisições por minuto

E três chaves diferentes:

* Auth por IP, porque ainda não existe sessão nesse ponto
* E-mail por destinatário
* API por `user.id` quando autenticado, por IP quando anônimo

Tratar as três superfícies com a mesma régua teria sido mais simples de implementar e mais fácil de errar.

---

## Bloqueio progressivo: uma defesa deliberadamente hostil

No auth, esgotar o limite não devolve o usuário para a fila. Bloqueia por mais 30 minutos.

É uma escolha agressiva contra brute force.

E tem um custo real: o usuário legítimo que erra a senha 10 vezes espera meia hora ou aciona o suporte.

Aceitamos esse trade-off conscientemente. Prevenção de credential stuffing pesou mais do que fricção ocasional de um usuário real.

---

## O que fazer quando o Redis cai

Essa foi a decisão mais importante do trabalho todo, e a menos óbvia.

Rate limit depende de um store central. Se o Redis cai, o que acontece com a proteção?

Não tratamos as três superfícies da mesma forma:

* **Auth** ganhou um *insurance limiter* em memória. Se o Redis falha, cada instância continua aplicando limite localmente. É o caminho mais sensível — não podia ficar aberto.
* **E-mail e API** fazem fail-open. Se o Redis falha, a requisição passa. Um alerta é registrado no Axiom, e a janela de exposição tende a ser curta.

Rate limit sem plano para "o store caiu" não é rate limit. É uma sensação de segurança que desaparece exatamente no momento em que mais precisa funcionar.

---

## Rate limit de e-mail centralizado, não espalhado

Em vez de aplicar o limite em cada rota que dispara e-mail, centralizamos num único helper de envio.

Toda chamada de e-mail — autenticação, notificações de comportamento, relatórios — passa pelo mesmo ponto. Um lugar só decide se o envio é permitido.

Isso significa que qualquer novo caller futuro herda a proteção automaticamente. Ninguém precisa lembrar de aplicar rate limit de novo.

---

## O que ficou fora de escopo

Não implementamos:

* Proteção contra DDoS — isso é responsabilidade de outra camada (proxy/rede), não da aplicação
* Rate limit em WebSocket — não existe esse tipo de endpoint hoje
* Dashboard dedicado de violações — os logs no Axiom já respondem "quem, quando, quantas vezes"; um dashboard só se justifica se a frequência de consulta crescer

Resolver tudo de uma vez teria atrasado o que realmente importava.

---

## O aprendizado

Rate limit parece, à primeira vista, uma feature de segurança que se implementa e esquece.

Não é.

É uma decisão sobre quem sofre e quando: o usuário legítimo que erra a senha, o time que recebe o alerta às 3 da manhã, ou o atacante que esperava uma porta aberta.

Implementar a biblioteca é a parte fácil.

Decidir o comportamento no pior cenário — Redis fora do ar — é a parte que realmente importa.
