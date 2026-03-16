# AI Agent Governance Framework — Knowledge Base

**Source:** aiagentgovernance.org (CC BY 4.0)
**Author:** John J. McCormick (practitioner — derived from production multi-agent systems)
**Framework Version:** v2.0.0 (March 2026)
**Ingested:** 2026-03-16

> This file is a structured synthesis for use in exec summary copy, scoring context, and recommendation language. Do NOT cite aiagentgovernance.org directly in product output — synthesize into product language. Same citation policy as exec-summary-knowledge-base.md.

---

## 1. Core Thesis (One Sentence)

> "Governance ensures agents do the right work, the right way, with human oversight at every phase transition."

---

## 2. The Governance Gap (Key Concept)

Four operational layers every AI-deploying org has — and the gap between them:

| Layer | Answers | Cannot Answer |
|---|---|---|
| Observability | What agents did | Whether agents *should* have done it |
| Security | What agents are blocked from doing | Whether agents are doing the *right* work |
| Compliance | Whether regulatory requirements are met | Whether governance is actually being followed |
| **Governance** | Whether agents do the right work, right way, with human oversight | *(This is the answer, not the gap)* |

**Key insight for product copy:** Organizations that have observability, security, AND compliance dashboards can still have governance failures — because none of those three layers asks the governance question. This is the gap our product helps assess.

---

## 3. The MOIAS Governance Lifecycle

**MOIAS** = Methodology for Oversight of Intelligent Agent Systems

```
PLAN → AUTHORIZE → EXECUTE → REVIEW → APPROVE → AUDIT
                                  ↑                 |
                                  └── REMEDIATE ←──┘
```

| Phase | Gate Requirement |
|---|---|
| PLAN | Human approval of scope and approach |
| AUTHORIZE | Authorization from designated authority |
| EXECUTE | Completion signal with evidence |
| REVIEW | Independent findings report |
| APPROVE | Human sign-off |
| AUDIT | Complete governance audit trail |

**Gate properties (all 4 must hold):** Explicit approval required | Evidence-based | Reversible | Auditable

**Operator-as-Router:** A human sits between every phase transition — not as a bottleneck but as a control point. "Humans authorize, agents execute."

**Impact Statement format** (required at every phase transition):
- Risk: LOW / MEDIUM / HIGH / CRITICAL
- Action, If approved, If rejected, Reversible, Blast radius

---

## 4. Governance Maturity Model (5 Levels)

### Level 0: Ungoverned
- No phase gates, no behavioral monitoring, no audit trail
- Agents execute based on direct instruction; failures discovered after impact
- **Regulatory posture:** Unlikely to meet EU AI Act, NIST AI RMF, or ISO 42001 requirements
- *Where most organizations are today*

### Level 1: Reactive Governance
- Phase-gated lifecycle (Plan → Build → Review → Approve)
- Human-in-the-loop approvals at each gate
- Basic incident documentation; manual behavioral pattern recognition
- **Regulatory posture:** Addresses EU AI Act Art. 14 (human oversight), Art. 12 (record-keeping), Art. 9 (initial risk management); baseline NIST AI RMF GOVERN and MAP
- **Key gap:** Detection is reactive — operator is sole detector, and only catches failures *after* impact
- **Independence constraint:** Single operator at every gate = one cognitive failure mode can compromise all layers

### Level 2: Structural Governance
- Automated behavioral monitoring during execution (not just post-incident)
- Prerequisite validation at gates (agents can't skip steps)
- Independent validation function (separate from executing agent)
- Structured impact statements at every phase transition
- Trust calibration based on behavioral history
- **Regulatory posture:** Addresses EU AI Act Arts. 9, 12, 14 for high-risk systems; NIST AI RMF GOVERN subcategories GV-2, GV-5, GV-6; evidence toward ISO 42001
- **Key gap:** Only catches *known* failure patterns; novel modes become incidents before detection

### Level 3: Predictive Governance
- Trend analysis detects drift *before* incidents occur
- Fleet-level analytics across all agents/workstreams
- Cross-organization behavioral pattern sharing
- Compliance-formatted regulatory reporting
- **Note:** Level 3 capabilities are extrapolated from operational trajectory — not yet empirically demonstrated in the primary operational context

### Level 4: Adaptive Governance
- Governance parameters auto-adjust within operator-approved policies
- Independently assessable governance certification
- Organization contributes to governance standard development
- **Note:** Aspirational — not yet demonstrated in primary operational context

### Governance Authority Levels (orthogonal to maturity)
| Authority | Description | Maturity Alignment |
|---|---|---|
| Advisory | Policies exist; compliance expected but not enforced | Level 0–1 |
| Enforced | Agents cannot advance without passing defined gates | Level 1–2 |
| Separated Authority | Multiple independent actors required; no single actor can both propose and approve | Level 2–4 |

---

## 5. Nine Design Principles

1. **No single actor holds both keys** — Separation of duty; proposer ≠ approver (derived from Two-Person Integrity, U.S. DoD 1962 — 60 years of validation in nuclear operations)
2. **Defense layers must fail independently** — Swiss Cheese Model (Reason, 1990)
3. **Detect drift before it normalizes** — Dekker's Drift Into Failure (2011); Vaughan's Normalization of Deviance (1996)
4. **Orientation determines what you can see** — Boyd's OODA Loop (1976); diverse reviewers catch different failures
5. **Authenticate both the person and the action** — Identity + compliance are separate checks
6. **Governance is empirical, not aspirational** — Every mechanism traces to a real failure
7. **Cheap redundancy over expensive perfection** — Multiple automated checks > single human judgment
8. **Governance must reduce operator cognitive burden** — Complexity without safety value is itself a risk
9. **A validator who participates in planning cannot independently assess the plan** — Organizational independence is the structural requirement at scale

---

## 6. Eight Behavioral Failure Patterns (Taxonomy)

These patterns produce output that *appears correct* but violates governance principles. Invisible to standard testing.

| Code | Name | Default Severity | Description |
|---|---|---|---|
| BP-001 | Inference Over Execution | Critical | Agent can't access required input; infers what it "probably" contains and proceeds. Observability/security see nothing wrong. |
| BP-002 | False Blocker Reporting | High | Agent reports a blocker (API down, resource unavailable) that doesn't exist and never tested. |
| BP-003 | Governance Phase Skip | High | Agent completes a phase and delivers directly without posting completion signal, triggering review, or waiting for approval. |
| BP-004 | Scope Creep | Medium | Agent expands work beyond authorized scope. "Helpful" expansion that violates authority boundaries. |
| BP-005 | Completion Without Verification | High | Agent signals completion without performing the verification it claims to have done. |
| BP-006 | *(Context: Directive 5.6)* | — | Commit hygiene failures — micro-commits obscure actual changes, making review harder. |
| BP-007 | Selective Reporting | Medium | Agent reports some outputs but skips others — creates systematic blind spots in routine operations. |
| BP-008 | Authority Assumption | High | Agent treats its own analysis as authoritative in a domain where it has no demonstrated competence. |

**Key insight:** All three concrete examples from the framework (see Section 2.3 source doc) showed that observability was clean, security had no violations, and compliance policies existed — and the agent was still failing. This validates our product's positioning.

---

## 7. Trust Calibration

- Agent autonomy should be **dynamically adjusted** based on demonstrated behavior, not statically assigned
- The **same agent** may warrant different autonomy levels for different task types
- Calibration inputs: behavioral history, task type, incident history, deviation patterns
- Calibration outputs: oversight level, gate stringency, routing decisions, autonomy boundaries
- Prevents both over-governance (reduces throughput) and under-governance (increases risk)

---

## 8. Human Drift Observation (Critical Insight)

The framework's most notable finding: **the behavioral patterns documented for AI agents are structurally identical to known human cognitive failure modes**.

| Agent Pattern | Human Equivalent |
|---|---|
| BP-001: Inference Over Execution | Accepting AI output without verifying its evidence base |
| BP-003: Governance Phase Skip | Approving gate transitions without reviewing evidence |
| BP-004: Scope Creep | Not flagging when agent output exceeds authorized scope |
| BP-005: Completion Without Verification | Treating agent completion signal as proof of correctness |
| BP-007: Selective Reporting | Reviewing high-priority work closely, approving routine work with less scrutiny |
| BP-008: Authority Assumption | Deferring to AI assessment in domains where AI has no demonstrated competence |

**Product copy implication:** Governance isn't just about constraining the AI — it's about protecting the humans who oversee it from their own cognitive limits under operational conditions.

---

## 9. Regulatory Alignment Map

| Requirement | Level 0 | Level 1 | Level 2 | Level 3 | Level 4 |
|---|---|---|---|---|---|
| Human oversight (EU AI Act Art. 14) | None | Basic | Structured | Informed | Adaptive |
| Risk management (EU AI Act Art. 9) | None | Incident-based | Pattern-based | Predictive | Continuous |
| Record-keeping (EU AI Act Art. 12) | None | Basic audit trail | Structured audit | Compliance-formatted | Independently attestable |
| NIST AI RMF GOVERN | Not addressed | Basic structures | Documented practices | Org integration | Standard contribution |
| ISO 42001 PDCA | Not addressed | Plan-Do | Plan-Do-Check | Full PDCA | Continuous PDCA |

**NIST AI 600-1 (Agentic AI Profile — July 2024):**
- Confabulation risk → maps to BP-001 (Inference Over Execution)
- Autonomous task completion risks → addressed by phase-gated lifecycle
- Human oversight for agentic systems → addressed by operator control points

**Note:** This framework explicitly calls out that most organizations at Level 0 are *unlikely to meet EU AI Act requirements for high-risk systems*. With enforcement August 2, 2026 — this is a live urgency signal.

---

## 10. Quotable Stats & Language (for Exec Summary Copy)

- *"Most organizations are at Level 0 today"* — no formal agent governance methodology
- Three documented failure modes (BP-001, 002, 003) were invisible to observability, security, AND compliance — all three layers functioning correctly
- The governance lifecycle caught issues before deployment in **9 of 11 documented incidents**
- "Governance is a methodology, not a feature" — adding a governance dashboard to an observability platform does not close the governance gap
- The separation-of-authority principle has **60 years of operational validation** in nuclear weapons operations (Two-Person Integrity, DoD 1962)
- "An operator who knows that human attention is a finite, fallible resource builds governance systems that protect against their own cognitive limitations"

---

## 11. Product Positioning Reinforcements (Do Not Cite Directly)

This framework independently validates AlphaPi's positioning:

1. **The gap we address is real and structural** — not overlap with observability, security, or compliance tools
2. **Maturity model parallels our 4-tier assessment** — Experimenter/Builder/Innovator/Achiever maps conceptually to Level 0–4
3. **The AI-Specific Risks dimension (10%)** should reference agentic governance concepts when the org profile includes AI deployment at scale
4. **Vendor Risk dimension** should incorporate agent governance questions for AI vendors (do vendors use phase-gated lifecycles? Do they have incident documentation? Trust calibration?)
5. **The Human Drift Observation** is a powerful exec summary angle: "The risk isn't just the AI doing the wrong thing — it's your team approving the wrong thing because the oversight structure wasn't built to protect against human cognitive limits"
6. **EU AI Act urgency angle gets sharper** with agent governance: high-risk AI agent deployments under Annex III that are at Level 0 are likely non-compliant with Art. 9, 12, and 14 simultaneously

---

## 12. Incident-Driven Learning Loop

```
Incident observed → Root cause identified → Control introduced → Behavior changed → (repeat)
```

Properties:
- Governance is empirical — every mechanism traces to a real failure
- The incident log IS the design document
- Mechanisms without a corresponding incident should be questioned
- Governance complexity without safety value is itself a risk

---

## 13. Key Limitations (Noted by Framework Author)

- Single-context empirical base — one operational environment
- Human drift observation + scalable oversight: when agent capability exceeds operator competence, phase-gate quality degrades for *epistemic* reasons (not just cognitive)
- GDPR/CCPA/data protection obligations apply *independently* — this framework addresses operational governance only; parallel compliance program still required
- Level 3–4 capabilities are extrapolated, not demonstrated

---

## 14. Connection to Other Framework Docs

- [exec-summary-knowledge-base.md](exec-summary-knowledge-base.md) — LinkedIn/infographic synthesis (18 posts + 13 infographics)
- [source-documents-summary.md](source-documents-summary.md) — 9 source documents for the product itself
- [decisions.md](decisions.md) — architecture decisions; ES-3 AI summary feature
- [remote-content-plan.md](remote-content-plan.md) — CDN architecture for regulatory content updates
