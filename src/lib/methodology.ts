export interface SubTask {
    key: string
    title: string
    description: string
}

export interface DeliverableDef {
    key: string
    title: string
    description: string
}

export interface PhaseDef {
    number: number
    title: string
    color: string        // Tailwind color token
    subtasks: SubTask[]
    deliverables: DeliverableDef[]
}

export const METHODOLOGY: PhaseDef[] = [
    {
        number: 1,
        title: 'Discovery & Readiness Assessment',
        color: 'indigo',
        subtasks: [
            {
                key: 'stakeholder_alignment',
                title: 'Stakeholder Alignment & Vision',
                description: 'Engage executive sponsors and leaders to establish the AI initiative\'s strategic value and success metrics. Secure an Executive Sponsor and conduct vision workshops.',
            },
            {
                key: 'current_state_assessment',
                title: 'Current State Assessment',
                description: 'Evaluate the technology environment: licensing, tenant setup, compliance posture, data hygiene, and infrastructure maturity across 8 domains.',
            },
            {
                key: 'security_technical_readiness',
                title: 'Security, Compliance & Technical Readiness',
                description: 'Ensure security and compliance best practices are applied. Implement Responsible AI policies early, aligning with data privacy standards.',
            },
            {
                key: 'business_readiness_hypotheses',
                title: 'Business Readiness & Use Case Hypotheses',
                description: 'Assess organizational readiness through employee feedback and process pain points. Develop hypotheses on high-value use cases and evaluate change management maturity.',
            },
        ],
        deliverables: [
            {
                key: 'readiness_report',
                title: 'AI Readiness Assessment Report',
                description: 'Current state findings and gap analysis with tailored recommendations for remediation and preparation.',
            },
            {
                key: 'adoption_roadmap_v1',
                title: 'High-level AI Adoption Roadmap',
                description: 'Subsequent phases\' plan, confirms the executive sponsor and governance team, identifies initial target areas for AI introduction.',
            },
        ],
    },
    {
        number: 2,
        title: 'Use Case Identification & Strategy Alignment',
        color: 'emerald',
        subtasks: [
            {
                key: 'deep_dive_workshops',
                title: 'Deep-Dive Workshops by Domain/Function',
                description: 'Conduct interactive workshops and interviews with business units and end-users to discuss their work context, day-to-day tasks, and processes.',
            },
            {
                key: 'persona_driven_discovery',
                title: 'Persona-Driven Use Case Discovery',
                description: 'Leverage a persona-driven approach to uncover AI scenarios across departments. Map use cases to user personas and business processes.',
            },
            {
                key: 'use_case_prioritization',
                title: 'Use Case Prioritization',
                description: 'Identify opportunities from quick-wins to strategic, enterprise-scale. Evaluate ideas against impact and feasibility criteria. Associate each use case with expected benefits.',
            },
            {
                key: 'adoption_strategy',
                title: 'Define AI Adoption Strategy',
                description: 'Formulate a strategy aligning AI adoption with the organization\'s goals. Define pilot scope, roll-out approach, change management, data privacy, and training considerations.',
            },
        ],
        deliverables: [
            {
                key: 'usecase_catalogue',
                title: 'Prioritized Use Case Catalogue',
                description: 'List of departments/functions, specific AI use cases for each, expected benefits (KPIs such as hours saved), and prerequisites.',
            },
            {
                key: 'roi_analysis',
                title: 'Business Case & ROI Analysis',
                description: 'An estimation of the productivity gains and ROI for the initial AI implementation.',
            },
            {
                key: 'adoption_roadmap_v2',
                title: 'Updated AI Adoption Roadmap',
                description: 'Outlines which use case or department will be piloted first, and a phased timeline for broader deployment.',
            },
        ],
    },
    {
        number: 3,
        title: 'Proof of Value Execution',
        color: 'orange',
        subtasks: [
            {
                key: 'pov_planning_setup',
                title: 'PoV Activity Planning & Setup',
                description: 'Define the scope: select 1–3 business units from top priority use cases. Define timeline and success criteria. Assign a PoV Lead and equip the group with necessary access.',
            },
            {
                key: 'pov_solution_design',
                title: 'PoV Solution Design',
                description: 'Finalize the AI solution design for the organization. Define required extensibility points and establish a governance framework for the PoV.',
            },
            {
                key: 'pov_execution',
                title: 'PoV Execution',
                description: 'Launch the Proof of Value and closely support the users. Provide training sessions for PoV participants. Help create and maintain a dedicated feedback channel.',
            },
            {
                key: 'pov_outcomes',
                title: 'Measure PoV Outcomes',
                description: 'Measure the PoV against success criteria. Track adoption metrics. Conduct a review meeting with key stakeholders to decide on proceeding to full deployment.',
            },
        ],
        deliverables: [
            {
                key: 'pov_results_report',
                title: 'PoV Results & Recommendations Report',
                description: 'A summary of PoV results including usage analytics, user feedback, and quantitative benefits realized.',
            },
            {
                key: 'solution_governance_plan',
                title: 'Refined Solution Design & Governance Plan',
                description: 'Updated technical architecture and governance approach refined by PoV insights.',
            },
            {
                key: 'gono_rollout_plan',
                title: 'Go/No-Go & Rollout Plan',
                description: 'Briefing for management team to decide on wider deployment with updated success metrics targets.',
            },
        ],
    },
    {
        number: 4,
        title: 'Deployment & Change Management',
        color: 'violet',
        subtasks: [
            {
                key: 'phased_rollout',
                title: 'Phased Rollout Execution',
                description: 'Ensure readiness criteria are met before roll out. Progressively roll out AI to the wider user base, starting with validated cohorts.',
            },
            {
                key: 'training_enablement',
                title: 'Training & Enablement',
                description: 'Role-based training workshops with real-world scenarios and prompt best practices. Empower AI Champions in departments and help build a user community.',
            },
            {
                key: 'adoption_monitoring',
                title: 'Adoption Monitoring',
                description: 'Monitor adoption metrics and system usage. Gather user feedback continuously via surveys, feedback forms, and periodic focus groups.',
            },
            {
                key: 'governance_rollout',
                title: 'Governance During Rollout',
                description: 'The governance committee actively oversees deployment. Ensure ongoing compliance by reviewing that AI outputs are appropriate and no policy violations occur.',
            },
        ],
        deliverables: [
            {
                key: 'rollout_checklist',
                title: 'Enterprise Rollout Completion & Checklist',
                description: 'A signed-off checklist confirming all deployment steps were executed (license assignment, feature enablement, integrations, etc.).',
            },
            {
                key: 'training_materials_repo',
                title: 'Adoption & Training Materials Repository',
                description: 'All training decks, demo recordings, user manuals, and communication artifacts.',
            },
            {
                key: 'adoption_status_report',
                title: 'Adoption Status Report',
                description: 'Post-rollout report including qualitative highlights of the rollout and key adoption stories.',
            },
        ],
    },
    {
        number: 5,
        title: 'Value Realization & Continuous Improvement',
        color: 'teal',
        subtasks: [
            {
                key: 'measure_business_outcomes',
                title: 'Measure Business Outcomes',
                description: 'Systematically measure the KPIs identified in earlier phases. Leverage AI Analytics to correlate usage with collaboration patterns and business impact.',
            },
            {
                key: 'user_feedback_satisfaction',
                title: 'User Feedback & Satisfaction',
                description: 'Continue gathering user feedback post-rollout via pulse surveys. Communicate internally ways to overcome pain points and share success stories.',
            },
            {
                key: 'continuous_improvement',
                title: 'Continuous Improvement Mechanisms',
                description: 'Establish a monthly or quarterly cadence for review and improvement sessions. Brainstorm and prioritize enhancement and improvement actions.',
            },
            {
                key: 'expansion_use_cases',
                title: 'Expansion of Use Cases',
                description: 'After initial success, expand AI footprint by enhancing rollout to teams not included in Phase 4, or creating enterprise-wide Agentic AI experiences.',
            },
        ],
        deliverables: [
            {
                key: 'value_realization_report',
                title: 'Value Realization Report',
                description: 'A comprehensive report comparing actual benefits achieved to the projected business case from Phase 2.',
            },
            {
                key: 'improvement_backlog',
                title: 'Continuous Improvement Backlog',
                description: 'A backlog of enhancement ideas and next steps, prioritized by impact and feasibility.',
            },
            {
                key: 'enterprise_agents_plan',
                title: 'Enterprise AI Agents Plan',
                description: 'Plan to implement custom agents to address critical processes where AI can enhance org-wide efficiencies.',
            },
        ],
    },
]

export function getPhase(number: number): PhaseDef | undefined {
    return METHODOLOGY.find(p => p.number === number)
}
