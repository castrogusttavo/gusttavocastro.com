---
title: git commit -m 'first commit'
description: ""
slug: git-commit-first-commit
image: /static/images/first-commit.png
date: "2025-05-23"
---

## Motivation

From day one, we knew code.dev couldn’t just be “another coding challenge platform.” We wanted something modern, fast, and fun. But to get there, the architecture had to deliver.

## Why care so much about architecture?

Think slow execution, unrealistic environments, outdated challenges — no one wants to use a platform like that.

To build a **multi-language** and **multi-region** coding challenge platform, the bar is high.

We started with three core principles:

1. **High concurrency** – we need to handle hundreds of simultaneous submissions without choking.
2. **Isolated execution** – each submission runs in a sandbox with strict resource limits.
3. **Real-time data** – WebSockets for instant updates, fast feedback, and a top-notch UX.

## Architecture overview

From the frontend to the database, everything was designed with speed and resilience in mind. We're using **Next.js with SSR**, **JWT-based authentication**, and global state management.

All service communication goes through **REST** (via an API Gateway) and **WebSockets** for real-time events — like submission status and live progress updates.

<figure>
  <img src="\static\images\frontend-arch.png" class="post-image-full" alt="Frontend Architecture">
  <figcaption class="post-image-caption">Frontend Architecture</figcaption>
</figure>

<figure>
  <img src="\static\images\backend-arch.png" class="post-image-full" alt="Backend Architecture">
  <figcaption class="post-image-caption">Backend Architecture</figcaption>
</figure>

## Microservices in action

Our microservice architecture lets us scale each part of the platform independently. We have dedicated services for **auth, challenges, submissions, execution, and users** — all talking to each other via **RabbitMQ** using async messaging.

Every service has its own **Redis** cache, strict limits, and can be scaled on demand. We're now building the worker and observability layer on top of that.

<figure>
  <img src="\static\images\microsservices.png" class="post-image-full" alt="Microservices example">
  <figcaption class="post-image-caption">Microservices example</figcaption>
</figure>

If you want a deeper dive into what microservices are and why we went with this model, check out our [Microservices newsletter](link).

## Secure code execution

Every submission gets processed by a worker that runs the code inside an isolated **Docker container**. We monitor execution time and memory usage to prevent abuse.

Validation is fully automated and returns a clear status: **success**, **compilation error**, **timeout**, or **test failure**.

<figure>
  <img src="\static\images\code-exec.png" class="post-image-full" alt="Submit Service FlowChart">
  <figcaption class="post-image-caption">Submit Service FlowChart</figcaption>
</figure>

## A database for every job

There’s no one-size-fits-all database. So we use the right tool for each need:

1. **PostgreSQL** – our main relational database.
2. **MongoDB** – for detailed execution logs and tracking.
3. **Redis** – for low-latency caching and session storage.

Every choice was about balancing performance with flexibility.

## Rankings, gamification & notifications

DX (developer experience) is also about fun. Earned XP? Leveled up? That should feel instant.

We’re using **per-challenge scoring**, **language-specific leaderboards**, and soon: **badges, streaks, and achievements** — all powered by **real-time WebSockets**. And to make sure no one misses a beat, we’ve got **emails and notifications** in place too.

Want to dig into our gamification model? Check out our [Gamification newsletter](link).

## Security at every layer

\[ For your safety, we’ll keep this section short lol ]

Every execution runs inside a secure container. Our APIs have **rate limiting** to stop abuse, and we use **Sentry** to catch anything weird before it becomes a problem.

Security’s not an add-on — it’s baked in.

## Shoutouts

To design all this and truly understand what we needed, we studied a lot and leaned on inspiration from awesome creators. Huge thanks to:

* [Augusto Galego](https://www.youtube.com/@GutoGalego)
* [Diego Fernandes](https://www.youtube.com/@rocketseat)
* [Renato Augusto](https://www.youtube.com/@RenatoAugustoTech)
* [Lazar Nikolov](https://www.youtube.com/@nikolovlazar)
* [Lucas Montano](https://www.youtube.com/@LucasMontano)
* [O'Reilly – books](https://www.oreilly.com/)

And of course, a massive shoutout to [**deyvin**](https://www.youtube.com/@manodeyvin) — without him, I’d have totally lost it.

<figure>
  <img src="\static\images\influencers.png" class="post-image-full" alt="The besters">
  <figcaption class="post-image-caption">The besters</figcaption>
</figure>

## Lessons & next steps

Starting from scratch with microservices, queues, and observability was one of the best decisions we made. **Scalability, performance, and observability** aren’t wishlist items — they’re required from day one.

We’re still building the platform with focus on **streaks**, **visual gamification**, and the **Boss Fight** mode. Every layer of the architecture is designed to support this growth — without rewriting everything later.

This was our first commit. Many more are coming.

If you’re into this kind of behind-the-scenes tech stuff and want to follow along, stick around.

Because at code.dev, we don’t just write code — we’re writing history.
