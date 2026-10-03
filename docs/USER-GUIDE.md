# User Guide

Quick reference for actually running these labs. Different from [README.md](../README.md)
(curriculum, mission, lab index) and [learning-journal.md](learning-journal.md) (process notes,
cross-lab reflections) — this is the page for "what do I actually type to run lab 3?"

## Prerequisites (once)

- [LM Studio](https://lmstudio.ai/) running in developer/server mode at `http://localhost:1234/v1`
  (or `http://host.docker.internal:1234/v1` / your VM's host-only IP if running these from inside a
  VM — see `ai-cybersecurity-devops-lab/docs/INSTALL.md` for that pattern if unfamiliar).
- Models loaded: `qwen/qwen2.5-vl-7b`, `google/gemma-2-9b`.
- Python 3.12, plus `pydantic` (lab 3 only) and `chromadb` (lab 5 only).

## Graceful startup / shutdown

No persistent containers or VM here — just LM Studio (external) and, for lab 4 only, a background
mock API process. "Graceful" mostly means not leaving lab 4's background process orphaned:

**Starting lab 4:**
```bash
cd lab4
python firewall_api.py &   # note the PID it prints, or find it later with: pgrep -f firewall_api.py
```

**Stopping lab 4 cleanly** (don't just close the terminal and leave it running):
```bash
pkill -f firewall_api.py
# or, if you noted the PID above:
kill <pid>
```

**LM Studio itself:** stop its server from the Developer tab's own stop control rather than closing
the whole app while a request might be in flight — a hard-killed model process can leave GPU memory
not released until LM Studio (or the machine) restarts.

## Running a lab

Labs 1, 2, and 4 have a separate attack script and defended script — run the attack first to see it
succeed, then the defended version to see it fail against the same technique:

```bash
cd lab1
python lab1_system_extraction.py   # the attack — watch it leak the "secret"
python lab1_defended.py            # the same attack, now caught/redacted
```

**Lab 4 has an extra moving part** — a mock firewall API that the agent actually calls:

```bash
cd lab4
python firewall_api.py &           # start the mock API first, in the background
python lab4_excessive_agency.py    # the attack — model calls the firewall on its own
python lab4_defended.py            # same scenario, now gated by least-privilege + human approval
```

**Lab 5 needs its vector DB populated first:**
```bash
cd lab5
python setup_vector_db.py          # seeds ChromaDB, including the planted poisoned document
python lab5_rag_exploit.py         # the attack/defense comparison
```

**Lab 2 has two variants** of the indirect-injection attack:
```bash
cd lab2
python lab2_indirect_injection.py
python lab2_indirect_injection2.py
python lab2_defended.py
```

## Quick reference

| Lab | Script(s) | Extra setup |
|---|---|---|
| 1 | `lab1_system_extraction.py`, `lab1_defended.py` | none |
| 2 | `lab2_indirect_injection.py`, `lab2_indirect_injection2.py`, `lab2_defended.py` | none |
| 3 | `lab3_structured_parser.py` | `pip install pydantic` |
| 4 | `firewall_api.py` (run first), `lab4_excessive_agency.py`, `lab4_defended.py` | none beyond the API |
| 5 | `setup_vector_db.py` (run first), `lab5_rag_exploit.py` | `pip install chromadb` |

Labs 3 and 5 don't have a separate `_defended.py` file — the defended behavior for those two is
shown as a code comparison inside that lab's own `labN_explanation` write-up rather than a second
runnable script. Each lab's `labN_explanation` file has the precise expected output either way.

## Live site (no setup needed)

**→ https://cv-ai-sec.github.io/Cybersecurity_AI_Learning/**

Static, no build step, not connected to your local LM Studio — safe to share as a link without
running anything.

## Common issues

- **`ConnectionRefusedError` / `openai.APIConnectionError`:** LM Studio's server isn't running, or
  isn't on the port/host the script expects — check the script's base URL constant against LM
  Studio's actual Developer-tab address.
- **Lab 4's attack script hangs or errors immediately:** `firewall_api.py` isn't running yet — it
  needs to be started first and left running in the background.

For the curriculum, the reasoning behind the lab ordering, and cross-lab takeaways, see
[README.md](../README.md) and [learning-journal.md](learning-journal.md).
