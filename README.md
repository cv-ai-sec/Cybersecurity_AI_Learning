# LLM Security Labs

**Live tracker:** _enable GitHub Pages (Settings → Pages → Deploy from `main`) and this link will
serve `index.html`:_ `https://<your-username>.github.io/llm-security-labs/`

## Mission

I'm actively upskilling in AI security — prompt injection defense, agentic tool-execution
guardrails, and RAG/vector context poisoning — by red-teaming and then defending real LLM
application patterns, entirely against models running on local infrastructure. This repo is the
hands-on evidence of that work: every attack shown here was actually run, and every defense was
re-run against the same attack to confirm it holds.

## Curriculum

A five-part series moving through the OWASP Top 10 for LLMs in increasing order of blast radius —
from a leaked secret, to a misled human analyst, to a corrupted automated decision, to an active
tool-execution breach, to a poisoned shared knowledge base. See [docs/learning-journal.md](docs/learning-journal.md)
for the reasoning behind that ordering and the patterns that carried across labs.

## Artifacts & Evidence

Each lab folder contains the runnable attack script, the corresponding defended version, and a
`labN_explanation` write-up (objective, attack mechanics, actual observed result, defense,
takeaway). The table below is the index; `index.html` is the same index as an interactive,
checkable progress tracker.

## Setup

- [LM Studio](https://lmstudio.ai/) running in developer/server mode, exposing an OpenAI-compatible local endpoint (`api_key="lm-studio"` is a placeholder required by the SDK, not a real credential — no external API keys are used anywhere in this repo).
- Models used: `qwen/qwen2.5-vl-7b`, `google/gemma-2-9b`.
- Python 3.12, plus `pydantic` (lab 3) and `chromadb` (lab 5).

## Labs

| Lab | OWASP Focus | Attack | Defense |
|---|---|---|---|
| [lab1](lab1/) | LLM01 / LLM02 / LLM07 — Prompt Injection & Sensitive Info Disclosure | JSON pre-fill trick forces the model to complete and leak a "confidential" system key | Regex-based egress filtering that detects and redacts leaked secrets before output |
| [lab2](lab2/) | LLM01 — Indirect Prompt Injection via untrusted files | Malicious instruction hidden inside an SSH username field in a log file, attempting to get the AI "SOC analyst" to whitelist the attacker's IP | XML boundary wrapping (`<log_data>`) and delimiter sanitization to isolate untrusted data from instructions |
| [lab3](lab3/) | LLM02 — Insecure Output Handling | Forcing strict structured JSON (Pydantic schema) output reduces the model's ability to enforce soft system instructions, letting an indirect injection flip `BLOCK_IP` to `MONITOR` | Combining schema validation with deterministic Python business-logic checks so injected text can't silently downgrade a verdict |
| [lab4](lab4/) | LLM03 / ASI02 — Excessive Agency & Unsafe Function Calling | Model is given the ability to call a real firewall API based on its own reasoning, turning a data-integrity issue into a potential system breach | Least-privilege tool scoping and human-in-the-loop confirmation before any state-changing action |
| [lab5](lab5/) | LLM08 / LLM09 — RAG & Vector/Embedding Weaknesses | A poisoned document planted in a ChromaDB knowledge base gets retrieved alongside legitimate threat intel and convinces the model to override a threat verdict via a fake "system directive" | Treating retrieved RAG context as passive, untrusted data (containment tags), metadata/ACL tiering, and keeping the LLM as an advisor rather than the final policy enforcer |

## Key takeaways

- Structuring output (JSON/schema) can weaken a model's adherence to safety instructions — validate business logic in code, not just shape.
- Untrusted data (logs, RAG documents, tool outputs) must be wrapped and treated as inert data, never as instructions, regardless of how authoritative it reads.
- An LLM connected to real tools/APIs needs least-privilege scoping and human approval for any consequential action — never treat it as the final decision-maker for security enforcement.
- Vector search relevance is not a security boundary; RAG pipelines need the same access control and provenance thinking as any other data source.

Detailed write-ups with full attack/defense transcripts are in each lab's `labN_explanation` file.
Process notes and cross-lab reflections are in [docs/learning-journal.md](docs/learning-journal.md).

## Repository structure

```
/
├── index.html          # Interactive dashboard / progress tracker (GitHub Pages entry point)
├── assets/              # Dashboard styles and tracker script
├── docs/                # Process notes and cross-lab reflections
├── lab1 .. lab5/        # Attack script, defended script, and write-up per lab
└── README.md
```

## Disclaimer

Educational red-teaming against models running entirely on local infrastructure. No production systems, third-party services, or real credentials were involved.
