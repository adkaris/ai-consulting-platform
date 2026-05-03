# UniSystems AI Consulting Platform — User Guide

**Version 1.2.0** · UniSystems AI Consulting Practice · Internal Use Only

---

## Table of Contents

1. [Overview](#1-overview)
2. [Getting Started](#2-getting-started)
3. [Navigation](#3-navigation)
4. [Dashboard](#4-dashboard)
5. [Customer Portfolio](#5-customer-portfolio)
6. [Customer Profile](#6-customer-profile)
7. [Assessment Wizard](#7-assessment-wizard)
8. [Assessment Results](#8-assessment-results)
9. [AI Intake — Meeting Notes](#9-ai-intake--meeting-notes)
10. [Gap Analysis Report](#10-gap-analysis-report)
11. [Use Case Backlog](#11-use-case-backlog)
12. [Analytics](#12-analytics)
13. [Action Plan](#13-action-plan)
14. [Settings](#14-settings)
15. [Deliverable Generation (Word & PowerPoint)](#15-deliverable-generation-word--powerpoint)

**Appendix A** — [Clean Initialization (No Demo Data)](#appendix-a--clean-initialization-no-demo-data)  
**Appendix B** — [LLM / AI Provider Configuration](#appendix-b--llm--ai-provider-configuration)  
**Appendix C** — [Engagement Tracks Reference](#appendix-c--engagement-tracks-reference)

---

## 1. Overview

The UniSystems AI Consulting Platform is a web-based internal tool that supports the full lifecycle of an AI consulting engagement. It is built around the **UniSystems 5-Phase AI Consulting Framework** and provides:

- A structured **customer portfolio** covering all active and past engagements
- **AI Readiness Assessment** and **Microsoft Copilot Readiness Assessment** wizards
- **Use case discovery** and backlog management across all engagements
- **AI Intake** — paste raw meeting notes and have the platform auto-extract scores and use case ideas for review
- One-click **Word (DOCX) and PowerPoint (PPTX) deliverable generation** using the UniSystems document template
- **Analytics** across the portfolio with maturity benchmarking, risk matrices, and track distribution
- An **Action Plan** view listing all pending consultant tasks and deliverables across all customers

The platform is a local-first application — all data is stored in a SQLite database on the consultant's machine. No customer data is sent to external servers unless the AI Intake feature is used with a configured LLM provider.

---

## 2. Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/adkaris/ai-consulting-platform.git
cd ai-consulting-platform/platform

# 2. Install dependencies
npm install

# 3. Initialise the database
npx prisma db push
npx tsx prisma/seed-assessments.ts   # Seeds the assessment question bank only

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Loading Demo Data

To load the full set of 10 demo companies with realistic assessments, use cases, and phase data:

```bash
npx tsx prisma/seed.ts
npx tsx prisma/seed-assessments.ts
```

This creates 10 demo companies across all three engagement tracks (General AI, Microsoft Copilot, and Mixed), each at different phases of the consulting journey.

---

## 3. Navigation

The left sidebar provides access to all main sections of the platform:

| Link | Icon | Purpose |
|------|------|---------|
| **Dashboard** | Grid | Executive overview — KPIs, pipeline, velocity |
| **Customers** | Building | Full customer portfolio and customer creation |
| **Assessments** | Activity | All assessments across all customers |
| **Use Cases** | Lightbulb | Cross-portfolio use case backlog |
| **Analytics** | Bar chart | Portfolio-level charts and benchmarking |
| **Action Plan** | Clipboard | Pending tasks and deliverables for the consultant |
| **Settings** | Gear | LLM config, question bank, database management |

A **red badge** on the Action Plan link shows the count of pending consultant tasks across all active engagements.

---

## 4. Dashboard

**URL:** `/`

The Dashboard provides a live, high-level view of the full consulting portfolio.

### KPI Cards (top row)

- **Active Customers** — total number of customer records in the platform
- **Avg. AI Maturity** — mean of the latest overall assessment score across all customers with at least one assessment
- **Pipeline Value** — sum of all use case ROI estimates across the entire portfolio
- **Pending Actions** — number of outstanding consultant tasks (links to Action Plan)

### Charts

**Pipeline by Phase** (bar chart) — shows the number of customers at each of the 5 engagement phases. Click any bar to navigate to the filtered customer portfolio for that phase.

**Delivery Velocity** (pie chart) — shows the distribution of use cases by status (Draft, Approved, Piloting, Production).

**Top AI Initiatives** (list) — the top 5 use cases by estimated ROI across the entire portfolio. Each row shows the customer name, use case title, department, and ROI estimate.

**8-Domain Maturity Benchmarking** (radar chart) — overlays the average domain scores across all assessed customers against the UniSystems 4.0 benchmark. Useful for spotting systemic gaps across the portfolio.

---

## 5. Customer Portfolio

**URL:** `/customers`

The portfolio page lists all customer records as cards. Each card shows the customer name, industry, employee size, current phase, AI maturity score (if assessed), and engagement track badge.

### Creating a Customer

Click **+ New Customer** (top right). A modal appears with three engagement track cards:

- **General AI** (blue) — uses the 8-domain AI Readiness Assessment
- **Microsoft Copilot** (violet) — uses the 8-domain Copilot Readiness Assessment
- **Mixed** (emerald) — both assessments are available; the customer has dual maturity scoring

Fill in company name, industry, employee size, and AI ambition level (1–5), then click **Create Customer**. The customer is created at Phase 1 and you are redirected to their profile.

### Filtering and Searching

Use the filter row at the top of the portfolio to narrow the list:

- **Phase pills** — filter to customers at a specific phase (1–5)
- **Track pills** — filter to General AI, Copilot, or Mixed engagements
- **Industry dropdown** — filter to a specific industry vertical
- **Search box** — live search by company name
- **Sort** — sort by name, phase, maturity score, or creation date

### Engagement Track Badge

Each card displays a coloured chip:
- 🔵 **General AI** — blue
- 🟣 **Copilot** — violet
- 🟢 **Mixed** — emerald

---

## 6. Customer Profile

**URL:** `/customers/[id]`

The customer profile is the central hub for a single engagement. It is divided into a header section and a 5-phase workflow section.

### Header

The header shows:
- Company name, industry, employee count, and AI ambition level
- **Engagement track badge** (General AI / Copilot / Mixed)
- **Maturity score card(s)** — General AI score and/or Copilot score, with a staleness warning if the most recent assessment is older than 90 days
- **Phase indicator** — the customer's current phase with a progress bar
- **Edit Profile** button — opens a modal to update company details and change the engagement track
- **Export dropdown** — access to DOCX strategy map, PPTX deck, and print report

### Phase Workflow

Below the header, the **5-Phase Journey Navigator** shows all five phases as expandable sections. The active phase is highlighted. For each phase:

**Subtask Checklist** — a list of consultant tasks for that phase. Click any task to toggle it complete. Completed tasks show a green tick.

**Deliverables** — each phase has one or more named deliverables (e.g. "AI Readiness Assessment Report", "Use Case Catalogue"). For each deliverable:
- **Generate Draft** — auto-generates the document content using the UniSystems template and the customer's current data, then stores it as a draft
- **Approve** — marks the deliverable as approved
- **Download Word** — exports the deliverable as a `.docx` file using the UniSystems document format
- **Download PowerPoint** — available on Phase 1 and 2 deliverables

**Document Uploads** — attach supporting documents (PDFs, Word files, etc.) to any phase for record-keeping.

### Advancing the Phase

When all subtasks in the current phase are complete, an **Advance to Phase [N]** button appears. Clicking it moves the customer to the next phase.

### Use Cases

The use case panel appears below the phase workflow. It lists all use cases for the customer. Click **+ Add Use Case** to create a new one, or use **Import from Template** to load a pre-built template from the library.

---

## 7. Assessment Wizard

**URL:** `/customers/[id]/assessment/new`

The Assessment Wizard guides the consultant through scoring the customer across all domains.

### Track Routing

- **General AI customers** — the wizard loads the 8-domain General AI assessment automatically
- **Copilot customers** — the wizard loads the 8-domain Copilot Readiness Assessment automatically
- **Mixed customers** — a track chooser screen appears first, letting the consultant select which assessment to run

### Scoring

Each domain is presented as a card with 5–7 scored questions. Each question is answered on a 1–5 scale:
- **1** = No practice / Not applicable
- **2** = Ad hoc / Informal
- **3** = Defined / Documented
- **4** = Managed / Monitored
- **5** = Optimised / Industry-leading

The progress bar at the top shows completion across all domains. Copilot track assessments use a violet-themed progress bar.

Navigate between domains using the **Previous** and **Next** buttons. All answers are held in memory until the wizard is submitted.

### Submission

Click **Submit Assessment** on the final domain. Scores are saved to the database and you are redirected to the Assessment Results page.

---

## 8. Assessment Results

**URL:** `/customers/[id]/assessment/results?assessmentId=[id]`
or `/customers/[id]/assessment/results?copilotAssessmentId=[id]`

The results page displays the full assessment output:

### Radar Chart

An 8-axis radar chart shows the customer's scores overlaid against the UniSystems 4.0 benchmark. The shaded area represents the customer's current maturity envelope.

### Overall Score and Maturity Band

The overall weighted score is displayed prominently with its maturity band label (Initial, Developing, Defined, Managed, or Optimised).

### Domain Score Grid

All 8 domain scores are shown as cards with individual progress bars. Each card shows the domain name, score, maturity level, and a colour-coded severity indicator.

### Critical Gap Analysis

Domains scoring below 2.5 are flagged as critical gaps with a specific finding and recommended action. These gaps feed directly into the deliverable generators and the print report.

---

## 9. AI Intake — Meeting Notes

**URL:** `/customers/[id]/intake`

The AI Intake feature lets the consultant paste raw notes from a discovery call or stakeholder meeting and have the platform automatically extract structured information.

### How to Use

1. Paste the raw meeting transcript or notes into the text area
2. Click **Analyse Notes**
3. The platform calls the configured LLM and extracts:
   - **Readiness scores** for each of the 8 assessment domains (where sufficient evidence exists in the notes)
   - **Use case ideas** based on business pain points mentioned in the notes
4. A **review panel** appears showing each extracted finding — the consultant can **Approve**, **Reject**, or **Edit** each item individually
5. Click **Apply Approved Findings** to save the approved scores and use cases to the database

### Mock Mode

If no LLM provider is configured, the platform uses a built-in mock response for demonstration purposes. To use a real LLM, configure the provider in Settings (see Appendix B).

---

## 10. Gap Analysis Report

**URL:** `/customers/[id]/report`

The printable gap analysis report is a formatted, client-ready document showing the full readiness picture for a customer.

### Report Sections

The report automatically adjusts its content based on the customer's engagement track:

**General AI and Mixed customers:**
- Overall maturity score and phase
- 8-domain maturity grid with progress bars
- Critical gaps with findings and resolution actions
- Strategic roadmap summary with top use cases and total portfolio ROI

**Copilot-only customers:**
- Overall Copilot readiness score
- 8 Copilot domain cards (violet theme)
- Copilot-specific gaps
- ROI summary

**Mixed customers** see both the General AI domain grid and the Copilot domain grid.

### Print / Export

Use the **Print** button to open the browser print dialog. Use **PrintSectionControls** to toggle which sections appear in the printed output. The report uses print-specific CSS to produce a clean, professional A4 document.

---

## 11. Use Case Backlog

**URL:** `/use-cases`

The Use Case Backlog provides a cross-portfolio view of all AI and Copilot use cases across all customers.

### Columns

Each row shows: customer name, use case title, department, type (General AI / Copilot), priority, status, and ROI estimate.

### Filters

- **Priority pills** — All / High / Medium / Low
- **Department dropdown** — filter to a specific business function
- **Type pills** — All Types / General AI / Copilot
- **Sort** — by ROI (descending) or most recently created

### Inline Status Update

Click the **Status** dropdown on any row to update the use case status without leaving the page. A toast notification confirms the change.

### Type Badges

- 🤖 **General AI** — blue badge with robot icon
- 💻 **Copilot** — violet badge with monitor icon

---

## 12. Analytics

**URL:** `/analytics`

The Analytics page provides portfolio-level insight across all customers and engagements.

### Charts

**Maturity Radar with Benchmark** — radar chart showing average domain scores across the portfolio, overlaid with the 4.0 UniSystems benchmark line. Hover over any axis point to see the exact score.

**Maturity by Industry** — horizontal bar chart comparing average overall maturity across industry verticals. Useful for identifying which industries are furthest along in their AI journey.

**Risk Matrix** — scatter plot with AI Maturity on the X-axis and AI Ambition Level on the Y-axis. Each dot represents one customer. Dots are colour-coded by engagement track:
- 🔵 Blue = General AI
- 🟣 Violet = Copilot
- 🟢 Emerald = Mixed

Customers in the top-left quadrant (high ambition, low maturity) represent the highest-priority engagement risk.

**ROI Pipeline** — stacked bar chart showing the total use case portfolio value by phase. Each bar is split by use case status (Draft, Approved, Piloting, Production).

**Track Distribution** — donut pie chart showing the proportion of customers across the three engagement tracks.

---

## 13. Action Plan

**URL:** `/action-plan`

The Action Plan aggregates all outstanding consultant tasks across every active engagement into a single prioritised queue.

### Task Types

- **Phase subtasks** — individual checklist items within each customer's current phase that have not yet been ticked
- **Pending deliverables** — deliverables that are in PENDING status (not yet drafted or approved)

### Using the Action Plan

Each row shows the customer name, task description, phase number, and a **Complete** button. Clicking Complete marks the task as done in the customer's phase workflow and updates the red badge count in the sidebar.

Sort the list by due phase (ascending) to prioritise the most urgent engagements.

---

## 14. Settings

**URL:** `/settings`

The Settings page contains platform configuration, the assessment question banks, and database management tools.

### Sections

**AI / LLM Provider** — configure which LLM provider to use for the AI Intake feature. See [Appendix B](#appendix-b--llm--ai-provider-configuration) for full configuration instructions.

**Platform** — displays the current version number, framework, database engine, and methodology reference.

**Database** — shows live counts of customer records, assessments, and use cases. Includes the local database file path and the **Reset Database** button (see below).

**Reset Database (Danger Zone)** — permanently deletes all customer data, assessments, use cases, deliverables, and uploaded documents. The assessment question bank is preserved. A two-step confirmation is required. See [Appendix A](#appendix-a--clean-initialization-no-demo-data) for full details.

**5-Phase Consulting Methodology** — a reference view of the 5 phases and their domain/question counts.

**General AI Assessment Question Bank** — full CRUD management of the 8 General AI domains and their questions. Add, edit, or remove domains and individual questions. Changes take effect immediately in the assessment wizard.

**Microsoft Copilot Assessment Question Bank** — same CRUD interface for the 8 Copilot readiness domains and their questions.

**Data & Privacy** — notes on data storage, confidentiality, and backup guidance.

---

## 15. Deliverable Generation (Word & PowerPoint)

Deliverables are generated from the **Customer Profile** page, within each phase's deliverable panel.

### Generating a Word Deliverable

1. Navigate to the customer profile
2. Expand the relevant phase
3. In the **Deliverables** section, locate the target deliverable
4. Click **Generate Draft** — the platform assembles the content from the customer's data, assessment results, and use cases, applies the UniSystems document template, and saves the draft
5. Review the generated content (visible in the platform)
6. Click **Approve** when satisfied
7. Click **Download Word** to export a `.docx` file

### Word Document Structure

Each generated Word document follows the UniSystems document template:

| Page | Content |
|------|---------|
| Cover page | Document title, issue date, version, prepared for/by, confidentiality status |
| Document History | VERSION / DATE / DESCRIPTION / SECTIONS AFFECTED table |
| Copyright | Uni Systems S.M.S.A. copyright notice |
| Table of Contents | Auto-generated from the document chapters |
| List of Tables / Figures | Auto-populated |
| Chapter 1 | Executive Summary |
| Chapter 2+ | Document-specific content (per deliverable structure) |

All chapters use flowing prose with minimal bullet points, following the UniSystems consulting document style.

### Available Deliverables by Phase

| Phase | Deliverable | Key Content |
|-------|-------------|-------------|
| 1 | AI Readiness Assessment Report | 8-domain scores, gap analysis, recommendations |
| 1 | Strategic AI Adoption Roadmap | 5-phase journey, governance, risks |
| 2 | AI Use Case Catalogue | Prioritised use cases, PoV candidates |
| 2 | Business Case & ROI Analysis | Financial model, investment framework |
| 2 | Updated AI Adoption Roadmap (v2.0) | Refined roadmap with confirmed pilot scope |
| 3 | PoV Performance Report | Pilot results, Go/No-Go recommendation |
| 3 | Solution Design & Governance Plan | Architecture, governance framework |
| 3 | Go/No-Go & Rollout Plan | Decision record, wave deployment plan |
| 4 | Rollout Readiness Checklist | Pre-deployment governance gate |
| 4 | Training Materials Repository | Enablement programme structure |
| 4 | Adoption Status Report | Deployment progress, adoption metrics |
| 5 | Value Realization Report | Realized vs projected ROI, lessons learned |
| 5 | Continuous Improvement Backlog | Next-phase opportunities, CoE mandate |
| 5 | Enterprise Agentic AI Strategy | Autonomous AI capability roadmap |

### Generating a PowerPoint Deck

From the **Export** dropdown on the customer profile header, select **Export PowerPoint**. The platform generates a full client strategy deck using the customer's live data, including maturity scores, use cases, phase status, and ROI estimates. The file downloads immediately as `.pptx`.

---

## Appendix A — Clean Initialization (No Demo Data)

Use this when setting up the platform for a real engagement environment and you want to start with a completely empty database.

### Option 1: Reset via the Settings Page (Recommended)

1. Open the platform in your browser at `http://localhost:3000`
2. Navigate to **Settings** (gear icon in the sidebar)
3. Scroll to the **Database** section
4. Click the **Reset Database** button in the Danger Zone
5. Read the warning and click **Yes, Delete Everything**
6. The platform reloads at the Dashboard with an empty portfolio

This preserves the assessment question banks (General AI and Copilot domains and questions) so the assessment wizards continue to work.

### Option 2: Clean Setup from the Command Line

Run these commands in the `platform` directory:

```bash
# Delete the existing database
rm prisma/dev.db

# Re-create and push the schema
npx prisma db push

# Seed only the assessment question bank (no customers or demo data)
npx tsx prisma/seed-assessments.ts

# Start the server
npm run dev
```

The platform will start with an empty customer portfolio. The assessment wizards will be fully functional because the question bank is seeded.

### Option 3: Restore Demo Data at Any Time

If you want to reload the 10 demo companies after resetting:

```bash
npx tsx prisma/seed.ts
npx tsx prisma/seed-assessments.ts
```

> **Note:** Running `seed.ts` on an existing database will add duplicate demo companies. Always reset the database first (Option 1 or 2) before re-seeding.

### What Is and Is Not Deleted

| Data | Reset via Settings | CLI delete & push |
|------|--------------------|-------------------|
| Customers | ✅ Deleted | ✅ Deleted |
| Assessments | ✅ Deleted | ✅ Deleted |
| Use Cases | ✅ Deleted | ✅ Deleted |
| Deliverables | ✅ Deleted | ✅ Deleted |
| Uploaded Documents | ✅ Deleted (DB record) | ✅ Deleted |
| Assessment Question Bank | ❌ Preserved | ❌ Deleted — re-seed with `seed-assessments.ts` |

---

## Appendix B — LLM / AI Provider Configuration

The AI Intake feature (`/customers/[id]/intake`) requires an LLM provider to process meeting notes into structured findings. All configuration is stored in the browser's **localStorage** — nothing is persisted to the server or the database.

### Configuring the LLM Provider

1. Go to **Settings** (`/settings`)
2. In the **AI / LLM Provider** section at the top, click to expand the configuration panel
3. Select your provider and fill in the required fields

### Supported Providers

| Provider | Model Examples | Required Fields |
|----------|---------------|-----------------|
| **Anthropic Claude** | claude-sonnet-4-6, claude-opus-4-7 | API Key |
| **OpenAI / Azure OpenAI** | gpt-4o, gpt-4-turbo | API Key (+ Endpoint for Azure) |
| **Google Gemini** | gemini-1.5-pro, gemini-2.0-flash | API Key |
| **Ollama (Local)** | llama3, mistral, phi3 | Ollama endpoint (default: http://localhost:11434) |

### Recommended Models

For best extraction quality on meeting notes, use:
- **Anthropic:** `claude-sonnet-4-6` (fast, accurate)
- **OpenAI:** `gpt-4o` (high quality)
- **Local/offline:** `llama3:8b` via Ollama (no API cost, runs on-device)

### Mock Mode

If no provider is configured, the AI Intake feature runs in **Mock Mode** — it returns a realistic synthetic response that demonstrates the review workflow without making any API calls. This is useful for demonstrations and testing.

Mock Mode is indicated by a yellow banner on the Intake page.

### API Key Security

API keys are stored only in `localStorage` in your browser. They are never sent to the server and never stored in the database. They are included directly in the API call made from the server action using the key you provide.

> **Important:** Do not share your browser session with others when an API key is configured, as keys stored in localStorage are accessible to anyone with access to the browser developer tools.

### Clearing the Configuration

To remove a configured API key, return to Settings, clear the API Key field, and save. Alternatively, clear your browser's localStorage for the platform domain.

---

## Appendix C — Engagement Tracks Reference

The platform supports three engagement tracks, selected when creating a customer and changeable via Edit Profile.

### General AI Track (Blue)

**Use when:** The customer is pursuing a broad AI adoption programme covering multiple types of AI (generative AI, predictive analytics, automation, NLP, computer vision, etc.).

**Assessment:** 8-domain AI Readiness Assessment — Strategy & Vision, Data Readiness, Technology & Infrastructure, Security & Compliance, AI Skills & Talent, Organisational Readiness, AI Governance & Ethics, Financial & Operational Readiness.

**Deliverables:** Standard UniSystems 5-phase deliverable set.

### Microsoft Copilot Track (Violet)

**Use when:** The customer's primary AI initiative is the deployment of Microsoft 365 Copilot across their organisation.

**Assessment:** 8-domain Copilot Readiness Assessment — Strategy & Vision, M365 Foundation, Content & Data Readiness, Security & Compliance, Identity & Access Management, User Adoption Readiness, Use Case Value, Copilot Governance.

**Deliverables:** Standard 5-phase deliverable set with Copilot-framed language and Copilot domain breakdowns in the report.

### Mixed Track (Emerald)

**Use when:** The customer is pursuing both a broad General AI programme and a Microsoft Copilot deployment simultaneously.

**Features:**
- Both assessment types are available — run them independently
- The customer profile header shows **two** maturity scores (AI Maturity and Copilot score)
- The printed report shows both domain grids (General AI domains and Copilot domains)
- Use cases can be tagged as General AI or Copilot type
- The assessment wizard presents a track chooser at the start

### Changing Track

The engagement track can be changed at any time via **Edit Profile** on the customer profile page. A warning is shown if the change will affect which assessments are displayed. Existing assessments of the previous type are preserved but may no longer be shown in the primary view.

---

*UniSystems AI Consulting Platform v1.2.0 · Internal Use Only · © 2025 Uni Systems S.M.S.A.*
