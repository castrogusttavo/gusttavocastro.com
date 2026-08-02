---
title: Mock não é atalho de teste. É risco que você está pagando sem perceber
description: "Test doubles não são todos iguais, e tratá-los como sinônimos é a origem da falsa sensação de segurança em testes. Um mergulho em quando usar dummy, stub, spy, mock, fake — e por que contract tests existem."
slug: onde-mock-vira-risco
image: /static/images/test-doubles-risco.png
date: "2026-07-04"
---

Já contamos aqui como fakes sem governança geraram falsa sensação de segurança e quase custaram caro. Isso merecia um artigo próprio.

Porque o problema nunca foi usar dublê de teste.

Foi tratar todos os dublês como se fossem a mesma coisa.

---

## Test double não é uma coisa só

Cada tipo existe, resolve um problema diferente e verifica algo diferente:

* **Dummy** — só preenche um parâmetro. Não verifica nada.
* **Stub** — devolve respostas fixas. Verifica estado.
* **Spy** — stub que também grava as chamadas recebidas.
* **Mock** — define expectativas de interação. Verifica comportamento.
* **Fake** — reimplementação simplificada, geralmente em memória.

A regra que adotamos é simples: dublê só existe na fronteira. Onde a dependência é lenta, não-determinística ou tem efeito colateral — rede, tempo, disco, integração paga com terceiro.

Nunca na lógica de negócio. Nunca no objeto que está sendo testado.

---

## Onde isso apareceu de verdade

Quando escrevemos os testes de rate limiting, a decisão foi não mockar o Redis. Os oito casos de integração rodam contra uma instância real — porque o comportamento que importa (bloqueio progressivo, isolamento por chave, esgotamento de pontos) só existe de fato no Redis real. Um fake de Redis testaria nossa suposição sobre o Redis, não o Redis.

Já no logging de auditoria, o inverso: mockamos o cliente do Axiom nos testes unitários. Não porque fosse mais fácil, mas porque resolver a importação real do pacote de logging dentro do ambiente de teste trazia complexidade sem ganho — o que importa ali é se o evento de auditoria foi montado corretamente, não se o Axiom recebeu o payload.

Dois casos, duas decisões opostas. A mesma regra por trás das duas: o dublê entra onde a dependência real atrapalha o teste sem agregar confiança.

---

## Onde o mock vira risco: drift

Aqui mora o perigo.

Um fake ou mock é uma promessa: "eu me comporto como o serviço real."

Se o serviço real muda e o dublê não acompanha, a promessa quebra silenciosamente. O teste continua verde. O comportamento em produção diverge.

Chamamos isso de drift. E drift é pior do que não ter teste nenhum — porque gera confiança onde não deveria haver.

---

## Contract tests como resposta ao drift

Para integrações entre serviços, a resposta não é confiar no fake para sempre. É verificar periodicamente se ele ainda corresponde à realidade.

O modelo consumer-driven funciona assim:

1. Quem consome a API define, em teste, exatamente o que espera
2. Essa expectativa vira um contrato publicado
3. Quem produz a API roda uma verificação contra esse contrato antes de fazer deploy

Se o produtor quebrar o contrato, o build do produtor falha — não o do consumidor, semanas depois, em produção.

Contract test não substitui unit e integração. Ele fecha a lacuna que nenhum dos dois cobre: a divergência entre o que o consumidor espera e o que o produtor realmente entrega.

Vale para múltiplos serviços com fronteira de rede real entre eles. Não vale para monolito — ali não existe essa fronteira, e o teste de integração já resolve.

---

## TDD não é sobre cobertura

O ciclo red-green-refactor não existe para maximizar porcentagem de cobertura.

Existe para forçar um design testável antes que o acoplamento vire dívida.

Quando um teste é difícil de escrever, isso é sinal — não do teste, do design. Dependência difícil de isolar é dependência mal desenhada.

Na prática adotamos uma disciplina parecida com a que já usamos no próprio fluxo de commit: o teste vermelho é um estado de edição, nunca de commit. Escreve-se o teste primeiro, vê-se falhar, implementa-se o mínimo para passar — mas o que entra no histórico já nasce verde, teste e implementação juntos.

---

## A regra prática que ficou

* Dublê só na fronteira de I/O — nunca na lógica de negócio, nunca no objeto sob teste
* Preferir fake a mock sempre que possível — fake testa comportamento real sem acoplar a chamadas internas
* Mock reservado para efeito sem estado observável, como confirmar que um e-mail foi disparado
* Cobertura não é meta. É consequência de testar as invariantes que importam

---

## O aprendizado

Mock não é atalho.

É uma ferramenta com escopo estreito, e usá-la fora desse escopo não economiza tempo — só adia o custo para quando o comportamento real e o dublê já divergiram o suficiente para doer.

Teste não existe para deixar a suíte verde.

Existe para que o verde signifique alguma coisa.
