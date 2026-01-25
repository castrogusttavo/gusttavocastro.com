---
title: Architecture isn’t confusing. The way we talk about it is.
description: "Architecture is often treated as a single choice. In reality, it’s a set of decisions made at different levels. This article breaks down those levels and explains why mixing them leads to poor architectural trade-offs."
slug: software-architecture
image: /static/images/arch.png
date: "2026-01-26"
---

Architecture discussions often fall apart before they even start.

You’ll see lists mixing MVC, microservices, Kafka, CQRS, Clean Architecture as if they were competing choices. As if you had to pick one and move on.

That’s not how real systems are designed.

Architecture isn’t a single decision.
It’s a set of decisions made at **different levels**, each answering a different question.

When those levels get mixed, teams don’t just get confused. They make bad trade-offs without realizing it.

This isn’t a tooling problem.
It’s a mental model problem.

## Architectural styles define the shape of the system

Architectural styles operate at the highest level.

They answer a simple but far-reaching question:

**How does this system exist in the world?**

This is where decisions affect:

- deployment
- scalability
- team boundaries
- operational complexity

Examples include:

- Monolith
- Modular monolith
- Microservices
- SOA
- Client–server
- Event-driven (at a macro level)

Choosing microservices doesn’t make your codebase well-structured.
Choosing a monolith doesn’t doom you to bad design.

This level defines the shape of the system, not the quality of its internals.

## Architectural patterns organize responsibilities inside the system

Architectural patterns work one level below.

They answer a different question:

**How are responsibilities and dependencies structured internally?**

This is where patterns like these live:

- MVC
- Layered architecture
- Hexagonal (Ports & Adapters)
- Clean Architecture
- Onion Architecture

These patterns are about:

- controlling dependencies
- isolating business rules
- improving testability and changeability

A common mistake is treating patterns as frameworks.
MVC isn’t Rails. Clean Architecture isn’t a folder called ``core``.

Frameworks implement opinions.
Architectural patterns guide decisions.

## Code organization is about clarity, not architecture

Code organization often gets mistaken for architecture.

It answers a much narrower question:

**Where does this code live?**

Examples include:

- Package by layer
- Package by feature
- Modular monolith structures

Rearranging folders without changing dependencies doesn’t improve architecture.
It just gives the problem a new address.

Good organization improves readability and maintenance, but it can’t compensate for unclear architectural decisions.

## Communication models define how parts interact

Communication models focus on interaction.

They answer:

**How do components exchange information?**

This includes:

- Request/response
- Pub/Sub
- Message queues
- Event streaming
- Webhooks

Using Kafka doesn’t give you an event-driven architecture.
It gives you a broker.

Communication is a building block, not a complete architectural strategy.

## Data-oriented architectures put state at the center

At this level, data becomes the primary design concern.

The question shifts to:

**How is state represented, written, and read over time?**

Common approaches:

- CRUD-centric architectures
- CQRS
- Event sourcing

These patterns solve real problems around scale, complexity, and auditability. But they introduce significant cognitive and operational cost.

They are not natural upgrades from CRUD.
They are deliberate responses to specific constraints.

## Advanced distributed architectures deal with inevitability

Some patterns only appear once distribution becomes unavoidable.

They answer a hard question:

**How do we survive failure in a distributed system?**

Examples include:

- Saga patterns
- Backend for Frontend (BFF)
- Strangler Fig
- Circuit breakers
- Bulkheads

These aren’t signs of architectural maturity by default.
They’re signs that trade-offs were accepted because the system demanded it.

Applied too early, they increase complexity without delivering value.

## All of this exists in the same system

Real systems don’t “choose one architecture.”

They combine decisions across levels.

A very common setup looks like this:

- Architectural style: monolith
- Architectural pattern: hexagonal
- Code organization: package by feature
- Communication: HTTP with async events
- Data model: CRUD
- Distributed patterns: none (yet)

Nothing here is contradictory.
Each decision operates at a different level.

## The real question isn’t “Which architecture do you use?”

That question assumes architecture is singular.

A better question is:

**At which level am I making this decision, and what problem am I actually solving?**

Architecture isn’t about fashionable names or checklists.
It’s the accumulated consequence of conscious trade-offs.

Once you understand the levels, you stop mixing concepts.
And once you stop mixing concepts, architectural decisions become clearer, calmer, and far more effective.

That’s when architecture stops being confusing and starts being useful.