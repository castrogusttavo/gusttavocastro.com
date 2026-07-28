---
title: Observabilidade não é dashboard. É a pergunta que alguém vai fazer daqui a 6 meses
description: "Como estruturamos observabilidade em três camadas — métricas, erro individual e evento auditável — e por que a peça que mais importou não foi a ferramenta, foi o schema."
slug: observabilidade-com-axiom
image: /static/images/observabilidade-axiom.png
date: "2026-07-31"
---

Já contamos aqui como observabilidade nos mostrou onde o dinheiro estava vazando na Azure.

Prometheus e Grafana responderam "quanto". Faltava responder duas outras perguntas: "o que exatamente quebrou" e "quem fez o quê, quando".

---

## Três perguntas, três ferramentas

Tentar resolver observabilidade com uma ferramenta só é o primeiro erro.

* **"Quanto?"** — métricas agregadas. Prometheus raspa, Grafana correlaciona.
* **"O que quebrou, exatamente?"** — erro individual com stack trace e contexto. Sentry.
* **"Quem fez o quê, quando, e por quê falhou?"** — evento estruturado, auditável. Axiom.

As três respondem perguntas diferentes. Tentar espremer auditoria dentro de métrica, ou stack trace dentro de log de negócio, produz um sistema que não responde nada direito.

---

## Por que Axiom para logs e eventos

Ferramentas de log tradicionais indexam tudo em disco caro. Isso funciona até o volume crescer — aí o custo cresce junto, na mesma proporção.

Axiom separa armazenamento de consulta: dados ficam em formato colunar comprimido sobre object storage, e você paga pelo volume ingerido, não por host ou série ativa. Na prática, isso significa ingerir tudo e decidir depois o que consultar — em vez de decidir hoje o que vale a pena logar, sob o risco de descobrir amanhã que faltou exatamente o campo que você precisava.

Consulta é uma linguagem em formato pipe:

```
['nexo-app']
| where _time > ago(15m) and level == "error"
| summarize count() by bin(_time, 1m), route
```

---

## Logger que não depende do framework

O logger de produção não usa o pacote de integração oficial com Next.js.

Motivo: código importado pelos testes unitários — rodando em ambiente Node puro — não conseguia resolver a dependência transitiva que esse pacote arrasta do runtime do Next. Um serviço testado em isolamento não deveria carregar a árvore de imports de uma rota HTTP.

A saída foi separar o logger em duas camadas: um núcleo puro, sem essa dependência, e um wrapper fino só para as rotas que efetivamente rodam dentro do Next.

O trade-off: perdemos o enriquecimento automático de request ID fora das rotas que usam o wrapper. Aceitamos porque as duas peças que mais precisavam desse contexto já carregam identificação explícita — o middleware injeta os campos da requisição, e os eventos de auditoria sempre levam quem executou a ação e sobre o quê.

Preferimos um logger testável a um logger conveniente.

---

## Auditoria como schema, não como hábito

A diferença entre "logamos bastante" e "temos trilha de auditoria" é o schema.

Definimos dois formatos fixos: um para mutação de dado, outro para evento de autenticação. Todo evento carrega os mesmos campos — quem, o quê, quando, se teve sucesso e, em caso de falha, por quê.

O campo de motivo de falha não é a mensagem de erro crua. É um identificador curto e estável — o tipo de coisa que dá para filtrar e alertar. A mensagem de erro completa, quando importa, vai num campo separado.

Essa distinção parece pequena. Na prática é o que separa um log que serve para debugar um log que serve para responder auditoria externa.

---

## O que ainda não fizemos

Não temos tracing distribuído.

Hoje, correlacionar uma falha entre serviços depende de logs bem estruturados e de um identificador de ator ou de entidade comum entre os eventos. Funciona porque o número de serviços trocando chamada entre si ainda é pequeno.

Isso muda o dia em que esse número crescer. Nesse ponto, saber que um pedido específico atravessou quatro serviços — e onde ele ficou lento — vai exigir rastreamento de verdade, não reconstrução manual via log.

Não implementamos isso agora porque o problema que ele resolve ainda não apareceu. Vai aparecer.

---

## O aprendizado

Observabilidade não existe para ficar bonita num dashboard.

Existe para responder, sob pressão, uma pergunta que ninguém previu com seis meses de antecedência.

A ferramenta importa menos do que parece. O que decide se você vai ter resposta na hora certa é se o dado foi estruturado direito no momento em que foi gerado — não se você vai conseguir consertar depois.
