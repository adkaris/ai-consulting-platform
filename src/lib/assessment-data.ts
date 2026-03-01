export interface Question {
    id: string;
    text: string;
    description?: string;
    weight: 'Critical' | 'High' | 'Standard';
    scoringGuide?: Record<number, string>;
}

export interface Domain {
    id: string;
    name: string;
    description: string;
    weight: number;
    questions: Question[];
}

const WEIGHTS = {
    Critical: 3,
    High: 2,
    Standard: 1
};

export const assessmentData: Domain[] = [
    {
        id: 'Strategy',
        name: 'AI Strategy & Vision',
        description: 'Evaluates strategic intent, executive commitment, and alignment between AI ambitions and business goals.',
        weight: 1.5,
        questions: [
            { id: 'D1.Q1', text: 'Does the organisation have an identified executive sponsor who is actively championing the AI initiative?', weight: 'Critical', scoringGuide: { 1: 'No executive awareness — AI is entirely bottom-up', 3: 'Executive sponsor identified but engagement is passive', 5: 'Visible champion at executive level — communicates vision org-wide' } },
            { id: 'D1.Q2', text: 'How clearly is the AI initiative aligned to the organisation\'s broader business strategy?', weight: 'Critical', scoringGuide: { 1: 'No connection between AI and business strategy', 3: 'Some alignment documented but not formally approved', 5: 'AI strategy is a formal component of business strategy — board-level visibility' } },
            { id: 'D1.Q3', text: 'How well does the organisation understand where AI can create specific value in their context?', weight: 'High', scoringGuide: { 1: 'No awareness of specific AI use cases', 3: 'Use case hypotheses identified informally, not yet validated', 5: 'Validated, business-case-backed use cases with clear owners' } },
            { id: 'D1.Q4', text: 'Is the organisation aware of and committed to responsible, ethical AI practices?', weight: 'High', scoringGuide: { 1: 'No awareness of responsible AI', 3: 'Discussed at leadership level — informal principles exist', 5: 'Responsible AI framework in place with training and monitoring' } },
            { id: 'D1.Q5', text: 'Has the organisation formally committed budget and resources to the AI initiative?', weight: 'High', scoringGuide: { 1: 'No budget allocated — exploratory only', 3: 'Budget approved for current phase only', 5: 'Strategic AI investment programme — dedicated team, multi-year funding' } },
            { id: 'D1.Q6', text: 'Has the organisation previously attempted or delivered AI or automation initiatives?', weight: 'Standard', scoringGuide: { 1: 'No prior experience', 3: 'Small successful pilots', 5: 'AI operating at production scale' } }
        ]
    },
    {
        id: 'Data',
        name: 'Data Readiness & Governance',
        description: 'Evaluates data assets, quality, governance, and accessibility.',
        weight: 2.0,
        questions: [
            { id: 'D2.Q1', text: 'Does the organisation have access to the data required for the intended AI use cases?', weight: 'Critical', scoringGuide: { 1: 'Data needed does not exist/inaccessible', 3: 'Most data exists but requires consolidation', 5: 'Data centralised, well-catalogued, readily accessible' } },
            { id: 'D2.Q2', text: 'How would you rate the overall quality of the organisation\'s data — accuracy, completeness, consistency?', weight: 'Critical', scoringGuide: { 1: 'Highly inaccurate or inconsistent', 3: 'Inconsistent quality — good in some areas, poor in others', 5: 'Data quality actively measured and continuously improved' } },
            { id: 'D2.Q3', text: 'Does the organisation have formal data governance — ownership, policies, standards?', weight: 'High', scoringGuide: { 1: 'No data governance', 3: 'Governance initiative underway — roles defined', 5: 'Mature governance — active stewardship, quality KPIs' } },
            { id: 'D2.Q4', text: 'Has the organisation classified data by sensitivity and applied appropriate access controls?', weight: 'High', scoringGuide: { 1: 'No classification', 3: 'Classification scheme defined but inconsistently applied', 5: 'Full classification — automated controls, regular review cycles' } },
            { id: 'D2.Q5', text: 'How mature is the organisation\'s data architecture for AI data consumption?', weight: 'High', scoringGuide: { 1: 'Fully siloed systems', 3: 'Data platform exists but partially adopted', 5: 'Modern data platform with real-time capability' } },
            { id: 'D2.Q6', text: 'Does the organisation have sufficient volume and diversity of data for the intended AI use cases?', weight: 'High', scoringGuide: { 1: 'Data volumes too low or too narrow', 3: 'Adequate for initial pilots but not production-scale', 5: 'Rich, diverse, high-volume datasets' } },
            { id: 'D2.Q7', text: 'Is the organisation managing data privacy obligations in the AI context (GDPR, etc.)?', weight: 'Critical', scoringGuide: { 1: 'No awareness of AI privacy obligations', 3: 'Privacy review underway', 5: 'Privacy-by-design embedded in AI development' } }
        ]
    },
    {
        id: 'Tech',
        name: 'Technology & Infrastructure',
        description: 'Evaluates cloud readiness, integration capability, and infrastructure capacity.',
        weight: 1.5,
        questions: [
            { id: 'D3.Q1', text: 'How mature is the organisation\'s cloud adoption overall?', weight: 'High', scoringGuide: { 1: 'On-premise only', 3: 'Partial migration underway', 5: 'Cloud-native — fully optimised, elastic' } },
            { id: 'D3.Q2', text: 'How complex and fragmented is the application landscape relative to integrating AI?', weight: 'Standard', scoringGuide: { 1: 'Extremely fragmented legacy landscape', 3: 'Moderate — mix of modern and legacy', 5: 'Clean landscape — modern APIs, low legacy debt' } },
            { id: 'D3.Q3', text: 'Does the organisation have the capability to integrate AI solutions with its existing systems?', weight: 'High', scoringGuide: { 1: 'No API capability', 3: 'Moderate — integration platform exists but inconsistent', 5: 'Event-driven architecture with governed API layer' } },
            { id: 'D3.Q4', text: 'Can the current infrastructure scale to support AI workloads — compute, storage, networking?', weight: 'High', scoringGuide: { 1: 'Significant investment required', 3: 'Supports pilots but needs upgrades for scale', 5: 'Elastic and scalable — absorbs AI on demand' } },
            { id: 'D3.Q5', text: 'Does the organisation have DevOps or MLOps practices to support AI deployment?', weight: 'Standard', scoringGuide: { 1: 'No DevOps — manual deployments', 3: 'DevOps established; MLOps being explored', 5: 'Full MLOps maturity — automated retraining and drift detection' } },
            { id: 'D3.Q6', text: 'Does the organisation have monitoring and observability capabilities extensible to AI systems?', weight: 'Standard', scoringGuide: { 1: 'No monitoring', 3: 'Application monitoring in place for traditional systems', 5: 'Comprehensive observability across AI model behaviour' } }
        ]
    },
    {
        id: 'Security',
        name: 'Security & Compliance',
        description: 'Security posture and compliance readiness for AI.',
        weight: 1.5,
        questions: [
            { id: 'D4.Q1', text: 'How would you rate the organisation\'s overall cybersecurity maturity?', weight: 'High', scoringGuide: { 1: 'Minimal controls — no formal programme', 3: 'Developing programme — gaps remain', 5: 'Advanced — Zero Trust, continuous monitoring' } },
            { id: 'D4.Q2', text: 'How mature is the organisation\'s Identity & Access Management for AI systems and data?', weight: 'High', scoringGuide: { 1: 'No formal IAM', 3: 'MFA and RBAC partially implemented', 5: 'Full IAM maturity — SSO, PAM, least-privilege' } },
            { id: 'D4.Q3', text: 'Is the organisation managing compliance with AI-relevant regulations?', weight: 'Critical', scoringGuide: { 1: 'No awareness of AI regulations', 3: 'Regulatory impact assessment in progress', 5: 'Proactive compliance — monitoring emerging regulations' } },
            { id: 'D4.Q4', text: 'Are appropriate controls in place to protect data used in AI systems?', weight: 'Critical', scoringGuide: { 1: 'No specifically protected data for AI', 3: 'Controls applied inconsistently', 5: 'Advanced — tokenisation, masking for training' } },
            { id: 'D4.Q5', text: 'Does the organisation assess risks from AI vendors and third-party services?', weight: 'High', scoringGuide: { 1: 'No vendor risk assessment process', 3: 'Process exists but not AI-specific', 5: 'AI vendors assessed as part of procurement' } }
        ]
    },
    {
        id: 'Skills',
        name: 'AI Skills & Talent',
        description: 'Human skills needed to implement, operate, and improve AI solutions.',
        weight: 1.5,
        questions: [
            { id: 'D5.Q1', text: 'How would you rate the general AI literacy of the workforce?', weight: 'High', scoringGuide: { 1: 'Very low — no meaningful understanding', 3: 'AI-literate employees exist in pockets', 5: 'High literacy org-wide with champions network' } },
            { id: 'D5.Q2', text: 'Does the organisation have internal technical talent to implement AI solutions?', weight: 'High', scoringGuide: { 1: 'Fully dependent on external parties', 3: 'Small internal team with constrained capacity', 5: 'AI Centre of Excellence with diverse lifecycle skills' } },
            { id: 'D5.Q3', text: 'Does the organisation have data engineering skills to prepare and manage AI data?', weight: 'High', scoringGuide: { 1: 'No data engineering capability', 3: 'Some capability but insufficient for production scale', 5: 'Advanced — real-time pipelines, feature stores' } },
            { id: 'D5.Q4', text: 'Does the organisation have internal capability to manage change and drive adoption?', weight: 'High', scoringGuide: { 1: 'No change management capability', 3: 'Practice exists but not consistently applied', 5: 'Proven record of large-scale technology adoption' } },
            { id: 'D5.Q5', text: 'Is the organisation aware of its AI skills gaps and actively addressing them?', weight: 'Standard', scoringGuide: { 1: 'No awareness of gaps', 3: 'Gaps known — training plan in development', 5: 'Active programme — learning metrics tracked' } }
        ]
    },
    {
        id: 'Ops',
        name: 'Organisational Readiness',
        description: 'Human and cultural factors — readiness to change, adopt, and sustain AI.',
        weight: 1.5,
        questions: [
            { id: 'D6.Q1', text: 'How capable is the organisation of managing significant change to processes?', weight: 'Critical', scoringGuide: { 1: 'Change is actively resisted', 3: 'Mixed results from past initiatives', 5: 'Change is a core competency — high engagement' } },
            { id: 'D6.Q2', text: 'Are key stakeholders aligned on the need for and direction of the AI initiative?', weight: 'Critical', scoringGuide: { 1: 'Significant disagreement or disengagement', 3: 'Senior alignment, but middle management not engaged', 5: 'Full alignment — active participation at all levels' } },
            { id: 'D6.Q3', text: 'What is the general attitude of employees towards AI adoption?', weight: 'High', scoringGuide: { 1: 'Strong resistance / fear of job loss', 3: 'Neutral or open but not engaged', 5: 'Enthusiastic — actively sharing use case ideas' } },
            { id: 'D6.Q4', text: 'How well are the business processes that AI will impact documented?', weight: 'Standard', scoringGuide: { 1: 'Undocumented — tacit knowledge only', 3: 'Key processes documented but incomplete', 5: 'Comprehensive, up-to-date documentation' } },
            { id: 'D6.Q5', text: 'Does the organisation collaborate effectively across departments?', weight: 'Standard', scoringGuide: { 1: 'Strong silos — cross-functional work rare', 3: 'Collaboration exists but requires high effort', 5: 'Cross-functional teams are the norm' } },
            { id: 'D6.Q6', text: 'Does leadership actively and clearly communicate the AI vision?', weight: 'High', scoringGuide: { 1: 'No leadership communication', 3: 'AI communicated periodically', 5: 'Inspiring vision embedded in culture' } }
        ]
    },
    {
        id: 'Governance',
        name: 'AI Governance & Ethics',
        description: 'Governance structures, ethical practices, and risk management.',
        weight: 1.0,
        questions: [
            { id: 'D7.Q1', text: 'Does the organisation have a governance structure for AI oversight?', weight: 'Critical', scoringGuide: { 1: 'No AI governance', 3: 'Structure being established', 5: 'Mature framework — board-level reporting' } },
            { id: 'D7.Q2', text: 'Are responsible AI principles and policies formally defined?', weight: 'High', scoringGuide: { 1: 'No responsible AI policies', 3: 'Principles drafted but not yet approved', 5: 'Fairness and transparency embedded in development' } },
            { id: 'D7.Q3', text: 'Does the organisation assess and manage risks specifically related to AI?', weight: 'High', scoringGuide: { 1: 'No AI-specific risk management', 3: 'Assessment process being developed', 5: 'Continuous risk monitoring and automated review' } },
            { id: 'D7.Q4', text: 'Does the organisation require and support explainability of AI model decisions?', weight: 'High', scoringGuide: { 1: 'Explainability not considered', 3: 'Requirements defined for some use cases', 5: 'Explainability is a core design requirement' } },
            { id: 'D7.Q5', text: 'Is the organisation actively managing the risk of bias in AI outputs?', weight: 'High', scoringGuide: { 1: 'No awareness of bias risk', 3: 'Initial bias reviews started', 5: 'Diverse data and continuous bias monitoring' } }
        ]
    },
    {
        id: 'Financial',
        name: 'Financial & Operational Readiness',
        description: 'Financial commitment, support models, and success measurement.',
        weight: 1.0,
        questions: [
            { id: 'D8.Q1', text: 'Has the organisation formally allocated budget for the AI initiative?', weight: 'High', scoringGuide: { 1: 'No budget', 3: 'Budget for current phase only', 5: 'Strategic multi-year investment programme' } },
            { id: 'D8.Q2', text: 'Has the organisation defined clear, measurable success criteria for AI?', weight: 'Critical', scoringGuide: { 1: 'No success metrics defined', 3: 'Some KPIs identified but not baselined', 5: 'Comprehensive measurement framework' } },
            { id: 'D8.Q3', text: 'Is there a plan for how AI systems will be supported after deployment?', weight: 'High', scoringGuide: { 1: 'No post-deployment plan', 3: 'Support model being designed', 5: 'Monitoring and incident response model defined' } },
            { id: 'D8.Q4', text: 'Does the organisation manage AI vendors and implementation partners effectively?', weight: 'Standard', scoringGuide: { 1: 'No vendor management capability', 3: 'Vendor management exists but not AI-specific', 5: 'Strategic partner management and SLAs in place' } },
            { id: 'D8.Q5', text: 'Is the organisation prepared to manage ongoing operational costs (FinOps)?', weight: 'Standard', scoringGuide: { 1: 'No awareness of AI cost structures', 3: 'Basic cost awareness', 5: 'Full AI FinOps — attribution and optimisation' } }
        ]
    }
];

export function calculateWeightedScore(domain: Domain, scores: Record<string, number>): number {
    let totalWeight = 0;
    let weightedSum = 0;

    domain.questions.forEach(q => {
        const weight = WEIGHTS[q.weight];
        const score = scores[q.id] || 0;
        weightedSum += (score * weight);
        totalWeight += weight;
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

