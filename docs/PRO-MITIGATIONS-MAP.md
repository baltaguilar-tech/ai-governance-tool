# Pro Output: Mitigation Map for All 60 Assessment Questions

## Executive Summary

Your assessment identified where your organization stands. This mitigation plan is your step-by-step roadmap for closing those gaps.

For each of the 60 assessment questions, you'll find a detailed remediation plan: what to implement, what tools to use (including free and open-source options), how long it should take, and what it will cost. Actions are broken into immediate (this week), short-term (this month), and medium-term (this quarter) priorities so your team can start now and build momentum over time.

The cost of inaction is measurable in regulatory penalties, litigation exposure, data breach liability, and lost revenue from stalled AI initiatives. Every unaddressed gap represents financial and legal exposure that compounds as your AI footprint grows. Organizations that govern AI well don't just avoid risk, they move faster. Start with the areas your assessment flagged as Critical or High risk, where closing gaps delivers the greatest protection to the business.

Re-run this assessment quarterly to track your progress and surface new risks as your AI landscape evolves. Each assessment builds on the last, giving your leadership team a clear, measurable view of how governance maturity is improving across every dimension. The organizations that treat AI governance as an ongoing practice, not a one-time exercise, are the ones best positioned to scale AI with confidence.

---

> **Format per question**: Question ID | Question text | Mitigation (what to do) | Recommended Tools | Timeline | Estimated Effort

---

## DIMENSION 1: AI Visibility & Sprawl Control (Shadow AI) — Weight: 25%

Shadow AI is the single largest governance blind spot for most organizations. Research shows employees average 3-5 AI tools each, and the majority are adopted without IT knowledge or approval. This dimension focuses on detecting, inventorying, and controlling unsanctioned AI tools before they create data leakage, compliance violations, or security incidents. Addressing shadow AI first delivers the highest return on governance investment because you cannot protect, regulate, or optimize what you cannot see.

---

### shadow-1: Does your organization have automated shadow AI detection tools deployed?

**Mitigation — Deploy Automated Shadow AI Discovery**

| Action | Detail |
|--------|--------|
| **Immediate (Week 1-2)** | Audit your CASB (Cloud Access Security Broker) logs and SSO logs for AI-related domains (openai.com, anthropic.com, midjourney.com, huggingface.co, etc.). Create a list of 50+ known AI service domains to monitor. |
| **Short-term (Month 1)** | Deploy a SaaS Security Posture Management (SSPM) tool or extend your existing CASB to flag AI tool usage. Configure alerts for new AI app OAuth connections. |
| **Medium-term (Quarter 1)** | Implement network-level DNS monitoring to catch AI tools accessed outside SSO. Set up monthly shadow AI reports for the governance committee. |

**Recommended Tools:**
- **Reco.ai** — SaaS security with AI app discovery, maps SaaS-to-SaaS AI integrations
- **Nudge Security** — Discovers SaaS (including AI) adopted without IT, maps OAuth grants
- **Netskope** — CASB with AI app categorization and DLP for AI services
- **Microsoft Defender for Cloud Apps** — If Microsoft ecosystem, discovers shadow AI via OAuth and traffic analysis
- **Zscaler** — Cloud proxy that can identify and control AI app access
- **DIY approach** — DNS/proxy log analysis + a maintained list of AI service domains (free but manual)

**Estimated Effort:** 2-4 weeks for basic discovery; 2-3 months for automated continuous monitoring
**Cost Range:** $5-15/user/year (SSPM) or $0 if extending existing CASB/proxy

---

### shadow-2: What percentage of AI tools in your organization are in a centralized inventory?

**Mitigation — Build and Maintain a Centralized AI Registry**

| Action | Detail |
|--------|--------|
| **Immediate (Week 1)** | Create a shared spreadsheet or database with columns: Tool Name, Vendor, Category (GenAI/ML/Automation), Business Owner, Data Accessed, Risk Tier, Approval Status, Date Added. Populate with all known AI tools. |
| **Short-term (Month 1)** | Survey all department heads: "What AI tools does your team use?" Include a list of 30+ common tools (ChatGPT, Copilot, Grammarly, Jasper, Midjourney, etc.) as prompts. |
| **Medium-term (Quarter 1)** | Migrate from spreadsheet to a proper IT asset management tool. Tag all AI assets. Require new AI tools to be registered before procurement. |
| **Ongoing** | Quarterly re-scan using shadow AI detection tools. Automatically add newly discovered tools to the registry. |

**Recommended Tools:**
- **ServiceNow CMDB** — If already using ServiceNow, add an "AI System" CI type
- **Oomnitza** — IT asset management with custom asset types for AI tools
- **Zluri** — SaaS management platform that auto-discovers AI tools
- **Simple start** — Airtable or Notion database with a structured template (free/cheap)
- **NIST AI RMF AI Inventory Template** — Free framework for what to track per system

**Estimated Effort:** 1-2 weeks for initial inventory; ongoing 2-4 hours/month to maintain
**Cost Range:** $0 (spreadsheet) to $3-8/user/year (SaaS management tool)

---

### shadow-3: Have you identified unauthorized AI applications used by employees?

**Mitigation — Conduct a Shadow AI Audit**

| Action | Detail |
|--------|--------|
| **Immediate (Week 1)** | Send an anonymous employee survey: "Which AI tools do you use for work? (no consequences for honest answers)." Frame it as enabling better tool support, not as punishment. |
| **Short-term (Week 2-3)** | Cross-reference survey results with SSO logs, expense reports (look for AI subscriptions), browser extension inventory, and CASB data. |
| **Short-term (Month 1)** | For each unauthorized tool found: assess the risk tier, determine if an approved alternative exists, and either (a) approve and add to registry, (b) migrate users to an approved alternative, or (c) block and communicate why. |
| **Ongoing** | Re-run the anonymous survey annually. Use automated detection (shadow-1) for continuous discovery. |

**Process to Remediate Discovered Shadow AI:**
1. Catalog the tool and its data access
2. Classify risk: What data is it accessing? Is it customer data, employee data, financial data?
3. Check vendor security: SOC 2? Data retention? Training on customer data?
4. Decision: Approve (add to registry), Replace (migrate to approved tool), or Block
5. Communicate decision and rationale to affected employees
6. If blocking: provide an approved alternative and migration support

**Estimated Effort:** 2-3 weeks for initial audit; 1 week/quarter for ongoing scans

---

### shadow-4: Do you have SaaS-to-SaaS AI exposure mapping?

**Mitigation — Map AI Integration Chains and Data Flows**

| Action | Detail |
|--------|--------|
| **Immediate (Week 1)** | List all AI tools from your registry. For each, document: What other apps does it connect to? What permissions/scopes does it have? (Check OAuth grants in your SSO/IdP admin console.) |
| **Short-term (Month 1)** | Create a visual data flow diagram showing how AI tools connect to your core systems (CRM, HRIS, email, file storage, databases). Highlight paths where sensitive data can reach AI services. |
| **Medium-term (Quarter 1)** | Deploy automated SaaS-to-SaaS mapping. Set up alerts when new OAuth connections are granted to AI services. |

**Recommended Tools:**
- **Reco.ai** — Automatically maps SaaS-to-SaaS connections including AI integrations
- **Nudge Security** — Maps OAuth grants and SaaS supply chain, flags AI-connected apps
- **Valence Security** — SaaS security with integration mapping
- **Obsidian Security** — Maps SaaS connections and detects anomalous AI access
- **Manual approach** — Review OAuth grants in Google Workspace Admin, Microsoft Entra, Okta, or your IdP. Export connected apps list.

**Key risk pattern to look for:** Low-trust AI app → connected to Slack → Slack connected to Google Workspace → Google Workspace has full PII access. The AI app now has a chain path to PII.

**Estimated Effort:** 1-2 weeks manual; 1-2 days with automated tooling
**Cost Range:** $5-15/user/year (SaaS security platform) or $0 (manual IdP review)

---

### shadow-5: Do you have an AI Acceptable Use Policy that employees must acknowledge?

**Mitigation — Draft, Publish, and Enforce an AI Acceptable Use Policy**

| Action | Detail |
|--------|--------|
| **Immediate (Week 1-2)** | Draft an AI Acceptable Use Policy. Cover: approved tools list, prohibited uses (no customer PII in public AI, no confidential data in prompts), data classification rules for AI, personal account restrictions, reporting process for new tools. |
| **Short-term (Month 1)** | Legal review. Publish via company intranet, email, and Slack. Require electronic acknowledgment from all employees. Add to onboarding for new hires. |
| **Ongoing** | Review and update the policy quarterly as new tools and regulations emerge. Re-acknowledge annually. |

**Policy Template Structure (what to include):**
1. Purpose and scope
2. Approved AI tools list (with approved use cases per tool)
3. Prohibited AI uses (list specific examples: no customer data in ChatGPT, no AI-generated code without review, no AI for regulated decisions without human oversight)
4. Data classification rules for AI (what data can go into which AI tools)
5. Personal account prohibition (must use corporate accounts for work AI)
6. New AI tool request process
7. Incident reporting (what to do if you accidentally shared sensitive data with AI)
8. Consequences of violations
9. Acknowledgment signature

**Recommended Resources:**
- **SHRM AI Policy Templates** — HR-focused AI policy templates
- **IAPP AI Governance Resource Center** — Privacy-focused policy frameworks
- **NIST AI RMF Govern function** — Policy development guidance
- **Your industry's regulatory body** — Often publishes sector-specific AI policy guidance

**Estimated Effort:** 1-2 weeks to draft; 1 week for legal review; 1-2 weeks for rollout

---

### shadow-6: How do employees currently request approval for new AI tools?

**Mitigation — Create a Formal AI Tool Request and Approval Workflow**

| Action | Detail |
|--------|--------|
| **Immediate (Week 1)** | Create a simple intake form (Google Form, Jira ticket type, or ServiceNow catalog item) with fields: Tool name, URL, business purpose, data it will access, number of users, estimated cost, urgency. |
| **Short-term (Month 1)** | Define a risk-based routing workflow: Low-risk tools (no sensitive data, no integrations) → auto-approve from pre-approved list. Medium-risk → IT Security review (3-5 day SLA). High-risk (PII, financial data, customer-facing) → Full governance committee review (10-15 day SLA). |
| **Medium-term (Quarter 1)** | Build a self-service AI tool catalog showing approved tools, their approved use cases, and how to get access. Reduces request volume by 40-60%. |

**Recommended Tools:**
- **ServiceNow Service Catalog** — If using ServiceNow, add an "AI Tool Request" catalog item with risk-based approval routing
- **Jira Service Management** — Create an "AI Tool Request" request type with custom fields and approval workflows
- **Freshservice** — ITSM with request management and approval workflows
- **Simple start** — Google Form → Slack notification → manual triage (free)

**Estimated Effort:** 1 week for basic form + process; 2-4 weeks for automated routing

---

### shadow-7: Do you monitor which employees access AI tools via personal accounts?

**Mitigation — Enforce Corporate Account Usage for AI Tools**

| Action | Detail |
|--------|--------|
| **Immediate (Week 1)** | Add to AI Acceptable Use Policy: "All AI tool usage for work purposes must be through corporate-managed accounts." |
| **Short-term (Month 1)** | Configure SSO enforcement for all approved AI tools (ChatGPT Enterprise/Team, Copilot, etc.). Block personal account domains at the network/proxy level for known AI services. |
| **Medium-term (Quarter 1)** | Deploy endpoint monitoring to detect AI tool usage outside corporate accounts. Use browser extensions or endpoint agents that flag when employees access AI tools without SSO. |

**Recommended Tools:**
- **Netskope / Zscaler** — Inline proxy that can distinguish personal vs. corporate logins to AI services and enforce corporate-only access
- **Microsoft Defender for Endpoint** — Can detect browser-based AI tool access patterns
- **Browser management** — Chrome Enterprise or Edge for Business can enforce managed browser profiles and block personal profile usage for AI domains
- **SSO enforcement** — Configure ChatGPT Enterprise, Copilot, etc. to require SSO. Disable personal account access on corporate networks.

**Estimated Effort:** 1-2 weeks for policy + SSO enforcement; 1-2 months for endpoint monitoring

---

### shadow-8: When existing SaaS vendors add new AI features, how do you become aware?

**Mitigation — Establish Vendor AI Feature Change Notification Process**

| Action | Detail |
|--------|--------|
| **Immediate (Week 1)** | Add a contractual clause to your vendor contract template: "Vendor must provide 30-day written notice before enabling new AI features that process customer data or change data handling practices." |
| **Short-term (Month 1)** | For existing contracts: send a written request to your top 20 SaaS vendors asking them to notify you of AI feature changes. Many will agree informally even without contract amendment. |
| **Medium-term (Quarter 1)** | Subscribe to vendor release notes/changelogs for your critical SaaS tools. Assign someone to review monthly for AI-related changes. Flag for governance review. |
| **At renewal** | Negotiate the AI notification clause into all renewals. Include right to opt out of AI features that don't meet your governance standards. |

**Contract clause template:**
> "Vendor shall provide Customer with no less than thirty (30) days' prior written notice before (a) enabling any new artificial intelligence or machine learning features that process Customer Data, (b) materially changing how existing AI features process Customer Data, or (c) using Customer Data for model training purposes. Customer shall have the right to opt out of any such features without penalty."

**Estimated Effort:** 1 day to draft clause; ongoing 2-4 hours/month for release note monitoring

---

### shadow-9: Do you have an AI kill switch for emergency shutdown of AI systems?

**Mitigation — Build an AI Kill Switch Procedure**

| Action | Detail |
|--------|--------|
| **Immediate (Week 1)** | For each AI system in your registry, document: How to disable it (API key revocation, OAuth disconnect, vendor admin panel, network block). Who has authority to trigger a shutdown. Who to contact at the vendor for emergency shutdown. |
| **Short-term (Month 1)** | Create a tiered kill switch procedure: Tier 1 (individual tool) — IT can disable within 1 hour. Tier 2 (vendor category) — CISO can disable all tools from a vendor within 4 hours. Tier 3 (all AI) — Emergency shutdown of all AI systems within 24 hours. |
| **Medium-term (Quarter 1)** | Test the kill switch quarterly. Run a tabletop exercise: "AI vendor X has been breached. Walk through the shutdown process." Document findings and improve. |

**Kill switch components to document per AI system:**
1. Network-level block (DNS/firewall rule to block the service)
2. Identity-level block (disable OAuth app, revoke API keys, disable SSO app)
3. Vendor-level block (contact vendor security team, request account suspension)
4. Data-level response (identify what data the system accessed, assess exposure)
5. Communication plan (who gets notified: employees, customers, regulators?)

**Estimated Effort:** 2-3 days to document; 1 day/quarter for testing

---

### shadow-10: Have you conducted an AI literacy training program for all employees?

**Mitigation — Launch an Enterprise AI Literacy Program**

| Action | Detail |
|--------|--------|
| **Immediate (Month 1)** | Develop a 30-minute mandatory training covering: What AI can and can't do, your company's approved AI tools, the AI Acceptable Use Policy, how to recognize AI risks (hallucinations, data leakage), how to request new tools. |
| **Short-term (Quarter 1)** | Role-specific training: Executives (AI strategy and governance), Managers (AI oversight and team usage), Technical staff (secure AI development, prompt engineering best practices), All employees (responsible AI use). |
| **Ongoing** | Annual refresher training. Update when new tools are approved or policies change. Track completion rates and report to governance committee. |

**Recommended Tools/Platforms:**
- **LinkedIn Learning** — Has AI literacy courses for non-technical employees
- **Coursera for Business** — Google and IBM AI fundamentals courses
- **Custom internal training** — Record a 30-min video with your AI governance lead + CISO
- **KnowBe4** — Security awareness platform that includes AI-specific training modules
- **Pluralsight** — Technical AI training for engineering teams
- **Simple start** — Lunch-and-learn series (4 sessions covering the 4 role levels)

**Estimated Effort:** 2-4 weeks to develop initial training; 1-2 days/quarter for updates
**Cost Range:** $0 (internal) to $20-40/user/year (learning platform)

---

## DIMENSION 2: Vendor AI Risk Management — Weight: 25%

Most organizations rely on third-party vendors for their AI capabilities, yet 92% trust those vendors without being able to verify their data practices. This dimension covers vendor risk assessments, contractual protections, data ownership boundaries, certification requirements, and incident response obligations. Weak vendor governance exposes your organization to data misuse, regulatory liability, and supply chain risk that compounds with every new AI integration. Getting vendor controls right protects both your data and your legal standing.

---

### vendor-1: Have you conducted AI risk assessments for your top 10 critical vendors?

**Mitigation — Implement a Vendor AI Risk Assessment Process**

| Action | Detail |
|--------|--------|
| **Immediate (Week 1-2)** | Identify your top 10 AI-critical vendors (by data sensitivity, business dependency, and AI feature usage). Use the 30-question vendor questionnaire (Pro output) to assess each. |
| **Short-term (Month 1-2)** | Score each vendor on: Data practices, Security posture, AI-specific controls, Contractual protections, Incident response. Create a vendor risk heatmap. |
| **Ongoing** | Reassess critical vendors quarterly. Reassess all vendors annually. Trigger reassessment when vendors announce major AI feature changes. |

**30-Question Vendor AI Risk Assessment (key categories):**
1. Data ownership and usage rights (5 questions)
2. Model training practices — do they train on your data? (3 questions)
3. Security certifications and controls (5 questions)
4. AI-specific controls (bias, drift, hallucination) (5 questions)
5. Incident response and notification (4 questions)
6. Subprocessor and data residency (4 questions)
7. Contractual protections (4 questions)

**Recommended Tools:**
- **OneTrust Vendorpedia** — Vendor risk management with AI-specific assessments (enterprise)
- **Vanta Vendor Risk Management** — Automated vendor security reviews
- **SecurityScorecard** — External security posture scoring for vendors
- **Whistic** — Vendor assessment platform with AI security questionnaire templates
- **Simple start** — Structured spreadsheet with the 30-question template (included in Pro output)

**Estimated Effort:** 4-8 hours per vendor for initial assessment; 2-3 hours for quarterly review

---

### vendor-2: Can you clearly articulate data ownership boundaries with AI vendors?

**Mitigation — Define and Document Data Ownership in Every AI Vendor Contract**

| Action | Detail |
|--------|--------|
| **Immediate (Week 1)** | For your top 10 AI vendors, answer: Who owns the input data? Who owns the output/results? Can the vendor use your data to train models? Can the vendor share aggregated/anonymized data? What happens to your data when the contract ends? |
| **Short-term (Month 1)** | Draft a standard data ownership addendum for AI vendor contracts covering: input data ownership, output/derivative data ownership, model training opt-out, data deletion upon termination, data portability rights. |
| **At each renewal** | Negotiate the data ownership addendum into the contract. If the vendor refuses key clauses, escalate to the governance committee for a risk acceptance decision. |

**Critical questions to answer per vendor:**
1. "Do you train your AI models on our data?" → If yes, demand opt-out or switch vendors
2. "Who owns the outputs generated by your AI using our data?" → Must be the customer
3. "Can you share our data (even anonymized) with third parties?" → Should be prohibited
4. "What happens to our data (including AI-processed derivatives) when we terminate?" → Must be deleted within 30 days with certification
5. "Can you guarantee data residency in [our jurisdiction]?"

**Estimated Effort:** 2-4 hours per vendor; 1-2 weeks for legal review of standard addendum

---

### vendor-3: How often do you review vendor AI data practices?

**Mitigation — Establish a Quarterly Vendor Review Cadence**

| Action | Detail |
|--------|--------|
| **Immediate** | Calendar quarterly review dates for critical vendors. Assign an owner per vendor relationship. |
| **Each quarter** | Check: Has the vendor changed their ToS/privacy policy? Have they launched new AI features? Have they had any security incidents? Are their certifications still current? Review any available SOC 2 reports. |
| **Annually** | Full reassessment using the 30-question vendor AI risk questionnaire. Compare year-over-year risk scores. |

**Quarterly review checklist (15-minute per vendor):**
- [ ] Check vendor's status page for incidents since last review
- [ ] Review any ToS/privacy policy change notifications
- [ ] Check for new AI feature announcements in vendor release notes
- [ ] Verify SOC 2 / ISO 27001 certification is still current
- [ ] Review usage analytics — any unexpected data access patterns?
- [ ] Check SecurityScorecard or similar for external rating changes

**Estimated Effort:** 15-30 minutes per vendor per quarter; 4-8 hours per vendor for annual full review

---

### vendor-4: Do vendors notify you when adding new AI features to your subscriptions?

**Mitigation — Contractual AI Feature Change Notification**

(See shadow-8 mitigation — identical remedy, applied from the vendor risk perspective)

**Additional vendor-side action:** For vendors who refuse contractual notification, subscribe to their:
- Product changelog/release notes RSS feed
- Developer blog
- Customer advisory emails
- Community forums

Assign a team member to review monthly and flag AI-related changes.

---

### vendor-5: Do you know if your vendors train AI models on your data?

**Mitigation — Audit All Vendors for Model Training Practices**

| Action | Detail |
|--------|--------|
| **Immediate (Week 1)** | Send a written inquiry to every AI vendor: "Does your platform use our data to train, fine-tune, or improve AI/ML models? If yes, how can we opt out?" Document every response. |
| **Short-term (Month 1)** | For vendors who train on your data: opt out immediately if possible. If opt-out isn't available, assess the risk and escalate to governance committee for a keep/replace decision. |
| **Ongoing** | Add "model training opt-out" to every new AI vendor contract. Make it a pass/fail procurement criterion. |

**Known vendor training practices (verify current status — these change frequently):**
- **OpenAI (API)** — Does NOT train on API data by default. ChatGPT free/Plus DOES train unless opted out in settings.
- **Microsoft Copilot (Enterprise)** — Does NOT train on enterprise customer data.
- **Google Gemini (API)** — Does NOT train on API data by default. Free tier data may be used.
- **Anthropic (API)** — Does NOT use API data for training by default.
- **Salesforce Einstein** — Verify per product; Einstein Trust Layer claims no training on customer data.
- **Zoom AI Companion** — Updated policy in 2023 to not train on customer content; verify current terms.

**Estimated Effort:** 1-2 hours per vendor for inquiry; 1 day to compile results

---

### vendor-6: Do your vendor contracts include AI-specific clauses?

**Mitigation — Add AI-Specific Clauses to All Vendor Contracts**

| Action | Detail |
|--------|--------|
| **Immediate** | Draft a standard AI contract addendum covering the 8 essential AI clauses (below). Have legal review. |
| **At each renewal/new contract** | Include the AI addendum. Track which vendors have accepted it. |

**8 Essential AI Contract Clauses:**
1. **Data ownership**: All input data and outputs remain customer property
2. **Model training prohibition**: Vendor may not use customer data for model training without explicit written consent
3. **AI feature notification**: 30-day notice before enabling new AI features
4. **Explainability**: Vendor must provide explanations for AI-driven decisions affecting the customer
5. **Bias and fairness**: Vendor must test for and disclose known biases in AI systems
6. **Incident notification**: AI-specific incidents (hallucinations causing harm, data leakage via AI, model compromise) must be reported within 24-72 hours
7. **Audit rights**: Customer has the right to audit vendor's AI practices annually
8. **Data deletion**: All customer data (including AI-processed derivatives) must be deleted within 30 days of termination with written certification

**Estimated Effort:** 1-2 weeks for legal to draft standard addendum; 30 minutes per contract to add

---

### vendor-7: Where do your vendors store and process AI data (geographic jurisdiction)?

**Mitigation — Document Data Residency for All AI Vendors**

| Action | Detail |
|--------|--------|
| **Immediate** | For each AI vendor, determine: Where is data stored at rest? Where is data processed (inference)? Which sub-processors are involved and where are they located? |
| **Short-term** | Create a data residency map showing data flows by geography. Flag any cross-border transfers that create regulatory exposure (especially EU→US, or data flowing to countries without adequacy decisions). |
| **At procurement** | Add data residency requirements to vendor selection criteria. Require vendors to support data residency in your required jurisdictions. |

**Regulatory considerations by region:**
- **EU (GDPR)**: Data transfers outside EU/EEA require adequacy decisions, SCCs, or BCRs. AI processing is considered "processing" under GDPR.
- **US (state laws)**: Some states have data localization preferences. Federal contracts may require US-only processing.
- **China (CSL/PIPL)**: Personal data of Chinese citizens generally must be stored in China.
- **India (DPDP Act)**: Cross-border transfer restrictions to certain jurisdictions.

**Estimated Effort:** 2-4 hours per vendor to document; 1 day to build the residency map

---

### vendor-8: Do your AI vendors hold relevant certifications?

**Mitigation — Require Minimum Certification Standards for AI Vendors**

| Action | Detail |
|--------|--------|
| **Immediate** | Define your minimum vendor certification requirements: Tier 1 (critical vendors) — SOC 2 Type II + ISO 27001 required, ISO 42001 preferred. Tier 2 (standard vendors) — SOC 2 Type II required. Tier 3 (low-risk) — SOC 2 Type I or equivalent. |
| **Short-term** | Audit all current AI vendors against these requirements. Create an exceptions list with risk acceptance documentation for any non-compliant critical vendors. |
| **At procurement** | Make certification requirements a pass/fail gate in vendor evaluation. |

**Key certifications to look for:**
- **SOC 2 Type II** — Security baseline (annual audit of controls effectiveness)
- **ISO 27001** — Information security management system (internationally recognized)
- **ISO 42001** — AI management system (new, emerging; differentiator for AI-focused vendors)
- **CSA STAR** — Cloud security (relevant for cloud-based AI services)
- **HITRUST** — Healthcare data (if applicable)
- **FedRAMP** — US government (if applicable)

**Estimated Effort:** 1-2 hours per vendor to verify; 1 day to build certification tracking matrix

---

### vendor-9: What is your vendor's AI incident response process?

**Mitigation — Require AI-Specific Incident Response SLAs from Vendors**

| Action | Detail |
|--------|--------|
| **Immediate** | Ask each critical vendor: "Do you have an AI-specific incident response plan? What is your notification SLA for AI-related incidents? Walk me through what happens if your AI system produces harmful outputs using our data." |
| **Short-term** | Define your required incident notification SLAs: Critical AI incident (data breach via AI, model compromise) — 24-hour notification. High (harmful AI output, significant AI malfunction) — 48-hour notification. Medium (AI performance degradation, minor errors) — 72-hour notification. |
| **At contract** | Include the SLAs in contracts with consequences for non-compliance. |

**What constitutes an "AI incident" (define in contracts):**
- AI system produces outputs that cause financial harm to the customer
- Customer data is exposed through AI system vulnerability
- AI model is compromised (data poisoning, adversarial manipulation)
- AI system exhibits bias that affects protected classes
- Vendor uses customer data for model training without authorization
- AI-generated content contains third-party intellectual property

**Estimated Effort:** 2-4 hours per vendor for initial inquiry; 30 minutes per contract for SLA clause

---

### vendor-10: Do you have audit rights over your AI vendors?

**Mitigation — Negotiate and Exercise AI Audit Rights**

| Action | Detail |
|--------|--------|
| **Immediate** | Review existing contracts for audit rights clauses. Many standard enterprise agreements include some form of audit rights — they may just never have been exercised for AI specifically. |
| **At renewal** | Negotiate explicit AI audit rights: Right to audit AI data practices annually. Right to request evidence of AI-specific controls (bias testing results, drift monitoring reports, model documentation). Right to commission third-party audits at vendor's cost if concerns arise. |
| **Annually** | Exercise audit rights for Tier 1 vendors. Review SOC 2 reports. Request AI-specific documentation (model cards, fairness reports, incident logs). |

**Practical audit approach (you don't need to audit the code):**
1. Request latest SOC 2 Type II report — review AI-related controls
2. Request vendor's AI governance policy documentation
3. Request evidence of bias testing for AI systems that process your data
4. Request data flow diagrams showing how your data moves through AI systems
5. Request incident log for AI-related incidents in the past 12 months

**Estimated Effort:** 4-8 hours per vendor for annual audit; 2-4 hours for SOC 2 report review

---

## DIMENSION 3: Data Governance & Privacy — Weight: 20%

Data is the fuel for every AI system, and ungoverned data practices are the fastest path to regulatory penalties and reputational damage. Research shows that 77% of employees paste sensitive information into generative AI prompts, creating uncontrolled data exposure across classification, lineage, consent, retention, and anonymization requirements. This dimension ensures your organization meets GDPR, CCPA, and other privacy obligations while maintaining the data quality AI systems need to perform reliably. Strong data governance reduces breach liability, accelerates regulatory audits, and builds the trust foundation that enables AI to scale safely.

---

### data-1: Do you have data classification policies that address AI training and inference data?

**Mitigation — Extend Data Classification to Cover AI Use Cases**

| Action | Detail |
|--------|--------|
| **Immediate** | Add AI-specific rules to your existing data classification policy. Define which classification levels can be used with which types of AI tools: PUBLIC → Any AI tool. INTERNAL → Approved enterprise AI tools only (e.g., Copilot with enterprise data protection). CONFIDENTIAL → Only AI tools with SOC 2 + contractual data protections + no model training. RESTRICTED → No external AI processing. On-premises/private AI only. |
| **Short-term** | Train employees on the AI data classification rules. Add visual reminders to AI tool interfaces (if possible) or in the AI tool catalog. |
| **Medium-term** | Implement technical enforcement using DLP tools that detect data classification levels before data is sent to AI services. |

**Recommended Tools:**
- **Microsoft Purview** — Data classification + DLP + sensitivity labels that can restrict AI tool usage per classification level
- **Nightfall AI** — AI-native DLP that detects sensitive data in AI prompts and blocks transmission
- **Forcepoint DLP** — Enterprise DLP with AI service monitoring
- **Google Cloud DLP** — Data classification and de-identification for GCP workloads

**Estimated Effort:** 1-2 weeks to update policy; 2-4 weeks for DLP integration

---

### data-2: Can you trace the lineage of data used in AI systems?

**Mitigation — Implement Data Lineage Tracking for AI Systems**

| Action | Detail |
|--------|--------|
| **Immediate** | For each AI system in your registry, document: What data sources feed it? How is the data transformed before AI processing? Where do AI outputs go? Who has access at each stage? |
| **Short-term** | Create data flow diagrams for your top 5 AI systems. Include: source → transformation → AI input → AI processing → output → consumption. |
| **Medium-term** | Deploy a data lineage tool to automate tracking for data pipelines that feed AI systems. |

**Recommended Tools:**
- **OpenLineage** — Open-source standard for data lineage collection (free)
- **Apache Atlas** — Open-source metadata and lineage management
- **Atlan** — Modern data catalog with AI-aware lineage
- **Collibra** — Enterprise data governance with lineage (high-end)
- **dbt** — If using dbt for data transformation, it provides built-in lineage
- **Simple start** — Manually documented data flow diagrams in Lucidchart/Miro

**Estimated Effort:** 1-2 days per AI system for manual documentation; 2-3 months for automated lineage tooling

---

### data-3: Do you control what data employees can paste or upload to AI tools?

**Mitigation — Deploy AI-Aware Data Loss Prevention (DLP)**

| Action | Detail |
|--------|--------|
| **Immediate** | Create a list of data types that must NEVER be entered into external AI tools: SSNs, credit card numbers, patient health information, passwords/API keys, attorney-client privileged documents, unreleased financial results. Communicate to all employees. |
| **Short-term** | Deploy DLP that monitors data sent to AI services. Start in monitoring mode (log but don't block) for 2-4 weeks to understand patterns, then switch to enforcement. |
| **Medium-term** | Implement prompt-level DLP that scans content before it's submitted to AI tools and redacts or blocks sensitive data in real-time. |

**Recommended Tools:**
- **Nightfall AI** — Purpose-built for detecting sensitive data in AI prompts (ChatGPT, Copilot, etc.). Browser extension + API.
- **Microsoft Purview DLP** — Covers Microsoft Copilot and can be extended to other AI tools via endpoint DLP
- **Netskope Intelligent SSE** — Inline inspection of data going to AI services with real-time blocking
- **Code42 Incydr** — Insider risk management that monitors data movement to AI tools
- **Zscaler Data Protection** — Inline DLP for AI services with pre-built AI app categories

**Estimated Effort:** 2-4 weeks for DLP deployment; ongoing tuning for 1-2 months to reduce false positives
**Cost Range:** $3-15/user/year depending on tool

---

### data-4: Do you have consent management for personal data used in AI processing?

**Mitigation — Implement AI-Specific Consent Mechanisms**

| Action | Detail |
|--------|--------|
| **Immediate** | Audit: Which of your AI systems process personal data? What legal basis are you relying on? (Consent, legitimate interest, contract performance, legal obligation?) Document gaps. |
| **Short-term** | Update your privacy policy and consent forms to explicitly cover AI processing. Notify data subjects that their data may be processed by AI systems. Provide opt-out mechanisms where legally required. |
| **Medium-term** | Implement consent management that tracks which individuals have consented to AI processing and which have opted out. Ensure AI systems respect opt-out preferences. |

**Key regulatory requirements:**
- **GDPR Article 22**: Right not to be subject to solely automated decision-making with legal/significant effects. Must provide human review mechanism.
- **GDPR Article 13/14**: Must inform data subjects about AI/automated processing at collection.
- **CCPA/CPRA**: Right to opt out of automated decision-making.
- **Colorado AI Act (Feb 2026)**: Deployers of high-risk AI must notify consumers and provide opt-out.

**Recommended Tools:**
- **OneTrust Consent Management** — Enterprise consent management with AI processing tracking
- **Cookiebot / Usercentrics** — Consent management platforms (can be extended for AI consent)
- **TrustArc** — Privacy management with consent tracking

**Estimated Effort:** 2-4 weeks for audit; 1-2 months for consent mechanism implementation

---

### data-5: How do you handle data retention and deletion for AI systems?

**Mitigation — Define AI-Specific Data Retention Policies**

| Action | Detail |
|--------|--------|
| **Immediate** | For each AI system: What data does it retain? For how long? Can you delete specific records? Document the answers. Many AI vendors retain prompts and outputs — check your vendor agreements. |
| **Short-term** | Define retention periods for AI data: Prompts/inputs — delete after 30-90 days (unless needed for audit). AI outputs — retain per your standard document retention. Model training data — retain for model lifecycle + regulatory requirements. Logs/audit trails — retain per compliance requirements (typically 3-7 years). |
| **Medium-term** | Automate retention enforcement. Set up scheduled deletion jobs for AI data that has exceeded its retention period. |

**Key considerations:**
- Vendor-side retention: Ensure vendors delete your data per your retention schedule, not theirs
- Litigation holds: AI data may be subject to legal holds — coordinate with legal
- Right to erasure: You must be able to delete individual records from AI training data if using GDPR-protected data

**Estimated Effort:** 1-2 weeks to document; 2-4 weeks to implement automated retention

---

### data-6: Do you anonymize or pseudonymize sensitive data before AI processing?

**Mitigation — Implement Data Anonymization Pipeline for AI**

| Action | Detail |
|--------|--------|
| **Immediate** | Identify which AI systems process sensitive data (PII, PHI, financial data). For each, determine: Can the AI function with anonymized data? What's the minimum data needed? |
| **Short-term** | Implement anonymization/pseudonymization techniques: Replace names → generic tokens. Remove or hash SSNs, account numbers. Generalize locations (city → state/region). Remove or bucket ages/dates of birth. Use synthetic data for AI development and testing. |
| **Medium-term** | Build an automated anonymization pipeline that runs before data enters AI systems. |

**Recommended Tools:**
- **ARX** — Open-source data anonymization tool (k-anonymity, l-diversity, t-closeness)
- **Presidio (Microsoft)** — Open-source PII detection and anonymization, works well as a pre-processing step for AI
- **Gretel.ai** — Synthetic data generation and data anonymization for AI
- **Mostly AI** — Synthetic data platform for AI training
- **Google Cloud DLP** — Built-in de-identification transforms
- **Simple approach** — Regular expressions + lookup tables for basic PII redaction

**Estimated Effort:** 1-2 weeks for basic redaction; 1-2 months for automated pipeline

---

### data-7: Do you have a data governance committee or owner responsible for AI data?

**Mitigation — Establish AI Data Governance Ownership**

| Action | Detail |
|--------|--------|
| **Immediate** | Designate a Data Governance Owner for AI — this can be the CDO, a senior data architect, or the AI Governance Lead with data governance responsibilities. |
| **Short-term** | If you have an existing Data Governance Committee, expand its charter to include AI data governance. If not, form a small committee (3-5 members): data team lead, IT security, legal/privacy, business representative, AI Governance Lead. |
| **Ongoing** | Monthly meetings to review: new AI data requests, data quality issues in AI systems, privacy impact assessments, vendor data practice changes. |

**Minimum responsibilities of the AI Data Governance Owner:**
1. Approves which data sets can be used for AI training and inference
2. Maintains data classification rules for AI use cases
3. Reviews data lineage for AI systems
4. Ensures consent and privacy compliance for AI data processing
5. Oversees data quality standards for AI input data
6. Manages data retention and deletion for AI systems

**Estimated Effort:** 1 day to designate owner; 2-4 weeks to establish committee and charter

---

### data-8: Can you fulfill data subject access requests (DSARs) for AI-processed data?

**Mitigation — Extend DSAR Process to Cover AI Data**

| Action | Detail |
|--------|--------|
| **Immediate** | Determine: For each AI system that processes personal data, can you identify and retrieve all data related to a specific individual? Test with a sample DSAR. |
| **Short-term** | Update your DSAR workflow to include AI systems. For each AI system, document: How to search for an individual's data, What data is returned (inputs, outputs, decisions), How to export in a portable format, How to delete (right to erasure). |
| **Medium-term** | Automate DSAR fulfillment for AI systems. Build API integrations that query AI system logs and databases when a DSAR is received. |

**DSAR response must include (for AI):**
- What personal data was processed by AI systems
- What decisions or outputs the AI generated about the individual
- The logic involved in automated decision-making (GDPR Art. 15(1)(h))
- Whether the individual's data was used for model training

**Recommended Tools:**
- **OneTrust Privacy Rights Automation** — Automated DSAR fulfillment across systems
- **BigID** — Data discovery and DSAR automation
- **Transcend** — Privacy infrastructure for automated DSARs
- **Simple approach** — Manual checklist per AI system with documented search procedures

**Estimated Effort:** 1-2 weeks to document procedures; 2-3 months for automation

---

### data-9: Do you have data quality controls for AI training and input data?

**Mitigation — Implement AI Data Quality Framework**

| Action | Detail |
|--------|--------|
| **Immediate** | For your top AI systems, define minimum data quality standards: completeness (what % missing values is acceptable?), accuracy (how is ground truth validated?), consistency (are formats standardized?), timeliness (how stale can data be?). |
| **Short-term** | Deploy data quality checks at AI system input points. Reject or flag data that doesn't meet quality thresholds. Log quality metrics over time to detect degradation. |
| **Medium-term** | Build automated data quality dashboards for AI pipelines. Set up alerts when quality drops below thresholds. |

**Recommended Tools:**
- **Great Expectations** — Open-source data quality framework with "expectations" (validation rules) for data pipelines
- **dbt tests** — If using dbt, built-in data quality testing
- **Soda** — Data quality monitoring with SQL-based checks
- **Monte Carlo** — Data observability platform (detects data quality issues automatically)
- **Anomalo** — AI-powered data quality monitoring

**Data quality dimensions to monitor for AI:**
1. **Completeness** — % of records with all required fields populated
2. **Accuracy** — % of records matching ground truth or validation source
3. **Freshness** — Time since last data update vs. required recency
4. **Volume** — Expected record counts (sudden drops/spikes indicate pipeline issues)
5. **Schema** — Column types, names, and constraints haven't changed unexpectedly
6. **Distribution** — Statistical distribution of key features matches expectations

**Estimated Effort:** 1-2 weeks for basic checks; 1-2 months for comprehensive monitoring

---

### data-10: Do you maintain separate environments (dev/staging/prod) for AI data?

**Mitigation — Implement Environment Separation with Synthetic Data**

| Action | Detail |
|--------|--------|
| **Immediate** | Audit: Are any AI development or testing activities using production data? If yes, prioritize separation. |
| **Short-term** | Create separate data environments: Development — synthetic or anonymized data only. Staging/Testing — anonymized production data or synthetic data. Production — real data with full governance controls. |
| **Medium-term** | Automate synthetic data generation for dev/test environments. Implement access controls preventing dev/test from accessing production data stores. |

**Recommended Tools:**
- **Gretel.ai** — Generate synthetic data that preserves statistical properties of real data
- **Mostly AI** — Synthetic data generation platform
- **Tonic.ai** — Test data management with de-identification and synthesis
- **Faker (Python library)** — Basic synthetic data generation (free, open-source)
- **Simple approach** — Copy production data, run anonymization script, use as test data

**Estimated Effort:** 1-2 weeks for environment separation; 2-4 weeks for synthetic data pipeline

---

## DIMENSION 4: Security & Compliance — Weight: 15%

This dimension covers the security infrastructure and regulatory compliance posture that protects your AI operations, including certifications (SOC 2, ISO 27001, ISO 42001), encryption, incident response, access controls, audit trails, and multi-jurisdictional compliance. The EU AI Act takes full effect in August 2026 with penalties reaching 35 million euros or 7% of global turnover, making compliance preparation an urgent financial priority. Organizations with mature security and compliance controls reduce breach costs, accelerate customer trust, and avoid the operational disruption of reactive regulatory remediation.

---

### security-1: Which AI-relevant certifications does your organization hold?

**Mitigation — Pursue Relevant AI Governance Certifications**

| Action | Detail |
|--------|--------|
| **Immediate** | Assess your current certification status. If you have SOC 2 and/or ISO 27001, you have a strong foundation to build on. |
| **Short-term (6 months)** | If no certifications: start with SOC 2 Type I as the baseline. If SOC 2 exists: begin ISO 27001 gap assessment. |
| **Medium-term (12-18 months)** | Pursue ISO 42001 certification. Since it follows the same Annex SL structure as ISO 27001, the incremental effort is manageable if you already have 27001. |

**Certification roadmap:**
1. **SOC 2 Type I** → Type II (6-12 months) — Security baseline, widely expected
2. **ISO 27001** (6-12 months) — International security standard, required for EU/international business
3. **ISO 42001** (6-12 months after 27001) — AI-specific management system, emerging differentiator

**Cost estimates:**
- SOC 2: $30,000-$100,000 (audit + remediation)
- ISO 27001: $20,000-$80,000 (certification audit)
- ISO 42001: $15,000-$50,000 (incremental if you have 27001)

---

### security-2: Do you encrypt AI data at rest and in transit?

**Mitigation — Implement Comprehensive Encryption for AI Data**

| Action | Detail |
|--------|--------|
| **Immediate** | Verify all AI services use TLS 1.2+ for data in transit. Check: Are API keys transmitted securely? Are AI tool connections using HTTPS? |
| **Short-term** | Implement encryption at rest for all AI data stores. Use AES-256 for databases and file storage. Enable vendor-side encryption for cloud AI services. |
| **Medium-term** | Implement key management (KMS) for AI encryption keys. Consider customer-managed keys (BYOK) for critical AI vendors. |

**Recommended Tools:**
- **AWS KMS / Azure Key Vault / GCP Cloud KMS** — Cloud key management
- **HashiCorp Vault** — Secrets management and encryption-as-a-service
- **Vendor-specific** — Enable encryption features in your AI vendors (most enterprise AI tools support encryption at rest)

---

### security-3: Do you have an AI-specific incident response plan?

**Mitigation — Create a Dedicated AI Incident Response Plan**

| Action | Detail |
|--------|--------|
| **Immediate** | Draft an AI-specific appendix to your existing incident response plan covering these AI-specific scenarios: AI hallucination causing customer harm. AI data leakage (sensitive data exposed via AI). Model compromise (adversarial manipulation, data poisoning). AI bias discovered in production. Autonomous agent taking unauthorized actions. AI-generated deepfake used to impersonate executives. |
| **Short-term** | Assign incident commanders for each AI scenario type. Define severity levels and escalation paths. Create communication templates for AI incidents. |
| **Quarterly** | Conduct tabletop exercises for AI incident scenarios. Test response procedures and update based on lessons learned. |

**AI Incident Response Plan template structure:**
1. Scope and definitions (what constitutes an AI incident)
2. Severity classification (Critical/High/Medium/Low with AI-specific examples)
3. Incident commander assignments
4. Detection → Triage → Containment → Eradication → Recovery → Lessons Learned
5. AI-specific containment: kill switch procedures, model rollback, vendor notification
6. Communication templates: internal, customer, regulatory
7. Regulatory notification requirements (72-hour GDPR, state breach laws)
8. Post-incident review process

---

### security-4: How prepared are you for EU AI Act compliance?

**Mitigation — EU AI Act Compliance Roadmap**

| Action | Detail |
|--------|--------|
| **Immediate** | Determine if the EU AI Act applies to you: Do you serve EU customers? Do you operate in the EU? Do your AI systems affect EU citizens? If yes to any, compliance is required. |
| **Short-term (Month 1-2)** | Classify all your AI systems by EU AI Act risk tier: Unacceptable (prohibited), High-Risk, Limited Risk, Minimal Risk. The classification determines your obligations. |
| **Medium-term (3-6 months)** | For high-risk AI systems: implement conformity assessment, quality management system, risk management system, human oversight mechanisms, technical documentation, and registration requirements. |

**Key EU AI Act deadlines:**
- Feb 2025: Prohibited practices ban (already in effect)
- Aug 2025: GPAI model obligations (already in effect)
- **Aug 2026: High-risk AI system requirements (approaching)**
- Aug 2027: Certain product-integrated high-risk AI systems

**Recommended Resources:**
- **EU AI Act Compliance Checker** — ec.europa.eu AI Act guidance
- **Future of Life Institute AI Act Explorer** — Interactive guide to requirements
- **Holistic AI EU AI Act toolkit** — Classification and compliance tools

---

### security-5: Do you conduct penetration testing for AI systems?

**Mitigation — Implement AI-Specific Security Testing**

| Action | Detail |
|--------|--------|
| **Immediate** | Include AI systems in your next penetration test scope. Brief the pentest team on AI-specific attack vectors. |
| **Short-term** | Add AI-specific test cases: prompt injection attacks, data poisoning attempts, model inversion attacks, API abuse/rate limiting, output manipulation. |
| **Annually** | Conduct dedicated AI red team exercises. Consider hiring an AI security specialist or firm for the first engagement. |

**AI-specific penetration testing scope:**
1. **Prompt injection** — Can malicious prompts bypass safety controls?
2. **Data extraction** — Can the AI be tricked into revealing training data or PII?
3. **Jailbreaking** — Can safety restrictions be bypassed?
4. **API abuse** — Rate limiting, authentication, authorization for AI APIs
5. **Model theft** — Can the model be replicated through systematic querying?
6. **Output manipulation** — Can outputs be influenced to produce harmful content?

**Recommended Firms/Tools:**
- **HiddenLayer** — AI security platform (model scanning, threat detection)
- **Robust Intelligence (now Cisco)** — AI model validation and security
- **Adversa AI** — AI red teaming and security testing
- **Garak** — Open-source LLM vulnerability scanner
- **OWASP ML Security Top 10** — Framework for AI security testing priorities

---

### security-6: Do you have access controls (RBAC) for AI systems and data?

**Mitigation — Implement Role-Based Access Controls for AI**

| Action | Detail |
|--------|--------|
| **Immediate** | Inventory who has access to each AI system and what level of access. Identify over-privileged accounts. |
| **Short-term** | Define AI-specific roles: AI User (can use approved tools), AI Developer (can build/configure AI systems), AI Admin (can manage AI infrastructure), AI Governance (can audit and review). Implement least-privilege access. |
| **Medium-term** | Implement just-in-time access for sensitive AI operations (model deployment, training data access, configuration changes). Regular access reviews quarterly. |

---

### security-7: Do you review AI-generated code before deploying to production?

**Mitigation — Mandatory Security Review for AI-Generated Code**

| Action | Detail |
|--------|--------|
| **Immediate** | Policy: All AI-generated code must pass the same code review process as human-written code. No exceptions. |
| **Short-term** | Add automated security scanning to your CI/CD pipeline that flags AI-generated code patterns. Deploy SAST (Static Application Security Testing) tools. |
| **Medium-term** | Train developers on AI code review — what to look for: hardcoded credentials, injection vulnerabilities, insecure defaults, license violations, hallucinated library imports. |

**Recommended Tools:**
- **Snyk** — Code security scanning (catches AI-generated vulnerabilities)
- **SonarQube** — Code quality and security analysis
- **Semgrep** — Lightweight static analysis for security patterns
- **GitHub Advanced Security** — Code scanning, secret scanning, dependency review
- **Socket.dev** — Detects hallucinated/malicious package imports in AI-generated code

---

### security-8: Do you maintain audit trails for AI decisions?

**Mitigation — Implement AI Decision Audit Logging**

| Action | Detail |
|--------|--------|
| **Immediate** | For each AI system that makes or influences decisions: Enable comprehensive logging (inputs, outputs, model version, timestamp, user). Ensure logs are tamper-proof (write-once storage or append-only). |
| **Short-term** | Define log retention periods per regulatory requirements. Implement centralized log aggregation for AI audit trails. |
| **Medium-term** | Add explainability to audit trails — not just what the AI decided, but why (feature importance, confidence scores, decision path). |

**What to log per AI decision:**
- Timestamp
- Input data (or hash if sensitive)
- Model version and configuration
- Output/decision
- Confidence score
- User who triggered the decision
- Whether a human reviewed/overrode the decision
- Any flags or warnings raised

**Recommended Tools:**
- **Elasticsearch / OpenSearch** — Centralized logging with search and analysis
- **Splunk** — Enterprise log management and SIEM
- **Datadog** — Monitoring and logging with ML-specific integrations
- **MLflow** — Model lifecycle tracking with experiment and deployment logging

---

### security-9: Do you have a designated AI governance committee or responsible person?

**Mitigation — Form an AI Governance Committee**

(See the detailed Roles & Responsibilities section in the research — full committee structure, RACI matrix, operating model.)

**Quick start for companies with nothing:**
1. Week 1: CEO designates an AI Governance Lead (can be part-time to start)
2. Week 2: AI Governance Lead identifies 5-7 committee members across functions
3. Week 3: First meeting — review AI inventory, approve committee charter
4. Week 4: Begin monthly meeting cadence

---

### security-10: How do you handle compliance with multiple jurisdictions?

**Mitigation — Build a Multi-Jurisdictional Compliance Matrix**

| Action | Detail |
|--------|--------|
| **Immediate** | List every jurisdiction where you operate, serve customers, or process data. For each, identify applicable AI regulations. |
| **Short-term** | Create a compliance matrix: rows = your AI systems, columns = regulations. Mark which regulations apply to which systems. Identify gaps. |
| **Medium-term** | Apply the "highest common denominator" approach — comply with the strictest regulation (usually EU AI Act + GDPR) and you'll meet or exceed most others. |

**Key regulations by region:**
- **EU**: AI Act, GDPR
- **US**: NIST AI RMF (voluntary), state laws (Colorado AI Act, Illinois AIPA, NYC Local Law 144), sector-specific (HIPAA, FFIEC, FTC Act)
- **UK**: Pro-innovation approach, ICO AI guidance, UK GDPR
- **Canada**: AIDA (Artificial Intelligence and Data Act)
- **Singapore**: Model AI Governance Framework, PDPA
- **China**: Generative AI regulations, algorithm registration requirements

---

## DIMENSION 5: AI-Specific Risks — Weight: 10%

AI introduces a category of risks that traditional IT governance was never designed to address. Hallucinations alone cost organizations an estimated $67.4 billion in 2024, and emerging threats like model drift, prompt injection, agentic AI failures, bias in automated decisions, and deepfake-enabled fraud are growing in frequency and financial impact. This dimension evaluates your defenses against these AI-native risks, from output validation and adversarial testing to bias auditing and vulnerable population safeguards. Proactive mitigation here prevents the kind of high-profile AI failures that erode customer trust, trigger litigation, and attract regulatory scrutiny.

---

### airisk-1: Do you monitor AI outputs for hallucinations before they reach customers?

**Mitigation — Deploy an AI Output Validation Layer**

| Action | Detail |
|--------|--------|
| **Immediate** | For customer-facing AI systems: implement human-in-the-loop review for all high-stakes outputs (financial advice, medical information, legal citations, product safety claims). |
| **Short-term** | Deploy automated hallucination detection: fact-checking against authoritative sources, confidence scoring with thresholds (reject outputs below threshold), retrieval-augmented generation (RAG) with source citation. |
| **Medium-term** | Build a multi-layer validation pipeline: Layer 1: Automated checks (format, consistency, source verification). Layer 2: Confidence scoring (flag low-confidence outputs for review). Layer 3: Human review for flagged outputs. |

**Recommended Tools:**
- **Guardrails AI** — Open-source framework for LLM output validation (format, factuality, safety)
- **NeMo Guardrails (NVIDIA)** — Programmable guardrails for LLM applications
- **Galileo** — LLM monitoring with hallucination detection
- **Vectara Hallucination Evaluation Model (HHEM)** — Open-source hallucination detection model
- **Chainpoll** — Hallucination detection through multi-model consensus
- **RAG approach** — Ground AI outputs in your own verified knowledge base using retrieval-augmented generation

---

### airisk-2: Do you have model drift detection and monitoring?

**Mitigation — Implement Continuous Drift Monitoring**

(See the detailed Drift Monitoring section in the research — 4 drift types, 12+ tools, retesting cadences, response playbook.)

**Quick implementation path:**
1. Week 1-2: Establish baseline profiles for all production models (input distributions, output distributions, performance metrics)
2. Month 1: Deploy Evidently AI (open-source) or Whylogs for data drift monitoring
3. Month 2: Set up alerting thresholds (PSI > 0.1 = investigate, > 0.25 = immediate action)
4. Ongoing: Weekly drift reports for high-risk models, monthly for medium-risk

---

### airisk-3: Do you have defenses against prompt injection attacks?

**Mitigation — Multi-Layer Prompt Injection Defense**

| Action | Detail |
|--------|--------|
| **Layer 1: Input Sanitization** | Strip or escape special characters and known injection patterns from user inputs before they reach the AI model. Use allowlists for expected input formats where possible. |
| **Layer 2: System Prompt Hardening** | Use strong system prompts that explicitly instruct the model to ignore injection attempts. Separate user input from system instructions architecturally (don't concatenate). |
| **Layer 3: Output Filtering** | Scan AI outputs for signs of injection success (unexpected format changes, data leakage, instruction following from user input). Block suspicious outputs. |
| **Layer 4: Monitoring** | Log all prompts and outputs. Monitor for anomalous patterns (unusual prompt lengths, known injection signatures, unexpected output formats). Alert on detection. |

**Recommended Tools:**
- **Rebuff** — Open-source prompt injection detection
- **LLM Guard** — Open-source library for LLM security (prompt injection, PII detection, jailbreak detection)
- **Lakera Guard** — Commercial prompt injection detection API
- **Arthur Shield** — LLM firewall (prompt injection, toxicity, PII leakage)
- **Protect AI** — AI security platform with prompt injection defense

---

### airisk-4: Do you have governance controls for agentic AI (autonomous agents)?

**Mitigation — Implement Agentic AI Governance Framework**

| Action | Detail |
|--------|--------|
| **Immediate** | Inventory all autonomous AI agents in use. For each, document: What actions can it take? What systems can it access? What's the blast radius of a bad action? |
| **Short-term** | Implement agent governance controls: Scope limits — define exactly what each agent CAN and CANNOT do. Approval gates — require human approval for high-impact actions (financial transactions, data deletion, system access changes). Monitoring — log all agent actions in real-time. Kill switch — ability to halt any agent immediately. Sandboxing — agents operate in restricted environments with limited permissions. |
| **Medium-term** | Implement agent testing before production deployment: adversarial testing, boundary testing (does it stay within scope?), failure mode testing (what happens when it encounters unexpected situations?). |

**Key governance principles for agents:**
1. **Least privilege** — Agents should have minimum permissions needed for their task
2. **Human oversight** — Critical actions require human approval
3. **Reversibility** — Agent actions should be reversible where possible
4. **Auditability** — Every agent action is logged with full context
5. **Containment** — Agents cannot escalate their own permissions

---

### airisk-5: Do you assess AI systems for bias and fairness?

**Mitigation — Implement Systematic Bias Testing**

| Action | Detail |
|--------|--------|
| **Immediate** | Identify AI systems that make decisions about people (hiring, lending, pricing, customer service prioritization, performance evaluation). These are highest priority for bias testing. |
| **Short-term** | For each identified system: define protected attributes (race, gender, age, disability, etc.), select fairness metrics (demographic parity, equalized odds, predictive parity), test for disparate impact. |
| **Medium-term** | Build bias testing into your AI deployment pipeline — no model goes to production without passing bias checks. |

**Recommended Tools:**
- **Fairlearn (Microsoft)** — Open-source Python library for bias assessment and mitigation
- **IBM AI Fairness 360 (AIF360)** — Open-source toolkit for detecting and mitigating bias
- **Google What-If Tool** — Visual tool for exploring model fairness
- **Aequitas** — Open-source bias audit toolkit from University of Chicago
- **Holistic AI** — Commercial AI bias auditing platform
- **Fiddler AI** — Model monitoring with fairness metrics built in

---

### airisk-6: Do you have AI explainability requirements for decision-making systems?

**Mitigation — Implement Explainability Standards**

| Action | Detail |
|--------|--------|
| **Immediate** | For each AI system: Can a non-technical stakeholder understand why the AI made a specific decision? If not, you have an explainability gap. |
| **Short-term** | Define explainability requirements by risk tier: High-risk (decisions affecting people's rights, safety, finances) → Full explainability required (feature importance, decision path, counterfactuals). Medium-risk → Summary explanations (key factors, confidence level). Low-risk → Logging sufficient for audit. |
| **Medium-term** | Implement explainability tools and document AI decision logic in a standardized format (model cards). |

**Recommended Tools:**
- **SHAP** — Open-source library for model-agnostic explanations (SHapley Additive exPlanations)
- **LIME** — Open-source Local Interpretable Model-agnostic Explanations
- **InterpretML (Microsoft)** — Open-source framework for interpretable ML
- **Fiddler AI** — Commercial explainability platform
- **Google Explainable AI** — Cloud-based explanation tools

---

### airisk-7: Do you validate the safety of third-party AI models and plugins before use?

**Mitigation — Third-Party AI Validation Process**

| Action | Detail |
|--------|--------|
| **Immediate** | Inventory all third-party AI models, plugins, and extensions in use. Flag any that were deployed without security review. |
| **Short-term** | Establish a validation checklist before deploying any third-party AI: Source verification (is this from a reputable source?), Security scan (malware, backdoors, known vulnerabilities), License review (what are the usage terms?), Sandboxed testing (run in an isolated environment first), Performance validation (does it do what it claims?), Data access audit (what data does it access and where does it send it?). |
| **Ongoing** | Monitor for supply chain alerts (CVEs, advisories) for all third-party AI components. |

**Recommended Tools:**
- **HiddenLayer** — AI model security scanning
- **Protect AI** — AI/ML supply chain security, model scanning
- **Snyk** — Dependency scanning (covers ML libraries)
- **Hugging Face model cards** — Check model documentation before using open models

---

### airisk-8: Do you have safeguards for AI interactions with vulnerable populations?

**Mitigation — Vulnerable Population AI Safeguards**

| Action | Detail |
|--------|--------|
| **Immediate** | Identify AI systems that interact with minors, patients, elderly, disabled persons, or other vulnerable groups. Apply enhanced controls immediately. |
| **Short-term** | Implement enhanced safeguards: Content filters tuned for vulnerable populations. Escalation protocols (AI detects distress → immediate human handoff). Age verification where applicable. Toxicity filtering at maximum sensitivity. Emergency resource surfacing (suicide hotline, emergency services). |
| **Ongoing** | Regular testing of safeguards with adversarial scenarios. Review with clinical/social work advisors if applicable. |

---

### airisk-9: Do you have a process for AI model versioning and rollback?

**Mitigation — Implement Model Version Control and Rollback**

| Action | Detail |
|--------|--------|
| **Immediate** | For each production AI model, document: current version, previous versions, deployment date, changes from previous version, rollback procedure. |
| **Short-term** | Implement model versioning: Use a model registry (MLflow, Weights & Biases, or even a structured database). Version all models with semantic versioning (major.minor.patch). Store previous model artifacts for rollback. |
| **Medium-term** | Implement automated rollback triggers: if performance drops below threshold after deployment, automatically revert to previous version. |

**Recommended Tools:**
- **MLflow Model Registry** — Open-source model versioning and lifecycle management
- **Weights & Biases** — Model versioning with experiment tracking
- **DVC (Data Version Control)** — Open-source version control for ML models and data
- **Amazon SageMaker Model Registry** — AWS-native model versioning
- **Vertex AI Model Registry** — GCP-native model versioning

---

### airisk-10: Do you monitor for deepfake and synthetic content threats?

**Mitigation — Deploy Deepfake Detection and Authentication**

| Action | Detail |
|--------|--------|
| **Immediate** | Awareness training for employees — especially finance, HR, and executives — on deepfake risks: voice cloning for wire fraud, video deepfakes for social engineering. |
| **Short-term** | Implement verification protocols for high-risk communications: verbal callback verification for wire transfers and payment changes, multi-factor authentication for executive requests, code words for sensitive instructions. |
| **Medium-term** | Deploy deepfake detection tools for incoming communications. Implement content authentication (C2PA standard) for outgoing content. |

**Recommended Tools:**
- **Microsoft Video Authenticator** — Analyzes videos for deepfake manipulation
- **Sensity AI** — Deepfake detection platform
- **Reality Defender** — Real-time deepfake detection for video, audio, and images
- **Pindrop** — Voice authentication and deepfake voice detection
- **C2PA (Coalition for Content Provenance and Authenticity)** — Standard for content authentication and provenance

---

## DIMENSION 6: ROI & Performance Tracking — Weight: 5%

Without rigorous measurement, AI investments become a financial black box. Research shows that 85% of organizations misestimate AI costs by more than 10%, and 70-85% of AI initiatives fail to meet expectations. This dimension covers multi-dimensional ROI tracking, hidden cost identification, performance KPIs, project success and failure analysis, executive dashboards, and industry benchmarking. Organizations that measure AI outcomes systematically make better investment decisions, kill underperforming projects faster, and can demonstrate concrete business value to leadership and the board.

---

### roi-1: Do you track ROI for AI initiatives beyond simple cost reduction?

**Mitigation — Implement Multi-Dimensional AI ROI Framework**

| Action | Detail |
|--------|--------|
| **Immediate** | Define your 5 ROI dimensions: Financial (cost reduction, revenue increase). Operational (efficiency, speed, accuracy). Innovation (new products/services enabled by AI, speed to market). Customer (NPS, retention, satisfaction, response time). Strategic (competitive positioning, market differentiation, talent attraction). |
| **Short-term** | For each active AI initiative, identify at least one KPI per applicable dimension. Set baseline measurements. |
| **Ongoing** | Monthly tracking of KPIs. Quarterly ROI review with executive leadership. |

(See detailed ROI measurement framework in the research section.)

---

### roi-2: What percentage of your revenue is influenced by AI initiatives?

**Mitigation — Establish AI Revenue Attribution**

| Action | Detail |
|--------|--------|
| **Immediate** | List all revenue-generating processes. For each, determine: Does AI play a role? What role? (Direct revenue generation, lead scoring, pricing optimization, churn prevention, upsell recommendation, etc.) |
| **Short-term** | Implement attribution tracking: A/B test AI-assisted vs. non-AI-assisted processes. Track conversion rates, deal sizes, and retention rates for AI-influenced interactions. |
| **Target** | AI Achievers attribute 30%+ of revenue to AI. Start tracking, set annual improvement targets. |

---

### roi-3: Do you track hidden AI costs?

**Mitigation — Implement Total Cost of AI Ownership Tracking**

| Action | Detail |
|--------|--------|
| **Immediate** | Create a cost tracking template with ALL AI cost categories: Direct costs: licensing, compute, API calls, infrastructure. Data costs: data preparation (60-80% of project time), data storage, data quality. Talent costs: AI/ML engineers (30-50% premium above market), training, contractors/consultants. Maintenance costs: model retraining (+22% of initial deployment), monitoring, drift remediation. Opportunity costs: failed AI projects, abandoned initiatives. Governance costs: compliance, auditing, committee time. |
| **Short-term** | Assign each AI project a cost code that captures all categories above. Report total cost alongside ROI. |

---

### roi-4: Do you have KPIs for AI model performance?

**Mitigation — Define Performance KPIs for All AI Systems**

| Action | Detail |
|--------|--------|
| **Immediate** | For each AI system, define and measure: Accuracy/F1/AUC (classification models). RMSE/MAE (regression models). Latency (response time). Throughput (requests per second). Availability (uptime). |
| **Short-term** | Set performance thresholds: "green" (acceptable), "yellow" (degraded, investigate), "red" (unacceptable, remediate immediately). |
| **Medium-term** | Build real-time performance dashboards. Alert when any KPI crosses a threshold. |

**Recommended Tools:**
- **Grafana + Prometheus** — Open-source monitoring and dashboarding
- **Datadog** — Commercial monitoring with ML-specific integrations
- **Arize AI** — ML-specific performance monitoring
- **New Relic** — APM with AI monitoring capabilities

---

### roi-5: How do you measure the impact of AI on customer experience?

**Mitigation — Implement AI Customer Impact Measurement**

| Action | Detail |
|--------|--------|
| **Immediate** | Identify all customer-facing AI touchpoints (chatbots, recommendations, personalization, automated responses). For each, baseline current metrics: CSAT, NPS, response time, resolution rate. |
| **Short-term** | Implement A/B testing: AI-assisted vs. non-AI-assisted customer interactions. Measure the delta in customer satisfaction, resolution time, and retention. |
| **Ongoing** | Track AI-attributed customer metrics monthly. Report alongside financial ROI. |

---

### roi-6: Do you track AI project success/failure rates?

**Mitigation — Implement AI Project Portfolio Tracking**

| Action | Detail |
|--------|--------|
| **Immediate** | Create a simple tracker: Project name, status (active/completed/abandoned), original business case, actual outcome, lessons learned. |
| **Short-term** | Define what "success" and "failure" mean for your organization: Success = met or exceeded business case projections within 12 months. Partial success = delivered value but below projections. Failure = abandoned or delivered no measurable value. |
| **Ongoing** | Track rates over time. Benchmark against industry (70-85% of AI initiatives fail expectations). Investigate systemic causes of failure. Conduct post-mortems for every failed project. |

---

### roi-7: Do you compare AI ROI against initial business case projections?

**Mitigation — Implement Business Case Variance Analysis**

| Action | Detail |
|--------|--------|
| **Immediate** | For every AI initiative, require a written business case before approval: expected costs, expected benefits, timeline, KPIs. |
| **Short-term** | At 6 and 12 months post-deployment, compare actual results vs. projections. Document variance and root causes. |
| **Ongoing** | Use historical variance data to improve future business case accuracy. Publish lessons learned to improve organizational AI estimation. |

---

### roi-8: Do you measure the impact of AI governance itself?

**Mitigation — Track Governance Program ROI**

| Action | Detail |
|--------|--------|
| **Track these governance-specific metrics** | Incidents avoided (shadow AI blocked, risky vendors caught in assessment). Time saved (standardized vendor evaluation vs. ad-hoc). Policy compliance rate (% of AI deployments going through governance). Mean time to AI use case approval. Audit readiness score. Training completion rates. Number of shadow AI tools discovered and remediated. |
| **Quarterly** | Report governance ROI to executive sponsor using the composite formula from the ROI framework. |

---

### roi-9: Do you have executive dashboards for AI performance and governance?

**Mitigation — Build an Executive AI Dashboard**

| Action | Detail |
|--------|--------|
| **Dashboard components** | AI Portfolio Health: Total AI systems, % in compliance, active projects, pipeline. Risk Posture: Overall governance score (from this assessment), dimension scores, trend over time. Financial: Total AI spend, ROI by initiative, cost vs. budget. Incidents: Open AI incidents, time to resolution, trend. Governance: Policy compliance rate, training completion, vendor assessment status. |
| **Recommended Tools** | Tableau, Power BI, Looker, or even a well-structured Notion/Confluence page for smaller organizations. |

---

### roi-10: Do you benchmark your AI maturity against industry peers?

**Mitigation — Conduct Annual AI Maturity Benchmarking**

| Action | Detail |
|--------|--------|
| **Immediate** | Use this assessment as your first benchmark. Record your scores. |
| **Annually** | Re-take this assessment. Compare year-over-year improvement. Share benchmarking insights with the governance committee and board. |
| **External benchmarking sources** | Accenture's annual AI research (Achiever benchmarks). McKinsey's annual State of AI survey. Gartner's AI Maturity Model. Your industry's specific AI benchmarking reports. |

---

## Summary

Every question now has a corresponding prescription that includes:
- **What to do** (specific actions in a timeline)
- **What tools to use** (both free/open-source and commercial options)
- **How much effort it takes** (time and cost estimates where applicable)
- **How to measure improvement** (so the business knows when they've "fixed" the issue)

This mitigation map transforms the assessment from a diagnostic tool into a **prescriptive action plan** — the doctor analogy the user requested.
