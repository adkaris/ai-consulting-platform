# AI Intake — Demo Narrative & Script

## What to Show

The **AI Intake** feature simulates what happens when a consultant pastes raw meeting notes directly into the platform after an initial discovery call with a client. The platform analyses the text in seconds and automatically:

- **Extracts readiness scores** across the 8 assessment domains
- **Proposes use cases** based on business pain points mentioned
- Lets the consultant **review and approve** each finding before saving

This demonstrates the platform's AI-native workflow — turning unstructured conversation into structured strategy data without manual entry.

---

## Step-by-Step Demo Flow

### 1. Navigate to the Customer Profile

Go to **Customers** → click on **Nexus Manufacturing GmbH** (Phase 1 — the client who has just had their first discovery call).

> *"Here is Nexus Manufacturing GmbH — a 500-person industrial company we have just started engaging. They are at Phase 1, our Discovery & Readiness Assessment stage. We have just come out of an initial workshop with their leadership team."*

---

### 2. Open AI Intake

Click the **AI Intake** button (top-right of the customer profile, the brain-circuit icon).

> *"Rather than manually filling in assessment forms, our platform lets consultants paste raw meeting notes directly — the AI does the heavy lifting of extracting structured insights."*

---

### 3. Paste the Meeting Notes

In the text area, paste the following transcript:

---

```
Meeting Notes — Nexus Manufacturing GmbH
Discovery Workshop — 19 March 2026
Attendees: CEO (Thomas Brandt), CFO (Sabine Koch), Head of Operations (Ralf Mayer), IT Director (Eva Schreiber), Consultant Team

---

EXECUTIVE SUMMARY
Strong commitment from CEO Thomas Brandt who is acting as our executive sponsor and champion for this AI initiative. He has a clear vision: reduce operational costs by 15% within 18 months using AI. The CFO flagged that the budget for this transformation has been ring-fenced at €800,000 for the first year — a positive signal on the financial side.

TECHNOLOGY LANDSCAPE
The IT Director shared a sobering picture. Nexus runs on a heavily customised SAP ECC 6.0 instance from 2009, on-prem infrastructure with no cloud strategy in place. Legacy architecture is the single biggest blocker — most systems are on-premise and there is no API layer to connect modern AI tooling. Significant investment in cloud migration would be required before advanced AI use cases are feasible.

DATA & ANALYTICS
Data is highly siloed across 4 plant locations with no central data warehouse. Each plant runs its own reporting in Excel. There are significant data quality issues in the production planning module. The team acknowledged that before any AI can be applied, data governance and a centralised data platform are prerequisites.

OPERATIONS & WORKFLOW
The Head of Operations identified two key pain points: (1) purchase invoice processing — the finance and billing team manually processes 3,000+ supplier invoices per month, which is error-prone and slow, and (2) customer complaint handling — the customer support team receives ~800 emails/week, each requiring manual triage and routing to the correct department.

SECURITY & COMPLIANCE
The CFO raised compliance concerns: GDPR obligations for customer data and NIS2 requirements for operational technology security need to be addressed. Risk appetite is moderate — the team wants AI solutions that are explainable and auditable.

SKILLS & TALENT
The Head of Operations confirmed that skills are a significant gap. The workforce has limited digital literacy and there is no existing data science capability in-house. A structured training programme will be essential. Talent acquisition for a Data Engineer role has been approved.

GOVERNANCE
The team confirmed they are beginning to develop AI standards and policy frameworks — they have a draft AI governance charter in progress. Standards for how AI tools can be used internally are being co-developed with Legal.

STRATEGIC ALIGNMENT
The CEO's stated priorities are: (1) operational excellence, (2) cost reduction, and (3) becoming a data-driven manufacturer by 2028. The AI initiative has strong executive backing and is linked to the company's 5-year transformation roadmap. Marketing and content automation was also briefly mentioned as a future consideration for their product catalogue team.

NEXT STEPS
Consultant team to produce an AI Readiness Report. Follow up with IT Director on architecture review. Budget: €800,000 confirmed for Year 1. Finance team to provide invoice volume data for ROI modelling.
```

---

### 4. Click "Analyse Notes"

Watch the 3-second AI analysis animation.

> *"The platform is now reading the notes — just as a consultant would — and extracting structured intelligence from the unstructured text."*

---

### 5. Review the Results

The platform will propose the following findings:

**Readiness Scores extracted:**
| Domain | Score | Why |
|--------|-------|-----|
| Strategy | 4.0 / 5 | CEO as executive champion, clear vision |
| Technology | 1.5 / 5 | Legacy on-prem SAP, no cloud, old architecture |
| Data | 4.5 / 5 | Data silos explicitly flagged |
| Security | 2.0 / 5 | Compliance and risk concerns raised |
| Skills | 1.8 / 5 | Skills gap and training needs confirmed |
| Operations | 2.3 / 5 | Operational workflow pain points described |
| Governance | 3.2 / 5 | AI governance charter in progress, policy/standards mentioned |
| Financial | 2.8 / 5 | Budget and cost context present |

**Use Cases proposed:**
| Use Case | Department | Priority | Why |
|----------|-----------|---------|-----|
| AI-Enhanced Customer Support Portal | Customer Service | HIGH | "customer support team" + "customer complaint handling" mentioned |
| Intelligent Invoice Processing | Finance | HIGH | "invoice processing", "finance and billing", "3,000 invoices" |
| Generative Content Factory | Marketing | MEDIUM | "marketing and content automation" briefly mentioned |

---

### 6. Approve Selectively — Key Demo Moment

Toggle **off** the "Generative Content Factory" — it was only briefly mentioned and is not a priority.

Toggle **on** the two high-priority use cases and all 8 domain scores.

> *"This is a key principle of the platform — the AI proposes, the consultant decides. We never blindly accept AI output. Here I'm removing the content automation case — it was a passing comment, not a real priority for this engagement."*

---

### 7. Save to Profile

Click **Apply to Profile**.

The platform will:
- Create a new **Assessment** record for Nexus Manufacturing with the 8 scores
- Add **2 Use Cases** to Phase 2 of their roadmap

---

### 8. Return to the Customer Profile — Show the Change

Navigate back to **Nexus Manufacturing GmbH**.

> *"Look at what happened. In under 30 seconds, we have gone from raw meeting notes to a structured assessment with scores across all 8 domains and two prioritised use cases ready for Phase 2. What would have taken 2 hours of manual data entry is done."*

Point out:
- The **Assessment** is now visible with domain breakdown
- Phase 2 shows **2 new use cases**: Customer Support Portal and Invoice Processing
- The **Journey Navigator** shows Phase 1 assessment complete

---

## Key Messages for Management

1. **Speed**: A 90-minute discovery call becomes structured strategy data in under a minute
2. **Consistency**: The same framework is applied to every client — no gaps, no variations in assessment quality
3. **Consultant control**: AI proposes, consultant approves — the platform augments judgement, never replaces it
4. **Traceability**: Every score and use case has an origin — the consultant's own notes
5. **Scalability**: A team of 5 consultants can now manage the rigour of a team of 20

---

## Tips for a Smooth Demo

- Use the meeting notes exactly as written above — they are crafted to trigger all 8 domain scores and the most relevant use cases
- The analysis takes ~3 seconds — use this moment to narrate what the AI is doing
- The toggle UX is deliberate — always toggle one item off to demonstrate consultant oversight
- If you want to reset and run it again, the "Apply to Profile" creates a new assessment — you can delete it from the database or simply use a different customer
