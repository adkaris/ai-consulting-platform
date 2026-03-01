# AI Consulting Platform

A full-featured web application for AI consulting engagements — built to guide clients through their AI adoption journey from initial readiness assessment to production deployment.

---

## Overview

This platform streamlines the end-to-end AI consulting workflow. It gives consultants a structured, data-driven way to manage client engagements: assess AI readiness across 8 business domains, prioritize use cases, track a 5-phase implementation journey, and generate professional gap-analysis reports.

---

## Features

### Customer Portfolio
Manage all client engagements from a central dashboard. Track each customer's industry, size, and current phase in their AI journey.

### AI Readiness Assessment
An 8-domain questionnaire that scores organizational maturity across:
- **Strategy** — AI vision, leadership alignment, and roadmap clarity
- **Data** — data availability, quality, and governance
- **Technology** — infrastructure, tooling, and integration capability
- **Security** — risk posture and compliance readiness
- **Skills** — talent, training, and capability gaps
- **Operations** — process readiness and change management
- **Governance** — policy frameworks and responsible AI practices
- **Financial** — budget, ROI expectations, and investment readiness

Weighted scoring generates a composite AI Readiness Score with automated recommendations.

### 5-Phase Implementation Journey
Guides customers through a structured methodology:
1. **Discovery** — Assess current state and define objectives
2. **Strategy** — Prioritize use cases and build the roadmap
3. **Pilot** — Develop and test proof-of-concept solutions
4. **Scale** — Operationalize and expand successful pilots
5. **Optimize** — Measure, learn, and continuously improve

Each phase includes subtask checklists, deliverable generation, and document management.

### Use Case Management
Capture, prioritize, and track AI use cases per customer. Manage ROI estimates, department ownership, and lifecycle status (Draft → Approved → Piloting → Production).

### Gap Analysis Report
Auto-generated, print-ready PDF reports summarizing assessment scores, identified gaps, and prioritized recommendations — ready to hand directly to clients.

### Analytics Dashboard
Aggregate insights across all engagements: readiness score distributions, phase progression, use case pipeline health, and industry benchmarks — visualized with radar, bar, and pie charts.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev) + [Tailwind CSS v4](https://tailwindcss.com) |
| Database | SQLite via [Prisma 7](https://www.prisma.io) + [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| Charts | [Recharts](https://recharts.org) |
| Icons | [Lucide React](https://lucide.dev) |
| Language | TypeScript |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/adkaris/ai-consulting-platform.git
cd ai-consulting-platform

# Install dependencies
npm install

# Generate Prisma client and initialize the database
npx prisma generate
npx prisma db push

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                        # Dashboard
│   ├── customers/
│   │   ├── page.tsx                    # Customer portfolio
│   │   └── [id]/
│   │       ├── page.tsx                # Customer profile + journey
│   │       ├── assessment/new/         # Assessment wizard
│   │       └── report/                 # Gap analysis report
│   ├── use-cases/page.tsx              # Use case pipeline
│   ├── assessments/page.tsx            # All assessments
│   └── analytics/page.tsx             # Analytics dashboard
├── components/
│   ├── Sidebar.tsx
│   ├── ProfileWorkflow.tsx             # 5-phase journey UI
│   ├── JourneyNavigator.tsx
│   ├── UseCaseModal.tsx
│   └── AnalyticsClient.tsx
└── lib/
    ├── assessment-data.ts              # Question bank + scoring
    ├── ai-advisor.ts                   # Recommendation engine
    ├── methodology.ts                  # Phase/task definitions
    └── deliverable-generators.ts       # Auto-generated content
```

---

## Database Schema

The app uses SQLite with five models:

- **Customer** — core engagement record (industry, size, phase, ambition level)
- **Assessment** — 8-domain readiness scores per customer
- **UseCase** — AI use cases with priority, ROI, and status tracking
- **PhaseTask** — per-customer task completion state per phase
- **Deliverable** — generated deliverable content per phase
- **Document** — file uploads attached to phases and tasks

---

## Roadmap

- [ ] Live dashboard statistics (currently hardcoded)
- [ ] Settings page
- [ ] User authentication
- [ ] Multi-tenant support
- [ ] Export assessments to Excel/CSV
- [ ] Email report delivery

---

## License

MIT
