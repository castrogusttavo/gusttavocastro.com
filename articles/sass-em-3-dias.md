---
title: Como construímos um sistema completo em 3 semanas
description: "Como estruturamos um app desktop em Go e um painel web em PHP em apenas 3 semanas, priorizando escopo disciplinado, decisões pragmáticas e validação real de mercado antes de sofisticar a arquitetura."
slug: feature-flag-em-sistemas-multi-tenant
image: /static/images/app-3-semanas.png
date: "2026-03-18"
---

Não foi milagre.

Foi escopo disciplinado.

O projeto envolvia:

* Aplicativo desktop (Windows/Linux) em Go
* Painel web em PHP
* Backend compartilhado
* Banco relacional
* Cliente real esperando entrega

Três semanas não é sobre velocidade bruta.
É sobre eliminar fricção.

---

## O que fizemos antes de escrever código

Primeira decisão:

Não construir o produto ideal.
Construir a versão utilizável.

Definimos:

* Funcionalidade mínima que resolve dor real
* Fluxos essenciais
* Zero feature estética
* Zero abstração prematura

Sem roadmap de 6 meses.
Sem arquitetura futurista.

Só o necessário.

---

## MVC foi ferramenta de execução

Para o backend, escolhemos MVC.

Por quê?

* Estrutura conhecida
* Curva de decisão baixa
* Desenvolvimento direto
* Sem overhead estrutural

Nesse contexto, MVC não era limitação.
Era acelerador.

Arquitetura sofisticada teria atrasado.

---

## MySQL puro para pivot rápido

Escolhemos MySQL simples.

Sem tuning avançado.
Sem modelagem super refinada.
Sem tentativa de prever o futuro.

Motivo:

Precisávamos validar mercado antes de otimizar arquitetura.

Banco foi pensado para:

* Clareza
* Facilidade de manutenção
* Alterações rápidas

Performance viria depois da validação.

---

## Desenvolvimento e marketing acontecendo juntos

Enquanto desenvolvíamos:

* Landing page no ar
* Conversas com potenciais clientes
* Ajustes de escopo baseados em feedback

Isso reduziu risco.

Não estávamos construindo no escuro.

Produto e validação caminhando juntos aceleram muito mais que qualquer framework.

---

## O que deliberadamente ignoramos

Não implementamos:

* Arquitetura complexa
* Sistema de permissões avançado
* Feature Flags elaboradas
* Infra sofisticada

Foco foi:

Resolver a dor principal.

Tudo que não contribuía para isso foi descartado.

---

## O risco de romantizar velocidade

Construir em 3 semanas não é modelo universal.

Se o domínio fosse complexo,
se o time fosse grande,
se houvesse compliance pesado,
isso seria irresponsável.

Funcionou porque:

* Escopo foi pequeno
* Time era enxuto
* Decisão foi pragmática
* Expectativa era clara

Velocidade sem critério gera dívida.

Velocidade com disciplina gera tração.

---

## O aprendizado

Tempo não é o maior limitador.

Ambiguidade é.

Quando você define claramente:

* O que entra
* O que fica de fora
* O que pode ser feio no começo
* O que precisa ser sólido

O sistema anda.

E às vezes anda rápido.
