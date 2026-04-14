# AI Consulting Platform

A modern Next.js web application for managing AI consulting engagements across a structured 5-phase Strategic Roadmap. Built for consulting teams to track client portfolios, run AI-assisted discovery, and generate professional deliverables — supporting both **General AI readiness** and **Microsoft Copilot** deployment tracks.

---

## Key Features

### Multi-Track Engagement Support
- **General AI track** — Full 8-domain AI readiness assessment (Strategy, Data, Tech, Security, Skills, Ops, Governance, Financial)
- **Microsoft Copilot track** — 8 Copilot-specific readiness domains (Strategy & Vision, M365 Foundation, Content & Data, Security & Compliance, Identity & Access, User Adoption, Use Case Value, Copilot Governance)
- **Mixed track** — Both streams active simultaneously; customers have assessments of both types with dual maturity scores shown on their profile
- Track is set at customer creation and can be changed later via Edit Profile

### Portfolio Intelligence
- **Executive Dashboard** — Live KPI cards, pipeline value by phase, delivery velocity, top AI initiatives, and 8-domain maturity benchmarking
- **Customer Portfolio** — Multi-client tracking with industry, phase, ambition level, readiness scores, and engagement track chip on every card. Filter by phase, industry, track, or sort options
- **Analytics** — Radar chart with benchmark overlay, maturity by industry bar chart, risk matrix scatter plot (colour-coded by engagement track: blue=General AI, violet=Copilot, emerald=Mixed), ROI pipeline stacked bar, track distribution pie chart

### 5-Phase AI Journey Navigator
Guides engagements through a structured methodology with per-phase subtask checklists and deliverable generation:
1. **Discovery & Readiness** — Track-aware assessment wizard; Copilot track uses violet theme and Copilot domain bank
2. **Strategy & Roadmap** — Use case backlog with type tagging (General AI / Copilot), initiative ROI modelling
3. **PoV Execution** — Proof of value tracking per initiative
4. **Change & Adoption** — Change management planning with categorised action items
5. **Value Realization** — Production use case tracking, realized value logging, KPI monitoring

### Assessment System
- **General AI assessment wizard** — 8 domains, 45 questions, weighted scoring, violet progress bar for Copilot track
- **Copilot assessment wizard** — 8 Copilot domains, 38 questions with 1–5 scoring guides, violet-accented UI
- **Mixed track** — Track chooser screen lets consultants select which assessment to run
- **Results page** — Handles both `?assessmentId` (General AI) and `?copilotAssessmentId` (Copilot); theme switches automatically; radar chart with benchmark overlay; critical gap analysis

### AI Intake
Paste raw meeting notes from a discovery call and the platform automatically:
- Extracts **readiness scores** across all 8 assessment domains
- Proposes **use cases** based on business pain points
- Presents a **review panel** — consultant approves, rejects, or edits each finding before saving

### Deliverable Generation
- **MS Word (.docx)** — One-click export of strategy maps, gap analyses, governance frameworks, and financial models
- **PowerPoint (.pptx)** — Full client strategy deck generated from live platform data
- **Print-ready report** — Copilot-framed for Copilot customers (violet accent, Copilot domain grid); both sections shown for Mixed customers

### Use Case Backlog
- Cross-portfolio view with type badge (General AI / Copilot) on every row
- Filter by priority, department, type (All / General AI / Copilot), and sort by ROI or date
- Inline status updates with toast feedback

### Settings
- Two separate question banks: **General AI** (blue) and **Microsoft Copilot** (violet)
- Full CRUD on domains and questions per track

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Server Actions, React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | SQLite via Prisma 7 (`@prisma/adapter-better-sqlite3`) |
| Charts | Recharts |
| Icons | Lucide React |
| Documents | `docx`, `pptxgenjs`, `marked` |

---

## Local Setup

1. **Clone the repository**
    ```bash
    git clone https://github.com/adkaris/ai-consulting-platform.git
    cd ai-consulting-platform
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up the database**
    ```bash
    npx prisma db push
    npx tsx prisma/seed.ts
    npx tsx prisma/seed-assessments.ts
    ```
    This seeds **10 demo companies** across all three engagement tracks with realistic assessments, use cases, and phase data.

4. **Start the development server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000)

---

## Demo Data

The seed script creates **10 demo companies**:

| Customer | Track | Notes |
|----------|-------|-------|
| Nexus Manufacturing GmbH | General AI | Phase 1, entry-level |
| Meridian Financial Services | General AI | Phase 2 |
| Orion Energy Solutions | General AI | Phase 2 |
| Vertex Retail Group | General AI | Phase 4 |
| Atlas Logistics | General AI | Phase 5, most mature |
| Contoso Legal LLP | Microsoft Copilot | Phase 2 |
| Nordvik Bank | Microsoft Copilot | Phase 3 |
| Strategos Consulting | Microsoft Copilot | Phase 4, highest Copilot score |
| HealthBridge Partners | Mixed | Phase 3, both GA + Copilot assessments |
| Telecom Nova | Mixed | Phase 3, both GA + Copilot assessments |

---

## Project Structure

```
src/
├── app/
│   ├── actions.ts                      # Server actions (customers, use cases, phases, deliverables)
│   ├── assessment-actions.ts           # Assessment-specific actions (GA + Copilot schemas, save)
│   ├── customers/
│   │   └── [id]/
│   │       ├── page.tsx                # Profile: dual maturity scores for MIXED customers
│   │       ├── assessment/
│   │       │   ├── new/page.tsx        # Track-aware wizard; MIXED shows TrackSelector
│   │       │   └── results/page.tsx   # Dual-mode: ?assessmentId or ?copilotAssessmentId
│   │       ├── report/page.tsx         # Copilot-framed for COPILOT/MIXED customers
│   │       └── intake/page.tsx         # AI intake from meeting notes
│   ├── analytics/page.tsx              # Portfolio charts (track-coloured risk matrix)
│   ├── use-cases/page.tsx              # Type-filtered use case backlog
│   └── settings/page.tsx              # Dual question banks (GA + Copilot)
├── components/
│   ├── ProfileWorkflow.tsx             # Main customer profile orchestrator
│   ├── AssessmentForm.tsx              # Track-aware wizard (trackType prop)
│   ├── AnalyticsClient.tsx             # Charts incl. track distribution pie
│   ├── CustomerFilters.tsx             # Phase / Industry / Track / Sort filters
│   ├── UseCaseFilters.tsx              # Priority / Dept / Type / Sort filters
│   ├── NewCustomerModal.tsx            # 3-card engagement type selector
│   ├── EditProfileModal.tsx            # Includes track changer with warning
│   └── ...
└── lib/
    ├── assessment-data.ts              # 8 General AI domains, 45 questions
    ├── copilot-assessment-data.ts      # 8 Copilot domains, 38 questions, score keys
    ├── ai-advisor.ts                   # Recommendation engine (General AI)
    ├── methodology.ts                  # 5-phase framework definition
    ├── deliverable-generators.ts       # Markdown templates per deliverable
    ├── docx-utils.ts                   # Word document generation
    └── pptx-utils.ts                   # PowerPoint generation
prisma/
├── schema.prisma                       # Data model (Customer.aiTrack, CopilotAssessment, etc.)
├── seed.ts                             # 10 demo companies (5 GA, 3 Copilot, 2 Mixed)
└── seed-assessments.ts                 # Populates AssessmentDomain/Question for both tracks
```

---

## Data Model Highlights

- `Customer.aiTrack` — `GENERAL_AI | COPILOT | MIXED`
- `Assessment` — 8 General AI domain scores (unchanged)
- `CopilotAssessment` — 8 Copilot domain scores (`scoreStrategy`, `scoreM365`, `scoreContent`, `scoreSecurity`, `scoreIdentity`, `scoreAdoption`, `scoreUseCases`, `scoreGovernance`)
- `UseCase.useCaseType` — `GENERAL_AI | COPILOT`
- `AssessmentDomain.trackType` — `GENERAL | COPILOT` (drives question bank routing)

---

## License
Internal use only.
