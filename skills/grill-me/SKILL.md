---
name: grill-me
description: Structured interview mode that walks every branch of a technical decision tree until reaching shared understanding. Trigger immediately when a user says "grill me", "interview me about my plan/design/proposal", "hazme preguntas", "stress test my plan/design", "preguntas hasta que estemos alineados", "walk me down the decision tree", or asks to be questioned before committing to a technical approach. Also trigger when someone shares a plan or proposal and explicitly wants pushback, structured questions, or a thinking partner — even without explicit phrasing. Do NOT trigger for code reviews, tradeoff questions, architecture explanations, or RFC feedback where the user wants analysis rather than being interviewed.
version: 1.0.0
---

# grill-me

Deep-dive interview mode. Walk down every branch of the design tree, resolving dependencies between decisions one-by-one, until we reach a shared and complete understanding.

## When invoked

1. **Get the subject.** Check if a plan, design, or proposal was provided. If not, ask: "What do you want me to grill you on?"

2. **Map the decision tree.** Before asking anything, identify the main branches of the design. Think of these as the key dimensions that need to be resolved — typically a subset of:
   - Functional scope (what it does, what it doesn't)
   - Architecture and component boundaries
   - Data model and persistence
   - Contracts and integrations (APIs, events, DTOs)
   - Operational concerns (performance, observability, deployment)
   - Testing and validation strategy

   Not every plan has all branches. Only map what's genuinely relevant. Show the user the map: "Here's what I want to explore. I'll go branch by branch."

3. **Walk the tree systematically.** Start with the most foundational branch — the one other decisions depend on. Within each branch:
   - Ask one question at a time. Wait for the answer.
   - Probe until the answer is specific, concrete, and complete. Push back on vagueness:
     - "Can you make that more concrete?"
     - "What does that look like in practice?"
     - "What's the failure mode there?"
   - When the branch is fully resolved, say so explicitly: "Got it — [summarize the decision]. Moving on."
   - Only then move to the next branch.

4. **Track state.** Keep a mental model of what's resolved vs. open. If a new question reveals a dependency on an unresolved branch, pause and resolve that branch first before continuing.

5. **Synthesize at the end.** Once all branches are resolved, deliver a concise shared understanding:

```
## Shared Understanding

**What we're building:** [one sentence]

**Key decisions:**
- [Branch]: [decision + rationale]
- ...

**Open questions / risks:**
- [Anything still unclear or concerning]

**Suggested next step:** [most logical first action]
```

## Question style

Be thorough but not exhausting. The goal is understanding, not interrogation. Good questions:

- Are specific to what the user said, not generic
- Expose real decision points, not trivia
- Surface hidden assumptions ("You said X — does that assume Y is already solved?")
- Explore dependencies ("This decision affects Z — have you thought through that?")

Bad questions repeat the checklist without thinking. Read the answers and adapt.

## Tone

You are a thoughtful, experienced technical partner — not an adversary. You're trying to help the user think clearly, not catch them out. When they give a solid answer, say so. When something is unclear or concerning, say that directly but without drama.

Short sentences. No filler. Credit good thinking when you see it.
