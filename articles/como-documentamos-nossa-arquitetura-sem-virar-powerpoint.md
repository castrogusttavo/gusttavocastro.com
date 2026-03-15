---
title: Como documentamos nossa arquitetura sem virar PowerPoint
description: "Uma arquitetura bem desenhada não significa nada se ninguém lembra por que as decisões foram tomadas."
slug: como-documentamos-nossa-arquitetura-sem-virar-powerpoint
image: /static/img/APP-ARCH.png
date: "2025-03-16"
---

# Como documentamos nossa arquitetura sem virar PowerPoint

Toda equipe que começa um produto novo faz a mesma coisa.

Alguém abre o Figma, desenha um diagrama bonito da arquitetura, coloca algumas caixas representando serviços e conecta tudo com algumas setas. O diagrama entra em um slide, aparece em uma apresentação e pronto — a arquitetura está “documentada”.

Algumas semanas depois surge a primeira pergunta real.

Por que usamos Redis aqui?
Por que existe um módulo separado de autenticação?
Por que escolhemos um monolito em vez de microserviços?

O diagrama raramente responde essas perguntas. Ele mostra **o que existe**, mas quase nunca explica **por que aquilo existe**.

Quando começamos a construir o **Nexo**, decidimos evitar exatamente esse problema.

O objetivo nunca foi criar apenas diagramas de arquitetura. O objetivo era registrar **o raciocínio técnico por trás das decisões**.

---

# Contexto

Nexo é uma plataforma de gerenciamento de projetos inspirada em ferramentas como Jira, Linear e Plane.

A proposta é reunir em uma única aplicação funcionalidades que normalmente estão espalhadas em diferentes ferramentas:

* issue tracking
* ciclos de desenvolvimento
* roadmaps de produto
* documentação colaborativa
* analytics de progresso

Esses requisitos criam alguns desafios arquiteturais importantes:

* edição colaborativa em tempo real
* multi-tenancy com workspaces isolados
* controle de acesso baseado em papéis
* sincronização entre múltiplos clientes
* possibilidade de deploy self-hosted

Esses requisitos moldaram praticamente todas as decisões arquiteturais do sistema.

---

# Architecture Map

Antes de entrar nos detalhes, criamos um mapa simples da documentação de arquitetura.

Esse mapa mostra **como os diferentes diagramas se relacionam entre si**.

![Architecture Map](/static/img/ALL-ARCH.png)

Cada diagrama responde uma pergunta específica:

* **High Level Architecture** → quais são os principais componentes do sistema
* **Auth Architecture** → como identidade e permissões são controladas
* **Docs Architecture** → como funciona a edição colaborativa
* **App Architecture** → como os módulos são organizados no código
* **Infra Architecture** → como o sistema é executado em produção
* **Security Architecture** → quais camadas protegem a aplicação

Essa estrutura transforma a documentação em algo navegável. Em vez de um único diagrama gigante, temos múltiplas perspectivas da mesma arquitetura.

---

# Arquitetura como decisões

Para registrar o raciocínio por trás dessas escolhas adotamos **ADR — Architecture Decision Records**.

Cada ADR responde quatro perguntas:

* qual problema estávamos resolvendo
* quais dados tínhamos na mão
* qual decisão foi tomada
* quais consequências aceitamos

Diagramas mostram **a estrutura do sistema**.

ADRs explicam **por que essa estrutura existe**.

Abaixo estão dois exemplos reais.

---

# ADR — Redis para cache de dados de usuário

**Problema**

Com cerca de 4.000 usuários simultâneos simulados em testes de carga, observamos aproximadamente **100.000 requisições por ciclo**.

Cerca de **20% dessas requisições acessavam exatamente os mesmos dados de usuário**.

A query no PostgreSQL levava cerca de **130ms**, o que isoladamente é aceitável.

O problema aparecia sob concorrência.

O pool de conexões saturava e as queries começavam a enfileirar. O mesmo dado era buscado por centenas de conexões simultâneas.

O tempo de resposta chegou a **4–5 segundos**.

**Decisão**

Implementamos cache-aside usando Redis no Service Layer:

1. verifica o cache
2. se existir → retorna
3. se não existir → busca no banco e armazena

O cache é invalidado imediatamente após qualquer alteração nos dados.

**Resultado**

Latência percebida caiu de **4–5 segundos para ~280ms**.

O problema não era a query.
Era contenção no banco.

---

# ADR — Remoção do Load Balancer

O primeiro diagrama da arquitetura incluía um Load Balancer.

Quando perguntamos o motivo, a resposta foi simples:

“para escalar”.

Mas escalar o quê exatamente?

Não havia testes de carga indicando saturação.
Não havia métricas mostrando gargalo.

Era apenas **arquitetura aspiracional**.

Cada componente adicional na infraestrutura adiciona custo operacional: monitoramento, manutenção e mais um ponto de falha.

**Decisão**

Remover o Load Balancer até que existam evidências reais de saturação.

Hoje uma única instância Next.js com Redis cache e PgBouncer suporta tranquilamente a carga atual.

Quando métricas indicarem necessidade de escala horizontal, revisitamos a decisão.

---

# High Level Architecture

O primeiro diagrama criado foi a visão geral do sistema.

![High level Diagram](/static/img/HIGH-LEVEL-ARCH.png)

Nesse nível aparecem apenas os principais componentes:

* aplicação
* banco de dados
* Redis
* object storage
* infraestrutura de rede

A decisão mais importante nesse nível foi estruturar o sistema como um **Modular Monolith**.

Microserviços fazem sentido quando existem:

* múltiplos times independentes
* deploys desacoplados
* necessidades de escala distintas

Nenhuma dessas condições existia.

Adotar microserviços naquele momento adicionaria complexidade operacional sem resolver um problema real.

Optamos então por um monolito modular, com fronteiras claras entre domínios no código.

---

# Auth Architecture

O Nexo suporta múltiplos workspaces com diferentes papéis de acesso:

* Owner
* Admin
* Member

![Diagrama Auth](/static/img/AUTH-ARCH.png)

Isso significa que praticamente todas as operações do sistema precisam validar permissões.

Centralizar autenticação e autorização evita regras espalhadas pela aplicação.

O fluxo é simples:

1. usuário autentica
2. recebe um token de sessão
3. cada requisição valida identidade e permissões via RBAC

As sessões são armazenadas no Redis para permitir invalidação imediata.

---

# Docs Architecture

Um dos recursos centrais do Nexo é permitir que usuários criem páginas de documentação e convertam essas páginas em issues.

Essas páginas podem ser editadas por múltiplos usuários simultaneamente.

![Docs Diagram](/static/img/DOCS-ARCH.png)

Esse cenário cria um problema clássico: **edição concorrente**.

Estratégias simples não funcionam bem.

Last-write-wins sobrescreve alterações.
Locks bloqueiam colaboração.

A solução adotada foi utilizar **CRDTs**.

Cada cliente mantém uma cópia local do documento. As alterações são enviadas ao servidor via WebSocket, que faz o merge e distribui os deltas para outros clientes via Redis Pub/Sub.

CRDTs garantem que todas as réplicas convergem para o mesmo estado final independentemente da ordem das operações.

---

# App Architecture

Este diagrama mostra a estrutura completa da aplicação.

![App Diagram](/static/img/APP-ARCH.png)

Os módulos são organizados por domínio:

* auth
* docs
* projects
* workspaces
* cycles
* analytics

Uma regra arquitetural importante foi definida aqui:

**apenas o Repository Layer pode acessar diretamente o banco de dados.**

Isso evita SQL espalhado pela aplicação e centraliza toda lógica de persistência.

---

# Infra Architecture

O Nexo foi projetado para ser **self-hostable**.

![Infra](/static/img/INFRA-ARCH.png)

A infraestrutura roda atualmente em um servidor Ubuntu utilizando Docker Compose.

Os principais serviços executam como containers internos:

* PostgreSQL
* Redis
* MinIO

Um pfSense atua como firewall e gateway da rede.

Apenas as portas necessárias para acesso público são expostas.

---

# Security Architecture

A segurança do sistema foi estruturada em múltiplas camadas.

![Security Diagram](/static/img/SECURITY-ARCH.png)

Camada de rede:
pfSense + Nginx com TLS termination e rate limiting.

Camada de identidade:
autenticação, sessões e RBAC.

Camada de secrets:
build no GitHub Actions e runtime no servidor.

Ainda existe uma melhoria planejada: mover secrets para um vault com rotação automática.

---

# Riscos em aberto

Documentar arquitetura também significa registrar o que **ainda não está resolvido**.

Hoje alguns trade-offs são claros:

* Redis roda como instância única
* infraestrutura depende de um único servidor físico
* secrets ainda não utilizam vault centralizado

Essas decisões foram aceitas conscientemente no estágio atual do produto.

---

# Documentação viva

Arquitetura não é um destino final.

Ela representa apenas o conjunto atual de decisões tomadas por um time em determinado momento.

Cada nova decisão relevante gera um novo ADR.
Cada mudança estrutural atualiza os diagramas.

O objetivo nunca foi produzir um PowerPoint bonito.

Foi criar um histórico técnico que explique **como e por que o sistema tomou a forma que tem hoje**.
