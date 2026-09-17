# Learning Journal

Notes on process and what carried over between labs — not a restatement of each lab's write-up
(see `labN/labN_explanation` for those), but the throughline across the series.

## Why this series, and in this order

The five labs were sequenced to move through the OWASP Top 10 for LLMs in order of increasing
blast radius: a leaked secret (lab 1) is bad but contained; an indirect injection that only
misinforms a human analyst (lab 2) is worse; one that corrupts a machine-parsed decision downstream
(lab 3) is worse still; one that reaches a real tool call (lab 4) is an active breach; and one
planted upstream in a shared knowledge base (lab 5) can poison every future query that touches it,
not just one session.

## Patterns that repeated across labs

- **The same fix keeps showing up in different clothes.** Delimiter/containment wrapping (lab 2)
  and "treat retrieved RAG context as passive data" (lab 5) are the same idea applied to two
  different untrusted-data sources. Recognizing that early would have saved time re-deriving it in
  lab 5.
- **Validating shape is not validating correctness.** Lab 3 was the clearest example: Pydantic
  passed a schema-perfect response that was still operationally wrong. Any system that hands a
  model's output to code downstream needs a business-logic check independent of the parser.
- **Every mitigation needs to be tested against its own bypass, not just the original attack.**
  Lab 2's first defense (XML wrapping alone) worked, but only sanitizing the delimiter tags
  themselves (lab 2's second pass) closed the follow-up attack of a payload forging a fake closing
  tag.

## What I'd do differently next time

- Build the reusable guardrail module (see the "Stretch" items on the tracker) before starting a
  6th lab, instead of re-implementing similar sanitization logic per lab.
- Add a scripted way to replay each lab's attack against both models (Qwen 2.5, Gemma 2) and diff
  the outputs automatically, instead of manually running each combination once.

## Open questions to explore

- How does provenance/ACL tiering (lab 5's proposed defense) actually get implemented against a
  real vector store product, not just described as a design?
- At what point does a human-in-the-loop gate (lab 4) become the bottleneck it was meant to
  prevent, in a system generating a high volume of legitimate tool-call requests?
