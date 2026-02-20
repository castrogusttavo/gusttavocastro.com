---
title: Feature Flags em sistema multi-tenant não são opcional. São estrutura
description: "Como implementamos Feature Flags em um sistema multi-tenant com cloud e self-hosting para controlar rollout, reduzir risco operacional e manter uma única codebase sem virar caos."
slug: feature-flag-em-sistemas-multi-tenant
image: /static/images/feature-flags.png
date: "2026-03-05"
---

Nosso sistema não roda em um único cenário.

Ele suporta:

* Clientes em cloud
* Clientes em self-hosting
* Contratos com features diferentes
* Ambientes com capacidades distintas

Basicamente, duas realidades convivendo no mesmo código.

Liberar feature globalmente deixou de ser viável muito cedo.

---

## O problema real

Sem controle fino, qualquer nova funcionalidade gerava risco em duas frentes:

1. Clientes cloud
2. Clientes self-hosted

O que funciona bem em ambiente gerenciado pode quebrar em infra do cliente.

Deploy único.
Contextos diferentes.

A probabilidade de impacto era alta.

---

## Onde Feature Flags mudaram o jogo

Passamos a tratar feature como comportamento controlável.

Implementamos flags com resolução por:

* Tenant
* Tipo de ambiente (cloud vs self-hosted)
* Plano de contrato

Isso nos permitiu:

* Liberar primeiro apenas na cloud
* Validar comportamento em produção real
* Ajustar antes de chegar no self-hosted
* Manter paridade sem acoplamento rígido

O rollout deixou de ser binário.
Virou progressivo e contextual.

---

## Arquitetura da solução

Nada de plataforma externa sofisticada.

Construímos:

* Tabela de flags no banco
* Cache para leitura rápida
* Service central para avaliação
* Middleware para injetar contexto do tenant

Regra simples:

Nenhuma feature nova nasce sem flag.

Produção não é ambiente de medo.
É ambiente controlado.

---

## O impacto no multi-tenant

Em sistema multi-tenant, flags permitem:

* Habilitar recursos pesados apenas para determinados clientes
* Controlar consumo por perfil
* Evitar que uma feature experimental afete todos
* Manter customizações isoladas sem criar forks

No caso de self-hosting, isso foi crucial.

Clientes têm ambientes distintos.
Infra diferente.
Restrições diferentes.

Feature Flag virou ferramenta de compatibilidade operacional.

---

## O risco invisível

Feature Flag mal gerenciada vira problema estrutural.

Riscos reais:

* Condicionais espalhadas
* Flags eternas
* Estados difíceis de testar
* Complexidade invisível no domínio

Adotamos regras claras:

* Toda flag tem propósito definido
* Toda flag tem ciclo de vida
* Após estabilização, a flag é removida
* Avaliação centralizada, nunca espalhada

Sem governança, flag vira dívida.

---

## O que aprendemos

Em sistema vivo e multi-tenant:

Deploy não é o problema.
Controle é.

Feature Flag nos deu:

* Rollout progressivo
* Segurança operacional
* Separação clara entre contextos
* Capacidade de evoluir sem bifurcar código

E principalmente:

Permitiu manter cloud e self-hosted na mesma base, sem virar caos.

---

## O ponto estratégico

Feature Flag não é só ferramenta de produto.

É ferramenta de arquitetura em sistemas com múltiplos contextos de execução.

Quando você opera cloud + self-hosted,
controle fino deixa de ser opcional.

Vira requisito de sobrevivência.
