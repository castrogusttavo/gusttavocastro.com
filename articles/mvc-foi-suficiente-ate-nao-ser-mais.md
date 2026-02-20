---
title: MVC foi suficiente. Até não ser mais
description: "Como o MVC foi suficiente para lançar o MVP, mas começou a gerar duplicação, confusão nos testes e domínio inchado. E por que migramos para Service Layer para sustentar a evolução do produto."
slug: mvc-foi-suficiente-ate-nao-ser-mais
image: /static/images/clean-arch.png
date: "2026-02-20"
---

Começamos com MVC.

Time pequeno.
Pressão por entrega.
Precisávamos validar o produto rápido.

Controller → regra de negócio → acesso a dados.

Sem camadas extras.
Sem abstração prematura.
Sem arquitetura de slide.

Para o MVP, funcionou perfeitamente.

E essa foi a decisão certa naquele momento.

---

## O problema não era o padrão. Era o crescimento.

Com a evolução do produto vieram os sintomas:

* Código duplicado entre controllers
* Regra de negócio espalhada
* Testabilidade complexa e confusa
* Domínio inchando sem fronteiras claras
* Controllers assumindo responsabilidade de orquestração

O sistema ainda funcionava.

Mas começou a ficar pesado.

O custo não era de CPU.
Era cognitivo.

---

## Onde o MVC começou a doer

Alguns exemplos concretos:

* Mesma validação replicada em múltiplos endpoints
* Fluxos de negócio misturados com detalhes HTTP
* Testes exigindo mocks demais porque tudo dependia do controller
* Pequenas mudanças exigindo alterações em múltiplos pontos

O que antes acelerava, começou a frear.

E isso é natural.

Arquitetura boa para o MVP não é necessariamente boa para a V1.

---

## A decisão: migrar para Service Layer

Não fomos para Clean Architecture.

Não fomos para hexagonal.

Introduzimos algo simples e pragmático:

**Service Layer.**

Separação clara:

* Controller lida com transporte (HTTP)
* Service concentra regra de negócio
* Repository isola persistência

Nada revolucionário.

Mas sim estruturado.

---

## O que realmente melhorou

A mudança trouxe efeitos concretos:

* Centralização da regra de negócio
* Eliminação de duplicação
* Testes focados no domínio, não no transporte
* Redução do acoplamento entre fluxo HTTP e lógica interna
* Fluxos mais previsíveis

A performance melhorou como efeito indireto.

Por quê?

Porque eliminamos chamadas duplicadas.
Organizamos melhor queries.
Reduzimos orquestração caótica dentro de controllers.

Mas é importante dizer:

Service Layer não melhora performance por mágica.
Ela melhora clareza.
E clareza reduz erro.

---

## Por que não fomos direto para Clean Architecture?

Porque arquitetura também tem custo.

Mais camadas significam:

* Mais arquivos
* Mais abstrações
* Mais decisões por feature
* Mais onboarding cognitivo

Para um time enxuto, isso pode virar sobrecarga.

Escolhemos a menor mudança estrutural capaz de resolver o problema atual.

Sem importar complexidade desnecessária.

---

## O aprendizado

MVC não estava errado.

Ele era adequado para o estágio inicial.

O erro teria sido insistir nele quando o domínio começou a crescer.

Arquitetura precisa evoluir junto com o produto.

Não antes.
Não depois.
No momento certo.

---

## O que essa migração realmente representa

Não é troca de padrão.

É amadurecimento de sistema.

Começamos priorizando velocidade.
Depois priorizamos organização.
Agora priorizamos clareza de domínio.

Cada estágio exige uma arquitetura diferente.

E maturidade não é usar o padrão mais sofisticado.

É saber quando mudar.
