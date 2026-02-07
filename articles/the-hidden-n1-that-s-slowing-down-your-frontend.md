---
title: The hidden N+1 that’s slowing down your frontend
description: "A practical look at how N+1 creeps into APIs and databases and how to remove it before it kills performance."
slug: the-hidden-n1-that-s-slowing-down-your-frontend
image: /static/images/n1.png
date: "2026-02-07"
---

A paga takes 3 to 5 seconds to load.

Frontend opens DevTools.

Only onde API request.

"Network looks fine. Must be React."

It's almost never React.

It's usually the backend politely hammering the database 100 times per request.

N+1 is one of those problems that:
- doesn't show up in the UI
- doesn't look wrong in code
- but quietly murders performance

If you work on backend and don't know how to spot it, you're basically shipping latency by default.

Not dramatic. Just reality.

## What is N+1 (without the academic fog)

At its core:

You fetch a list of one (1)
Then fetch related data individually (N)

**Total: 1 + N operations**

Example:
- ``GET /users``
- for each user -> ``GET /users/:id/posts``

If you have 50 users:
- 1 request for users
- 50 requests for posts

51 round trips.

Congratulations, you reinvented dial-up.

[diagrama](/static/images/diagram/n1-example.png)

## Where it happens (twice, which is worse)

People think N+1 is just a database problem.

It's not.

It happens in two layers:

###Frontend -> Backend (API level)

Multiple HTTP calls

###Backend -> Database (DB level)

Multiple queries

And yes, you can have both at the same time.

A masterpiece on inefficiency.

[diagrama2](/static/images/diagram/back-front-db.png)

That's multiplicative pain, not additive.

## The API version (Frontend suffering first)

Imagine:
- ``GET /users``
- ``GET /users/:id/posts``

Your UI needs:

User + their posts.

So you do:

```ts
const users = await getUsers()

for (const user of users) {
  const posts = await getPosts(user.id)
  user.posts = posts
}
```

Each request ~100ms.

50 users:

100ms × 51 ≈ 5 seconds.

The math isn't subtle.

The cost is not the CPU.
It's network round trips.

Even if everything is "fast", latency stacks.

###First instinct solutions

You start inventing endpoints:
- ``GET /users-with-posts``
- ``GET /posts?userIds=[]``
- ``Backend for Frontend (BFF)``

They work.

But...

Every new screen = new custom endpoint.

Soon your backend looks like:
```bash
/users-with-posts
/users-with-3-posts
/events-with-users
/posts-with-comments
/mobile-dashboard-v2-data
```

Congratulations, your build an API shaped exactly like your UI.

Maintenance becomes archaeological work.

## Why GraphQL even exists

This exact pain is what pushed Facebook (now Meta) to create GraphQL.

They basically said:

"Frontend, just tell me the shape you want."

Instead of:
- many specialized endpoints

You send:
```json
{
  users: {
    id,
    name,
    posts: {
      title,
      content
    }
  }
}
```

One request. Nested data.

Backend figures it out.

[diagrama3](/static/images/diagram/graphql-example.png)

Important nuance:
GraphQL solves the API N+1, not automatically the DB N+1.

You can still destroy performance inside resolvers if you're careless.

GraphQL is not magic. It's just better plumbing.

## The original sin: Database N+1 (ORM edition)

This is the classic one.

And it's sneakier.

Example:
```py
users = User.objects.all()

for user in users:
    for post in user.posts:
        ...
```

Looks innocent.

Under the hood:
- 1 query -> users
- N queries -> posts per user

ORM lazy loading:
"Let's fetch only when needed."

Whick sounds smart.

Until it becomes 200 queries.

Lazy loading is basically:
"I'll optimize later."

Later never comes.

## What actually fixes it

NO fairy dust. Just being explicit.

### Joins / eager loading

Load everthing at once.

SQL:
```sql
SELECT * FROM users LEFT JOIN posts ON posts.user_id = users.id
```

ORM:
- include
- preload
- prefetch_related
- eager

Different names, same idea.

One query instead of N.

[diagrama4](/static/images/diagram/join-example.png)

### Batch by IDs

If you already have IDs:
```sql
SELECT * FROM posts WHERE user_id IN (...)
```

Two queries total:
- users
- posts for all users

Way better than 51.

Trade-off: you merge in memory.

Still cheaper than 50 round trips.

### DataLoader / batching (GraphQL or services)

Group multiple small lookups:

Instead of:
- 50 calls
Do:
- 1 batched all

Classic DataLoader pattern.

Especially useful in GraphQL resolvers.

### Measure queries per request

This one is boring, so people skip it.

And then wonder why production is slow.

Add:
- query logs
- slow query logs
- APM
- "queries per request" metrics

Rule of thumb:
- 1 to 3 queries: normal
- 10+: suspicious
- 100+: you messed up

No philosophy required.

## Assumptions people get wrong

Let’s challenge some common beliefs.

**“It’s just one endpoint, so it’s fine”**
Wrong.
One endpoint can execute 200 queries.

**“ORM handles performance”**
Wrong.
ORM handles convenience. You handle performance.

**“GraphQL fixes it”**
Half wrong.
It fixes API shape, not database behavior.

**“Caching will save me”**
Only masks the problem.

If a cold request is slow, your design is slow.

## Trade-offs (because nothing is free)

Fixing N+1 often means:
- more complex queries
- less “cute” ORM code
- thinking about data shape upfront

In exchange you get:
- lower latency
- fewer requests
- less infra cost
- happier frontend
- fewer “React is slow” myths

Seems like a decent deal.

## Practical checklist

Before shipping an endpoint:
- how many queries does this run?
- am I loading relations inside loops?
- can I join or batch?
- can I reduce round trips?
- do I really need this many calls?

If you don’t know the answer, you probably already have an N+1.

## Conclusion

N+1 is not a micro-optimization problem.

It’s architectural.

It appears:
- between frontend and backend
- between backend and database
- in REST
- in GraphQL
- in every ORM

It shows up in almost every company eventually.

Learning to spot it is basically a rite of passage for backend engineers.

Ignoring it just turns your frontend into the scapegoat.

And React didn’t do anything wrong.
It just wanted some JSON.
