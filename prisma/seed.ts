/**
 * Demo seed — 8 companies across all industries and phases.
 * Run: npx tsx prisma/seed.ts
 */
import prisma from '../src/lib/prisma'

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000)

const PHASE_TASKS: Record<number, string[]> = {
    1: ['stakeholder_alignment', 'current_state_assessment', 'security_technical_readiness', 'business_readiness_hypotheses'],
    2: ['deep_dive_workshops', 'persona_driven_discovery', 'use_case_prioritization', 'adoption_strategy'],
    3: ['pov_planning_setup', 'pov_solution_design', 'pov_execution', 'pov_outcomes'],
    4: ['phased_rollout', 'training_enablement', 'adoption_monitoring', 'governance_rollout'],
    5: ['measure_business_outcomes', 'user_feedback_satisfaction', 'continuous_improvement', 'expansion_use_cases'],
}
const PHASE_DELIVERABLES: Record<number, string[]> = {
    1: ['readiness_report', 'adoption_roadmap_v1'],
    2: ['usecase_catalogue', 'roi_analysis', 'adoption_roadmap_v2'],
    3: ['pov_results_report', 'solution_governance_plan', 'gono_rollout_plan'],
    4: ['rollout_checklist', 'training_materials_repo', 'adoption_status_report'],
    5: ['value_realization_report', 'improvement_backlog', 'enterprise_agents_plan'],
}

function allTasks(customerId: string, phases: number[]) {
    return phases.flatMap(p =>
        PHASE_TASKS[p].map(key => ({
            customerId, phaseNumber: p, taskKey: key,
            completed: true, completedAt: daysAgo((5 - p) * 30 + 5),
        }))
    )
}
function partialTasks(customerId: string, phase: number, done: number) {
    return PHASE_TASKS[phase].map((key, i) => ({
        customerId, phaseNumber: phase, taskKey: key,
        completed: i < done, completedAt: i < done ? daysAgo((5 - phase) * 15 + 5) : null,
    }))
}
function allDeliverables(customerId: string, phases: number[]) {
    return phases.flatMap(p =>
        PHASE_DELIVERABLES[p].map(key => ({
            customerId, phaseNumber: p, deliverableKey: key,
            status: 'COMPLETED', completedAt: daysAgo((5 - p) * 30),
        }))
    )
}

async function main() {
    console.log('🗑  Clearing existing data…')
    await prisma.document.deleteMany()
    await prisma.deliverable.deleteMany()
    await prisma.phaseTask.deleteMany()
    await prisma.useCaseROI.deleteMany()
    await prisma.useCase.deleteMany()
    await prisma.changeManagementItem.deleteMany()
    await prisma.assessment.deleteMany()
    await prisma.customer.deleteMany()
    console.log('✅ Cleared.\n')

    // ────────────────────────────────────────────────────────────────────────
    // 1. NEXUS MANUFACTURING GMBH — Phase 1
    // ────────────────────────────────────────────────────────────────────────
    console.log('1/8  Nexus Manufacturing GmbH…')
    const nexus = await prisma.customer.create({
        data: { name: 'Nexus Manufacturing GmbH', industry: 'Manufacturing', employees: '500–1,000', ambitionLevel: 2, currentPhase: 1, createdAt: daysAgo(60) },
    })
    await prisma.assessment.create({
        data: { customerId: nexus.id, scoreStrategy: 1.8, scoreData: 1.5, scoreTech: 2.0, scoreSecurity: 2.2, scoreSkills: 1.4, scoreOps: 1.7, scoreGovernance: 1.2, scoreFinancial: 2.0, status: 'COMPLETED', completedAt: daysAgo(45) },
    })
    await prisma.phaseTask.createMany({ data: partialTasks(nexus.id, 1, 2) })
    // Two early-stage use case hypotheses (DRAFT, no ROI details yet — typical Phase 1)
    await prisma.useCase.create({
        data: {
            customerId: nexus.id, title: 'Predictive Quality Control', department: 'Production',
            description: 'Use machine vision to detect surface defects on stamped metal parts before assembly, reducing scrap rate.',
            priority: 'HIGH', complexity: 6, value: 8, status: 'DRAFT', roiEstimate: 0,
            rois: { create: [{ type: 'PERFORMANCE', value: 30, unit: '%', description: 'Estimated reduction in scrap rate' }] },
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: nexus.id, title: 'Maintenance Work Order Automation', department: 'Maintenance',
            description: 'NLP reads technician logs and auto-generates work orders and parts requests in SAP.',
            priority: 'MEDIUM', complexity: 4, value: 6, status: 'DRAFT', roiEstimate: 0,
            rois: { create: [{ type: 'TIME', value: 5, unit: 'hrs/week', description: 'Admin time saved per technician' }] },
        },
    })

    // ────────────────────────────────────────────────────────────────────────
    // 2. MERIDIAN FINANCIAL SERVICES — Phase 2
    // ────────────────────────────────────────────────────────────────────────
    console.log('2/8  Meridian Financial Services…')
    const meridian = await prisma.customer.create({
        data: { name: 'Meridian Financial Services', industry: 'Financial Services', employees: '1,000–5,000', ambitionLevel: 3, currentPhase: 2, createdAt: daysAgo(120) },
    })
    await prisma.assessment.create({
        data: { customerId: meridian.id, scoreStrategy: 3.2, scoreData: 2.8, scoreTech: 3.0, scoreSecurity: 3.5, scoreSkills: 2.5, scoreOps: 2.9, scoreGovernance: 3.1, scoreFinancial: 3.4, status: 'COMPLETED', completedAt: daysAgo(90) },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(meridian.id, [1]), ...partialTasks(meridian.id, 2, 2)] })
    await prisma.deliverable.createMany({ data: allDeliverables(meridian.id, [1]) })

    await prisma.useCase.create({
        data: {
            customerId: meridian.id, title: 'AI-Powered Credit Risk Scoring', department: 'Risk & Credit',
            description: 'ML models automate SME credit decisioning, reducing manual review time and improving accuracy.',
            priority: 'HIGH', complexity: 7, value: 9, status: 'DRAFT', roiEstimate: 420000,
            rois: { create: [
                { type: 'MONEY', value: 420000, unit: '€', description: 'Reduction in credit losses and manual review costs' },
                { type: 'TIME', value: 18, unit: 'hrs/week', description: 'Analyst hours saved on manual reviews' },
                { type: 'PERFORMANCE', value: 22, unit: '%', description: 'Improvement in credit decision accuracy' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: meridian.id, title: 'Regulatory Document Summarisation', department: 'Compliance',
            description: 'AI reads MiFID/EBA/GDPR updates and drafts compliance impact assessments automatically.',
            priority: 'HIGH', complexity: 4, value: 8, status: 'DRAFT', roiEstimate: 95000,
            rois: { create: [
                { type: 'TIME', value: 12, unit: 'hrs/week', description: 'Compliance officer review time saved' },
                { type: 'MONEY', value: 95000, unit: '€', description: 'Reduced external counsel costs' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: meridian.id, title: 'Intelligent Client Onboarding Assistant', department: 'Operations',
            description: 'Conversational AI guides new clients through KYC submission, flags gaps and pre-fills forms.',
            priority: 'MEDIUM', complexity: 5, value: 7, status: 'DRAFT', roiEstimate: 210000,
            rois: { create: [
                { type: 'TIME', value: 8, unit: 'hrs/week', description: 'Operations team hours saved' },
                { type: 'PERFORMANCE', value: 35, unit: '%', description: 'Reduction in onboarding cycle time' },
                { type: 'MONEY', value: 210000, unit: '€', description: 'Annual cost avoidance' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: meridian.id, title: 'Fraud Pattern Detection', department: 'Fraud & Security',
            description: 'Real-time AI flags anomalous transaction patterns for immediate investigation.',
            priority: 'HIGH', complexity: 8, value: 10, status: 'DRAFT', roiEstimate: 1800000,
            rois: { create: [
                { type: 'MONEY', value: 1800000, unit: '€', description: 'Prevented fraud losses annually' },
                { type: 'PERFORMANCE', value: 40, unit: '%', description: 'Improvement in fraud detection recall' },
            ]},
        },
    })

    // ────────────────────────────────────────────────────────────────────────
    // 3. HEALTHBRIDGE PARTNERS — Phase 3
    // ────────────────────────────────────────────────────────────────────────
    console.log('3/8  HealthBridge Partners…')
    const healthbridge = await prisma.customer.create({
        data: { name: 'HealthBridge Partners', industry: 'Healthcare', employees: '200–500', ambitionLevel: 4, currentPhase: 3, createdAt: daysAgo(180) },
    })
    await prisma.assessment.create({
        data: { customerId: healthbridge.id, scoreStrategy: 3.8, scoreData: 3.2, scoreTech: 3.5, scoreSecurity: 4.0, scoreSkills: 3.0, scoreOps: 3.6, scoreGovernance: 4.2, scoreFinancial: 3.5, status: 'COMPLETED', completedAt: daysAgo(150) },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(healthbridge.id, [1, 2]), ...partialTasks(healthbridge.id, 3, 2)] })
    await prisma.deliverable.createMany({ data: allDeliverables(healthbridge.id, [1, 2]) })

    await prisma.useCase.create({
        data: {
            customerId: healthbridge.id, title: 'Clinical Note Summarisation', department: 'Clinical Operations',
            description: 'AI generates structured SOAP summaries from physician dictations, cutting documentation time by 60%.',
            priority: 'HIGH', complexity: 5, value: 9, status: 'PILOTING',
            povTimeframe: '10 weeks', povNotes: 'Week 4 of 10. Running with 12 cardiologists.',
            povSuccessCriteria: '• Physician documentation time reduced by ≥50%\n• 95% accuracy vs manual review\n• NPS score ≥ 7 from pilot physicians',
            roiEstimate: 280000,
            rois: { create: [
                { type: 'TIME', value: 6, unit: 'hrs/week', description: 'Documentation time saved per physician' },
                { type: 'MONEY', value: 280000, unit: '€', description: 'Annual documentation labour avoided' },
                { type: 'PERFORMANCE', value: 28, unit: '%', description: 'Increase in patient-facing time per physician' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: healthbridge.id, title: 'Patient Triage Chatbot', department: 'Patient Services',
            description: 'Symptom-based AI routes patients to the right care pathway, reducing A&E overcrowding.',
            priority: 'HIGH', complexity: 6, value: 8, status: 'APPROVED',
            povTimeframe: '8 weeks', povNotes: 'Integration with appointment system underway. Launching next sprint.',
            povSuccessCriteria: '• Correct triage classification ≥ 88%\n• Patient satisfaction ≥ 4/5\n• 20% reduction in low-acuity A&E visits',
            roiEstimate: 150000,
            rois: { create: [
                { type: 'MONEY', value: 150000, unit: '€', description: 'A&E cost reduction via appropriate routing' },
                { type: 'PERFORMANCE', value: 20, unit: '%', description: 'Reduction in unnecessary A&E presentations' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: healthbridge.id, title: 'Drug Interaction Alert System', department: 'Pharmacy',
            description: 'Pharmacovigilance AI cross-checks prescriptions against patient history and flags dangerous interactions.',
            priority: 'MEDIUM', complexity: 7, value: 7, status: 'DRAFT', roiEstimate: 90000,
            rois: { create: [
                { type: 'PERFORMANCE', value: 45, unit: '%', description: 'Reduction in preventable drug interaction events' },
                { type: 'MONEY', value: 90000, unit: '€', description: 'Liability and adverse event cost avoidance' },
            ]},
        },
    })

    // ────────────────────────────────────────────────────────────────────────
    // 4. VERTEX RETAIL GROUP — Phase 4
    // ────────────────────────────────────────────────────────────────────────
    console.log('4/8  Vertex Retail Group…')
    const vertex = await prisma.customer.create({
        data: { name: 'Vertex Retail Group', industry: 'Retail', employees: '5,000+', ambitionLevel: 3, currentPhase: 4, createdAt: daysAgo(270) },
    })
    await prisma.assessment.create({
        data: { customerId: vertex.id, scoreStrategy: 4.0, scoreData: 3.8, scoreTech: 3.5, scoreSecurity: 3.6, scoreSkills: 3.2, scoreOps: 3.9, scoreGovernance: 3.4, scoreFinancial: 4.1, status: 'COMPLETED', completedAt: daysAgo(240) },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(vertex.id, [1, 2, 3]), ...partialTasks(vertex.id, 4, 2)] })
    await prisma.deliverable.createMany({ data: allDeliverables(vertex.id, [1, 2, 3]) })

    await prisma.useCase.create({
        data: {
            customerId: vertex.id, title: 'Personalised Promotions Engine', department: 'Marketing',
            description: 'ML-driven targeting based on purchase history, basket analysis and seasonal signals.',
            priority: 'HIGH', complexity: 6, value: 9, status: 'PRODUCTION', realizedValue: 1250000, roiEstimate: 1100000,
            rois: { create: [
                { type: 'MONEY', value: 1100000, unit: '€', description: 'Incremental revenue from personalised promotions' },
                { type: 'PERFORMANCE', value: 18, unit: '%', description: 'Uplift in promotional redemption rate' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: vertex.id, title: 'Inventory Demand Forecasting', department: 'Supply Chain',
            description: 'AI forecasting reduces overstock and stockouts across 400+ SKUs in 60 stores.',
            priority: 'HIGH', complexity: 7, value: 8, status: 'PRODUCTION', realizedValue: 640000, roiEstimate: 580000,
            rois: { create: [
                { type: 'MONEY', value: 580000, unit: '€', description: 'Inventory holding cost reduction' },
                { type: 'PERFORMANCE', value: 31, unit: '%', description: 'Reduction in stockout events' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: vertex.id, title: 'Customer Service AI Assistant', department: 'Customer Service',
            description: 'LLM chat handling returns, order tracking and product queries — deflecting 65% of inbound contacts.',
            priority: 'HIGH', complexity: 4, value: 7, status: 'PILOTING',
            povTimeframe: '6 weeks', povNotes: 'Pilot in Northern region call centre. 3 weeks in. Deflection at 58%, trending up.',
            povSuccessCriteria: '• Contact deflection ≥ 65%\n• CSAT ≥ 4.2/5\n• AHT reduced by 40%',
            roiEstimate: 390000,
            rois: { create: [
                { type: 'MONEY', value: 390000, unit: '€', description: 'Cost reduction from contact deflection' },
                { type: 'TIME', value: 24, unit: 'hrs/week', description: 'Agent hours freed for complex queries' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: vertex.id, title: 'Dynamic Pricing Optimisation', department: 'Pricing',
            description: 'Real-time pricing engine adjusts prices based on competitor data, demand signals and margin targets.',
            priority: 'MEDIUM', complexity: 8, value: 8, status: 'APPROVED',
            povTimeframe: '12 weeks', povNotes: 'PoV starts Q2. Competitor data feed contract signed.',
            povSuccessCriteria: '• Gross margin improvement ≥ 2.5%\n• Price change latency < 15 minutes\n• Zero pricing errors in pilot category',
            roiEstimate: 820000,
            rois: { create: [
                { type: 'MONEY', value: 820000, unit: '€', description: 'Gross margin improvement from optimised pricing' },
                { type: 'PERFORMANCE', value: 2.5, unit: '%', description: 'Gross margin percentage uplift' },
            ]},
        },
    })
    await prisma.changeManagementItem.createMany({ data: [
        { customerId: vertex.id, category: 'STAKEHOLDER', title: 'Executive AI Steering Committee', description: 'Monthly C-suite forum overseeing AI rollout across all retail divisions.', status: 'IN_PROGRESS', owner: 'Chief Digital Officer', dueDate: 'Ongoing', notes: 'Third meeting held. Board fully engaged.' },
        { customerId: vertex.id, category: 'LITERACY', title: 'AI for Retail Staff — e-Learning Pathway', description: 'Mandatory modules covering AI basics, data privacy and responsible use for all 5,000 staff.', status: 'IN_PROGRESS', owner: 'L&D Team', dueDate: 'Q2 2026', notes: '62% completed Module 1. Target 90% by Q2.' },
        { customerId: vertex.id, category: 'RESKILLING', title: 'Data Analyst Upskilling Programme', description: 'Reskill 40 analysts to work with AI-generated insights and manage ML model outputs.', status: 'IN_PROGRESS', owner: 'HR & Analytics Lead', dueDate: 'Q3 2026', notes: 'Partner selected. Cohort 1 starts April 2026.' },
        { customerId: vertex.id, category: 'GOVERNANCE', title: 'AI Ethics & Responsible Use Policy', description: 'Policy covering bias detection, explainability and customer data handling.', status: 'COMPLETED', owner: 'Head of Compliance', dueDate: 'Q1 2026', notes: 'Policy approved by Board. Published on intranet.' },
    ]})

    // ────────────────────────────────────────────────────────────────────────
    // 5. ATLAS LOGISTICS — Phase 5
    // ────────────────────────────────────────────────────────────────────────
    console.log('5/8  Atlas Logistics…')
    const atlas = await prisma.customer.create({
        data: { name: 'Atlas Logistics', industry: 'Logistics', employees: '1,000–5,000', ambitionLevel: 5, currentPhase: 5, createdAt: daysAgo(400) },
    })
    await prisma.assessment.create({
        data: { customerId: atlas.id, scoreStrategy: 4.6, scoreData: 4.2, scoreTech: 4.5, scoreSecurity: 4.3, scoreSkills: 4.0, scoreOps: 4.7, scoreGovernance: 4.1, scoreFinancial: 4.8, status: 'COMPLETED', completedAt: daysAgo(370) },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(atlas.id, [1, 2, 3, 4]), ...partialTasks(atlas.id, 5, 3)] })
    await prisma.deliverable.createMany({ data: allDeliverables(atlas.id, [1, 2, 3, 4]) })

    await prisma.useCase.create({
        data: {
            customerId: atlas.id, title: 'Route Optimisation AI', department: 'Fleet Operations',
            description: 'Reinforcement learning model reduces fleet distance 14% across 800 daily routes.',
            priority: 'HIGH', complexity: 8, value: 10, status: 'PRODUCTION', realizedValue: 2100000, roiEstimate: 1800000,
            rois: { create: [
                { type: 'MONEY', value: 1800000, unit: '€', description: 'Fuel and operational cost savings' },
                { type: 'PERFORMANCE', value: 14, unit: '%', description: 'Reduction in total fleet distance' },
                { type: 'TIME', value: 3, unit: 'hrs/week', description: 'Dispatcher planning time saved per planner' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: atlas.id, title: 'Predictive Maintenance for HGVs', department: 'Maintenance',
            description: 'IoT + AI predicts component failures 72 hours in advance, cutting unplanned downtime 38%.',
            priority: 'HIGH', complexity: 7, value: 9, status: 'PRODUCTION', realizedValue: 870000, roiEstimate: 750000,
            rois: { create: [
                { type: 'MONEY', value: 750000, unit: '€', description: 'Avoided breakdown and emergency repair costs' },
                { type: 'PERFORMANCE', value: 38, unit: '%', description: 'Reduction in unplanned vehicle downtime' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: atlas.id, title: 'Automated Customs Documentation', department: 'Compliance',
            description: 'LLM extracts data from shipping manifests and auto-completes customs declarations, cutting processing 80%.',
            priority: 'MEDIUM', complexity: 5, value: 7, status: 'PRODUCTION', realizedValue: 310000, roiEstimate: 290000,
            rois: { create: [
                { type: 'TIME', value: 20, unit: 'hrs/week', description: 'Compliance clerk hours saved' },
                { type: 'MONEY', value: 290000, unit: '€', description: 'Labour cost and penalty avoidance' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: atlas.id, title: 'Warehouse Picking Optimisation', department: 'Warehousing',
            description: 'Computer vision and AI path-finding cuts picker travel distance 22% across 3 distribution centres.',
            priority: 'HIGH', complexity: 6, value: 8, status: 'PRODUCTION', realizedValue: 480000, roiEstimate: 440000,
            rois: { create: [
                { type: 'PERFORMANCE', value: 22, unit: '%', description: 'Reduction in picker travel distance' },
                { type: 'MONEY', value: 440000, unit: '€', description: 'Labour efficiency gains across 3 DCs' },
            ]},
        },
    })
    await prisma.changeManagementItem.createMany({ data: [
        { customerId: atlas.id, category: 'STAKEHOLDER', title: 'Board-level AI Value Dashboard', description: 'Real-time dashboard showing ROI, adoption metrics and fleet performance.', status: 'COMPLETED', owner: 'CEO Office', dueDate: 'Q4 2025', notes: 'Live. Presented at Q4 Board meeting — strong positive reception.' },
        { customerId: atlas.id, category: 'LITERACY', title: 'Driver & Dispatcher AI Adoption Programme', description: 'Training 900 drivers and 120 dispatchers on AI-assisted route tools.', status: 'COMPLETED', owner: 'Head of Operations', dueDate: 'Q3 2025', notes: '97% completion rate. Strong NPS from drivers.' },
        { customerId: atlas.id, category: 'GOVERNANCE', title: 'AI Model Audit & Drift Monitoring', description: 'Quarterly model performance review with automated alerting for prediction drift.', status: 'IN_PROGRESS', owner: 'Data Science Lead', dueDate: 'Ongoing', notes: 'Q1 2026 audit scheduled. Drift alerts live for all 4 production models.' },
        { customerId: atlas.id, category: 'CUSTOM', title: 'Expansion to Eastern European Routes', description: 'Extend route AI to 200+ new routes in Poland, Romania and Czech Republic.', status: 'IN_PROGRESS', owner: 'VP Eastern Europe', dueDate: 'Q3 2026', notes: 'Data collection underway. Model retraining planned Q2.' },
    ]})

    // ────────────────────────────────────────────────────────────────────────
    // 6. ORION ENERGY SOLUTIONS — Phase 2 (aggressive)
    // ────────────────────────────────────────────────────────────────────────
    console.log('6/8  Orion Energy Solutions…')
    const orion = await prisma.customer.create({
        data: { name: 'Orion Energy Solutions', industry: 'Energy', employees: '500–1,000', ambitionLevel: 5, currentPhase: 2, createdAt: daysAgo(90) },
    })
    await prisma.assessment.create({
        data: { customerId: orion.id, scoreStrategy: 4.2, scoreData: 3.5, scoreTech: 3.8, scoreSecurity: 3.9, scoreSkills: 3.0, scoreOps: 3.6, scoreGovernance: 3.3, scoreFinancial: 4.4, status: 'COMPLETED', completedAt: daysAgo(70) },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(orion.id, [1]), ...partialTasks(orion.id, 2, 3)] })
    await prisma.deliverable.createMany({ data: allDeliverables(orion.id, [1]) })

    await prisma.useCase.create({
        data: {
            customerId: orion.id, title: 'Energy Demand Forecasting', department: 'Grid Operations',
            description: 'AI predicts grid demand at 15-min intervals, improving balancing efficiency and reducing imbalance penalties.',
            priority: 'HIGH', complexity: 8, value: 10, status: 'DRAFT', roiEstimate: 3200000,
            rois: { create: [
                { type: 'MONEY', value: 3200000, unit: '€', description: 'Grid balancing cost savings annually' },
                { type: 'PERFORMANCE', value: 24, unit: '%', description: 'Improvement in demand forecast accuracy' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: orion.id, title: 'Predictive Asset Failure Detection', department: 'Asset Management',
            description: 'Sensor data fusion identifies transformer and line failures 48–72 hours in advance.',
            priority: 'HIGH', complexity: 9, value: 9, status: 'DRAFT', roiEstimate: 1500000,
            rois: { create: [
                { type: 'MONEY', value: 1500000, unit: '€', description: 'Emergency repair and outage cost avoidance' },
                { type: 'PERFORMANCE', value: 45, unit: '%', description: 'Reduction in unplanned outage hours' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: orion.id, title: 'Renewable Generation Optimisation', department: 'Renewables',
            description: 'ML optimises dispatch for wind/solar assets based on weather forecasts and market prices.',
            priority: 'HIGH', complexity: 7, value: 9, status: 'DRAFT', roiEstimate: 890000,
            rois: { create: [
                { type: 'MONEY', value: 890000, unit: '€', description: 'Incremental revenue from optimised dispatch' },
                { type: 'PERFORMANCE', value: 12, unit: '%', description: 'Increase in renewable asset yield' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: orion.id, title: 'B2B Customer Churn Prediction', department: 'Commercial',
            description: 'Propensity model identifies at-risk business customers 90 days before contract renewal.',
            priority: 'MEDIUM', complexity: 4, value: 7, status: 'DRAFT', roiEstimate: 420000,
            rois: { create: [
                { type: 'MONEY', value: 420000, unit: '€', description: 'Revenue retained through proactive intervention' },
                { type: 'PERFORMANCE', value: 18, unit: '%', description: 'Reduction in B2B churn rate' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: orion.id, title: 'Automated Regulatory Reporting', department: 'Regulatory Affairs',
            description: 'NLP extracts operational data and generates Ofgem compliance reports automatically.',
            priority: 'MEDIUM', complexity: 5, value: 6, status: 'DRAFT', roiEstimate: 160000,
            rois: { create: [
                { type: 'TIME', value: 15, unit: 'hrs/week', description: 'Regulatory team time saved on reporting' },
                { type: 'MONEY', value: 160000, unit: '€', description: 'External reporting consultant costs avoided' },
            ]},
        },
    })

    // ────────────────────────────────────────────────────────────────────────
    // 7. TELECOM NOVA — Phase 3 (multiple pilots)
    // ────────────────────────────────────────────────────────────────────────
    console.log('7/8  Telecom Nova…')
    const telecom = await prisma.customer.create({
        data: { name: 'Telecom Nova', industry: 'Telecommunications', employees: '5,000+', ambitionLevel: 4, currentPhase: 3, createdAt: daysAgo(210) },
    })
    await prisma.assessment.create({
        data: { customerId: telecom.id, scoreStrategy: 3.8, scoreData: 4.0, scoreTech: 4.2, scoreSecurity: 3.7, scoreSkills: 3.4, scoreOps: 3.9, scoreGovernance: 3.5, scoreFinancial: 4.0, status: 'COMPLETED', completedAt: daysAgo(180) },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(telecom.id, [1, 2]), ...partialTasks(telecom.id, 3, 3)] })
    await prisma.deliverable.createMany({ data: allDeliverables(telecom.id, [1, 2]) })

    await prisma.useCase.create({
        data: {
            customerId: telecom.id, title: 'Network Anomaly Detection', department: 'Network Operations',
            description: 'AI monitors 2M+ network events/second, detecting service degradation before customer impact.',
            priority: 'HIGH', complexity: 9, value: 10, status: 'PILOTING',
            povTimeframe: '12 weeks', povNotes: 'Week 8 of 12. MTTD currently 4.2 mins — model v2 in training.',
            povSuccessCriteria: '• Mean time to detect (MTTD) < 3 minutes\n• False positive rate < 5%\n• Zero P1 incidents missed during PoV',
            roiEstimate: 4500000,
            rois: { create: [
                { type: 'MONEY', value: 4500000, unit: '€', description: 'SLA penalty avoidance and churn reduction' },
                { type: 'PERFORMANCE', value: 60, unit: '%', description: 'Reduction in mean time to detect issues' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: telecom.id, title: 'AI Call Centre Agent Assist', department: 'Customer Operations',
            description: 'Real-time LLM surfaces KB articles, billing summaries and scripts for agents during calls.',
            priority: 'HIGH', complexity: 5, value: 8, status: 'PILOTING',
            povTimeframe: '8 weeks', povNotes: 'Running with 50 agents in Cork centre. Results trending positively.',
            povSuccessCriteria: '• AHT reduced ≥ 25%\n• First call resolution ≥ 82%\n• Agent satisfaction ≥ 4/5',
            roiEstimate: 1200000,
            rois: { create: [
                { type: 'MONEY', value: 1200000, unit: '€', description: 'Cost savings from handle time reduction' },
                { type: 'TIME', value: 35, unit: 'hrs/week', description: 'Total agent time saved across pilot cohort' },
                { type: 'PERFORMANCE', value: 25, unit: '%', description: 'Average handle time reduction' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: telecom.id, title: 'Subscriber Churn Propensity Scoring', department: 'Marketing',
            description: 'ML scores 4M+ subscribers monthly, triggering personalised retention offers for high-risk segments.',
            priority: 'HIGH', complexity: 6, value: 9, status: 'APPROVED',
            povTimeframe: '10 weeks', povNotes: 'Data pipeline ready. Model training complete. Starting PoV next sprint.',
            povSuccessCriteria: '• Churn prediction AUC ≥ 0.82\n• Retention rate in targeted segment improves ≥ 15%\n• Campaign ROI ≥ 3x cost',
            roiEstimate: 2800000,
            rois: { create: [
                { type: 'MONEY', value: 2800000, unit: '€', description: 'Revenue retained from churn prevention' },
                { type: 'PERFORMANCE', value: 15, unit: '%', description: 'Improvement in targeted segment retention' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: telecom.id, title: 'Automated 5G Tower Site Planning', department: 'Network Planning',
            description: 'Geospatial AI optimises placement of new 5G towers based on coverage gaps, cost and planning constraints.',
            priority: 'MEDIUM', complexity: 8, value: 7, status: 'DRAFT', roiEstimate: 950000,
            rois: { create: [
                { type: 'MONEY', value: 950000, unit: '€', description: 'CAPEX savings from optimised site placement' },
                { type: 'TIME', value: 40, unit: 'hrs/month', description: 'Planning team time saved per deployment cycle' },
            ]},
        },
    })

    // ────────────────────────────────────────────────────────────────────────
    // 8. STRATEGOS CONSULTING — Phase 4 (advanced)
    // ────────────────────────────────────────────────────────────────────────
    console.log('8/8  Strategos Consulting…')
    const strategos = await prisma.customer.create({
        data: { name: 'Strategos Consulting', industry: 'Professional Services', employees: '100–200', ambitionLevel: 4, currentPhase: 4, createdAt: daysAgo(300) },
    })
    await prisma.assessment.create({
        data: { customerId: strategos.id, scoreStrategy: 4.8, scoreData: 4.0, scoreTech: 4.3, scoreSecurity: 4.5, scoreSkills: 4.2, scoreOps: 4.4, scoreGovernance: 4.6, scoreFinancial: 4.1, status: 'COMPLETED', completedAt: daysAgo(270) },
    })
    await prisma.phaseTask.createMany({ data: [...allTasks(strategos.id, [1, 2, 3]), ...partialTasks(strategos.id, 4, 3)] })
    await prisma.deliverable.createMany({ data: allDeliverables(strategos.id, [1, 2, 3]) })

    await prisma.useCase.create({
        data: {
            customerId: strategos.id, title: 'AI-Assisted Proposal Generation', department: 'Business Development',
            description: 'LLM generates first-draft proposals from brief, past engagement data and methodology templates.',
            priority: 'HIGH', complexity: 4, value: 9, status: 'PRODUCTION', realizedValue: 320000, roiEstimate: 280000,
            rois: { create: [
                { type: 'TIME', value: 8, unit: 'hrs/week', description: 'Senior consultant time saved per proposal' },
                { type: 'MONEY', value: 280000, unit: '€', description: 'Effective billing rate increase from time saved' },
                { type: 'PERFORMANCE', value: 30, unit: '%', description: 'Reduction in proposal production time' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: strategos.id, title: 'Research & Insight Synthesis', department: 'Research',
            description: 'AI aggregates market research, competitor data and financials into structured insight briefs.',
            priority: 'HIGH', complexity: 5, value: 8, status: 'PRODUCTION', realizedValue: 185000, roiEstimate: 160000,
            rois: { create: [
                { type: 'TIME', value: 12, unit: 'hrs/week', description: 'Research analyst time saved per engagement' },
                { type: 'MONEY', value: 160000, unit: '€', description: 'Cost avoidance from internal research efficiency' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: strategos.id, title: 'Client Engagement Intelligence', department: 'Client Management',
            description: 'NLP analyses meeting transcripts and email threads to surface risks, actions and sentiment trends.',
            priority: 'MEDIUM', complexity: 6, value: 7, status: 'PILOTING',
            povTimeframe: '8 weeks', povNotes: 'Running with 6 engagement teams. Strong early feedback from PMs.',
            povSuccessCriteria: '• Action item capture rate ≥ 90%\n• Risk flag accuracy ≥ 85% verified by PM\n• Consultant satisfaction ≥ 4/5',
            roiEstimate: 95000,
            rois: { create: [
                { type: 'TIME', value: 3, unit: 'hrs/week', description: 'Meeting follow-up time saved per engagement manager' },
                { type: 'PERFORMANCE', value: 20, unit: '%', description: 'Reduction in missed actions and follow-through gaps' },
            ]},
        },
    })
    await prisma.useCase.create({
        data: {
            customerId: strategos.id, title: 'Knowledge Management AI', department: 'Knowledge & Learning',
            description: 'Semantic search over 10 years of engagement deliverables for rapid reuse of past frameworks.',
            priority: 'MEDIUM', complexity: 6, value: 7, status: 'PILOTING',
            povTimeframe: '6 weeks', povNotes: 'Knowledge base indexed. User testing starts next week.',
            povSuccessCriteria: '• Search relevance ≥ 4/5 in user testing\n• 70% of consultants using weekly after rollout',
            roiEstimate: 75000,
            rois: { create: [
                { type: 'TIME', value: 4, unit: 'hrs/week', description: 'Time saved searching for past work' },
                { type: 'PERFORMANCE', value: 25, unit: '%', description: 'Reuse rate of existing IP in new engagements' },
            ]},
        },
    })
    await prisma.changeManagementItem.createMany({ data: [
        { customerId: strategos.id, category: 'STAKEHOLDER', title: 'Partner-Level AI Sponsorship Forum', description: 'Monthly Partners meeting reviewing AI adoption and approving next-phase investments.', status: 'COMPLETED', owner: 'Managing Partner', dueDate: 'Q1 2026', notes: 'Established. Partners actively champion AI tools with clients.' },
        { customerId: strategos.id, category: 'LITERACY', title: 'Prompt Engineering Masterclass', description: 'All-hands workshop covering chain-of-thought, few-shot and structured output techniques.', status: 'COMPLETED', owner: 'Head of Innovation', dueDate: 'Feb 2026', notes: '100% participation. Post-workshop quality scores improved significantly.' },
        { customerId: strategos.id, category: 'GOVERNANCE', title: 'Client Data AI Usage Policy', description: 'Policy governing what client data may be processed by AI tools, with consent controls.', status: 'COMPLETED', owner: 'General Counsel', dueDate: 'Q4 2025', notes: 'Approved by all partners. Included in client engagement letters.' },
        { customerId: strategos.id, category: 'CUSTOM', title: 'AI Champions Network', description: 'One AI champion per practice area driving adoption and surfacing new use cases.', status: 'IN_PROGRESS', owner: 'COO', dueDate: 'Q2 2026', notes: '6 of 8 champions identified. Monthly Slack channel active with 90+ members.' },
    ]})

    console.log('\n✅ Seed complete. 8 companies created:\n')
    console.log('   1. Nexus Manufacturing GmbH       — Phase 1 — Manufacturing')
    console.log('   2. Meridian Financial Services     — Phase 2 — Financial Services')
    console.log('   3. HealthBridge Partners           — Phase 3 — Healthcare')
    console.log('   4. Vertex Retail Group             — Phase 4 — Retail')
    console.log('   5. Atlas Logistics                 — Phase 5 — Logistics')
    console.log('   6. Orion Energy Solutions          — Phase 2 — Energy (Aggressive)')
    console.log('   7. Telecom Nova                    — Phase 3 — Telecommunications')
    console.log('   8. Strategos Consulting            — Phase 4 — Professional Services')
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
