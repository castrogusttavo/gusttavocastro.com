---
title: Token bucket ou sliding window? A pergunta certa não é qual algoritmo. É quem você está protegendo
description: "Fixed window, sliding window, token bucket e leaky bucket resolvem problemas diferentes disfarçados do mesmo nome. Um guia de quando cada um faz sentido, e qual deles realmente está por trás do rate limit que já publicamos aqui."
slug: rate-limiting-fundamentos-algoritmos
image: /static/images/rate-limiting-algoritmos.png
date: "2026-07-18"
---

Quando implementamos rate limit em auth, e-mail e API, escolhemos biblioteca e política sem nunca nomear o algoritmo por trás.

Isso não foi negligência. Foi consequência de uma decisão mais importante, tomada antes de abrir qualquer biblioteca: o que exatamente estávamos protegendo.

Vale abrir essa caixa.

---

## Fixed window: simples, e com um furo conhecido

Divide o tempo em janelas fixas — cada minuto, por exemplo — e conta requisições dentro de cada uma.

A implementação cabe em duas linhas de Redis: incrementa um contador, define expiração. Rápido, barato, óbvio.

O problema aparece na borda entre janelas. Um cliente pode disparar o limite inteiro no último segundo de uma janela, e o limite inteiro de novo no primeiro segundo da próxima — dobrando o volume permitido num intervalo de poucos segundos, sem violar a regra em nenhum momento isolado.

Aceitável quando a janela é curta o suficiente para o problema não importar, ou quando o limite não é crítico.

---

## Sliding window: log preciso, counter pragmático

Duas variantes resolvem o furo da janela fixa de formas diferentes.

O **sliding window log** guarda o timestamp de cada requisição e conta quantas caem dentro da janela mais recente a cada nova tentativa. É matematicamente exato — nenhum burst escapa. O custo é memória: cada requisição vira um registro, e em volume alto isso significa gigabytes só para contadores.

O **sliding window counter** aproxima o resultado combinando o contador da janela atual com uma fração ponderada da anterior. Não é perfeito — erro tipicamente abaixo de 5% — mas usa memória constante e é rápido. É o algoritmo mais comum em produção justamente por isso: precisão suficiente, custo prático.

---

## Token bucket: protege quem pede

Modelo mental: um balde se enche de tokens a uma taxa constante. Cada requisição consome um token. Sem token, a requisição é rejeitada.

O que isso permite: um usuário real que abre o aplicativo e dispara dez requisições de uma vez — e depois fica quieto por um minuto — não é penalizado. O balde absorve a rajada até a capacidade, e se recompõe enquanto ninguém está pedindo.

É o algoritmo por trás de APIs como GitHub e Stripe, exatamente porque comportamento de usuário real não é uniforme. Ninguém pede um recurso por segundo, de forma constante — pede em rajadas, com pausas no meio.

---

## Leaky bucket: protege quem recebe depois

Mesma imagem de balde, papel invertido. Aqui o balde tem um furo no fundo que vaza a uma taxa constante. Requisições entram por cima, em qualquer ritmo; saem por baixo, sempre na mesma velocidade. Se entra mais rápido do que vaza, o balde enche e transborda — rejeição.

A diferença que importa: token bucket controla a **entrada** e deixa a saída seguir o ritmo de quem pede. Leaky bucket controla a **saída** e força regularidade, não importa como a entrada chegou.

Faz sentido quando o que está do outro lado não aguenta rajada — uma integração externa cobrada por chamada, um worker que processa a uma taxa fixa. O custo é latência: a requisição pode esperar na fila até o balde vazar espaço.

---

## A pergunta que decide, não o algoritmo

Nenhum desses quatro é "o certo". Cada um otimiza para uma prioridade diferente:

* **Token bucket** — otimiza para a experiência de quem pede. Tolera rajada.
* **Leaky bucket** — otimiza para a proteção de quem recebe depois. Normaliza a saída.
* **Sliding window** — otimiza para precisão de contagem, sem opinião sobre rajada.

Escolher o algoritmo antes de responder "o que estou protegendo" é resolver o problema errado com precisão.

---

## Onde isso apareceu na prática

No rate limit que já descrevemos aqui, auth consome pontos numa janela de 15 minutos e, ao esgotar, fica bloqueado por mais 30 — não um refill gradual que deixa tentar de novo em segundos, mas uma pausa punitiva de duração fixa.

Isso se comporta mais perto de uma janela com penalidade do que de um token bucket clássico. E foi deliberado: contra brute force, refill contínuo é exatamente o comportamento que você não quer — ele permite o atacante testar de novo assim que um token aparece. Uma pausa fixa depois do estouro é mais hostil, e hostilidade era o objetivo ali.

Já o limite de API geral, mais permissivo e sem bloqueio progressivo, se comporta mais perto de uma janela simples — o objetivo era conter abuso sustentado, não punir rajada ocasional.

Duas políticas, dois comportamentos de algoritmo diferentes, dentro do mesmo sistema. Porque as duas protegiam coisas diferentes.

---

## O aprendizado

Não existe algoritmo certo em abstrato.

Existe a pergunta "o que eu estou protegendo, e contra o quê" respondida antes de abrir a biblioteca — e cada uma das quatro respostas possíveis aponta para uma estrutura diferente por baixo do mesmo nome genérico: rate limit.
