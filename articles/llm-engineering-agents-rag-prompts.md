---
title: Before you build an agent, try solving it with one call
description: "AI stopped being a weekend experiment and became a serious part of the roadmap. A practical map of LLM engineering: why most problems don't need an agent, why RAG is a search problem before it's an AI problem, and what changes with models that follow instructions more literally."
slug: llm-engineering-agents-rag-prompts
image: /static/images/llm-engineering.png
date: "2026-08-31"
---

AI stopped being a weekend experiment and became part of what we're actually building. That changes the standard of rigor.

Worth organizing what we've learned before any product decision about where AI fits in.

---

## An LLM isn't magic. It's token prediction

A language model predicts the next chunk of text given a context. Everything that looks like reasoning emerges from that prediction over a context window — the model's working memory, which runs out and gets lost between one call and the next, because the model doesn't hold state on its own.

That reframes what "engineering" means in this space: almost all of the work is putting the right information inside the context and validating what comes out the other side. In spirit, it's no different from any system that takes untrusted input and needs to produce trustworthy output — except here the "function" in the middle is probabilistic, not deterministic.

---

## Start simple: three levels of complexity

There's a clear hierarchy, and the temptation is to jump straight to the top:

1. **Single call** — classify, summarize, extract, answer a question.
2. **Workflow** — several calls chained together, orchestrated by code you write.
3. **Agent** — the model decides the next steps on its own, with tools available to it.

The practical rule is to only move up a level when the level below genuinely doesn't solve it. An agent costs more latency, more tokens, and makes more mistakes than a deterministic workflow — because part of the decision about what to do stopped being yours and became the model's.

Building an agent for a problem a single call would solve isn't sophistication. It's unnecessary cost and risk dressed up as innovation.

---

## RAG is a search problem before it's an AI problem

Giving a model access to knowledge it doesn't have — private, recent, specific data — follows a two-phase pattern: index documents offline, breaking them into chunks and turning each one into a vector; and, at query time, retrieve the chunks most similar to the question before asking for an answer.

The detail most people underestimate: the quality of the final answer is a ceiling imposed by the quality of the search. An excellent model given the wrong chunks produces a wrong answer with the same confidence as a correct one. Most of the effort in doing RAG well isn't in tuning the prompt — it's in improving how documents are chunked and retrieved.

Even with massive context windows capable of taking in an entire corpus at once, retrieving only what's relevant still pays off: fewer tokens, lower cost, and the model's attention focused on what matters instead of diluted across everything.

---

## Prompt engineering changed with more literal models

More recent models follow instructions more literally than previous ones. That's an advantage — but it also means tricks inherited from older models, like all-caps instructions shouting urgency, now trigger exaggerated behavior instead of simply being ignored as noise.

Two practices still hold, regardless of model generation: separating instruction from data with explicit delimiters — which also reduces the risk of malicious content embedded in the data being interpreted as a command — and breaking a complex task into smaller steps instead of a single prompt trying to do ten things at once.

A vague prompt produces a generic output. That was never not true.

---

## An agent is a distributed system in miniature

The loop of an agent with tools is simple to describe: the model decides to call a tool, something executes that call, the result goes back to the model, and the loop repeats until the task is done.

What that loop demands in practice is exactly what any distributed system demands: validate untrusted input — the arguments the model generates for a tool aren't guaranteed to be safe —, require human confirmation before any irreversible action, and cap the number of iterations before an endless loop turns into an unexpected bill.

There's also an attack vector specific to this architecture: the result a tool brings back — a page's content, an API's response — can contain instructions disguised as data. Treating every tool result as untrusted input, never as a command, is basic defense.

---

## What this changes about how you measure quality

"I improved the prompt" with no way to measure it is opinion, not engineering.

Evaluating an AI-backed system needs to separate two questions: is the search retrieving the right material, and is the final answer faithful to that material. Conflating the two — blaming the model when the problem was the search, or vice versa — is the most common way to waste time optimizing the wrong piece.

---

## The takeaway

AI engineering isn't about the model.

It's about taming a probabilistic component inside a system that still needs to be predictable enough for someone to trust it. The model delivers intelligence; the engineering delivers the edges — the right context, output validation, action limits, and an honest way to measure whether it's working.
