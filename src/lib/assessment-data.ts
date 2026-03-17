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
            { 
                id: 'D1.Q1', 
                text: 'How is the AI initiative currently championed at the executive level?', 
                weight: 'Critical', 
                scoringGuide: { 
                    1: 'There is no executive awareness. Any AI activity is siloed and bottom-up.', 
                    2: 'An executive sponsor is identified, but engagement is largely passive or reactive.',
                    4: 'There is active leadership backing, but it has not been fully communicated org-wide.',
                    5: 'We have a highly visible executive champion who actively communicates the AI vision across the entire organisation.' 
                } 
            },
            { 
                id: 'D1.Q2', 
                text: 'How closely is your AI ambition aligned with the broader corporate business strategy?', 
                weight: 'Critical', 
                scoringGuide: { 
                    1: 'There is absolutely no connection between AI efforts and our core business strategy.', 
                    2: 'Some alignment is documented theoretically, but it lacks formal board-level approval.', 
                    4: 'AI is a recognised enabler of our strategy, with specific, targeted goals.',
                    5: 'The AI strategy is a formal, integral component of our corporate business strategy with full board-level visibility.' 
                } 
            },
            { 
                id: 'D1.Q3', 
                text: 'How well does the organisation understand where AI can create tangible value?', 
                weight: 'High', 
                scoringGuide: { 
                    1: 'We have no awareness of specific, viable AI use cases in our context.', 
                    2: 'We have brainstormed some use case hypotheses, but they remain informal and unvalidated.', 
                    4: 'We have identified specific use cases, but they lack rigorous business casing or clear ownership.',
                    5: 'We have a prioritised portfolio of validated, business-case-backed use cases with clear executive owners.' 
                } 
            },
            { 
                id: 'D1.Q4', 
                text: 'How is the organisation approaching responsible and ethical AI practices?', 
                weight: 'High', 
                scoringGuide: { 
                    1: 'We have no awareness or discussion of responsible AI practices.', 
                    2: 'It has been discussed at the leadership level, and some informal principles exist.', 
                    4: 'We have drafted a formal responsible AI framework, but adoption is still rolling out.',
                    5: 'A rigorous responsible AI framework is deeply embedded, complete with mandatory employee training and monitoring.' 
                } 
            },
            { 
                id: 'D1.Q5', 
                text: 'What is the current state of financial and resource commitment to AI?', 
                weight: 'High', 
                scoringGuide: { 
                    1: 'There is no budget allocated. All efforts are strictly exploratory or unfunded.', 
                    2: 'Budget has been approved on an ad-hoc basis for a single current pilot or phase.', 
                    4: 'We have dedicated annual funding for specific, approved AI projects.',
                    5: 'We have a strategic, multi-year AI investment programme with dedicated teams and sustained funding.' 
                } 
            },
            { 
                id: 'D1.Q6', 
                text: 'What is your organisation\'s track record with delivering AI or advanced automation?', 
                weight: 'Standard', 
                scoringGuide: { 
                    1: 'We have no prior experience delivering these types of initiatives.', 
                    2: 'We have successfully delivered one or two small, ring-fenced pilots.', 
                    4: 'We have deployed a few models into production, though scaling remains a challenge.',
                    5: 'We are successfully operating multiple diverse AI applications at full production scale.' 
                } 
            }
        ]
    },
    {
        id: 'Data',
        name: 'Data Readiness & Governance',
        description: 'Evaluates data assets, quality, governance, and accessibility.',
        weight: 2.0,
        questions: [
            { id: 'D2.Q1', text: 'How accessible is the data required to power your intended AI use cases?', weight: 'Critical', scoringGuide: { 1: 'The data we need either does not exist or is completely inaccessible.', 2: 'Most of the necessary data exists, but it requires heavy manual consolidation.', 4: 'Data is generally accessible, though some silos still remain.', 5: 'Data is fully centralised, well-catalogued, and readily accessible via automated pipelines.' } },
            { id: 'D2.Q2', text: 'How would you rate the overall quality (accuracy, completeness, consistency) of your data?', weight: 'Critical', scoringGuide: { 1: 'Our data is highly inaccurate, fragmented, or fundamentally inconsistent.', 2: 'Quality is inconsistent—acceptable in some departments, poor in others.', 4: 'Data quality is generally good, with cleanup processes running reactively.', 5: 'Data quality is actively managed, continuously measured, and proactively improved.' } },
            { id: 'D2.Q3', text: 'What is the state of formal data governance (ownership, policies, standards) in the organisation?', weight: 'High', scoringGuide: { 1: 'There is no formal data governance in place.', 2: 'A governance initiative is underway, and high-level roles have been defined.', 4: 'Governance policies are formalised, but enforcement is occasionally inconsistent.', 5: 'Highly mature governance is embedded, featuring active data stewardship and strict quality KPIs.' } },
            { id: 'D2.Q4', text: 'How does the organisation handle data classification and access controls?', weight: 'High', scoringGuide: { 1: 'We do not have a formal data classification scheme.', 2: 'A classification scheme exists on paper, but it is inconsistently applied technically.', 4: 'Most critical data is classified with appropriate role-based access controls.', 5: 'Full classification is automated, driving strict access controls with regular review cycles.' } },
            { id: 'D2.Q5', text: 'How mature is the organisation\'s underlying data architecture for AI consumption?', weight: 'High', scoringGuide: { 1: 'Our systems are fully siloed legacy applications.', 2: 'A central data platform (warehouse/lake) exists but is only partially adopted.', 4: 'We have a robust cloud data platform that serves analytical workloads well.', 5: 'We operate a modern, scalable data platform with robust real-time streaming capabilities.' } },
            { id: 'D2.Q6', text: 'Do you possess the sufficient volume and diversity of data required to train/fine-tune AI models?', weight: 'High', scoringGuide: { 1: 'Our data volumes are far too low or too narrow in scope.', 2: 'We have adequate data for limited initial pilots, but not enough for production-scale model training.', 4: 'We have strong volumes of historical data, though external enrichment may be needed.', 5: 'We maintain highly rich, diverse, and high-volume datasets capable of powering advanced AI.' } },
            { id: 'D2.Q7', text: 'How is the organisation managing distinct data privacy obligations (e.g., GDPR) within the AI context?', weight: 'Critical', scoringGuide: { 1: 'There is virtually no awareness of AI-specific privacy obligations.', 2: 'A formal privacy review for our AI tooling is currently underway.', 4: 'Basic privacy guidelines are applied, and major compliance checks are enforced.', 5: 'Privacy-by-design is deeply embedded directly into our AI development lifecycle.' } }
        ]
    },
    {
        id: 'Tech',
        name: 'Technology & Infrastructure',
        description: 'Evaluates cloud readiness, integration capability, and infrastructure capacity.',
        weight: 1.5,
        questions: [
            { id: 'D3.Q1', text: 'How would you classify the organisation\'s overall cloud adoption maturity?', weight: 'High', scoringGuide: { 1: 'We are entirely reliant on traditional, on-premise infrastructure.', 2: 'We are in the early stages; partial migration is underway.', 4: 'We are predominantly cloud-based, but not fully optimised.', 5: 'We are a cloud-native organisation operating highly optimised, elastic infrastructure.' } },
            { id: 'D3.Q2', text: 'How complex is your application landscape regarding the integration of new AI capabilities?', weight: 'Standard', scoringGuide: { 1: 'Extremely fragmented legacy landscape that acts as a blocker to integration.', 2: 'A moderate mix of modern systems and tightly-coupled legacy debt.', 4: 'Mostly modernened systems with only a few isolated legacy bottlenecks.', 5: 'A highly clean landscape featuring modern APIs and virtually no legacy debt.' } },
            { id: 'D3.Q3', text: 'Can the organisation programmatically integrate AI solutions with existing internal systems via APIs?', weight: 'High', scoringGuide: { 1: 'We have almost no API exposure or integration capability.', 2: 'An integration platform exists, but API coverage is sparse and inconsistent.', 4: 'We have a solid API gateway and most core systems are accessible.', 5: 'We utilize a sophisticated event-driven architecture supported by a strictly governed API layer.' } },
            { id: 'D3.Q4', text: 'Can the current infrastructure rapidly scale compute and storage to support intensive AI workloads?', weight: 'High', scoringGuide: { 1: 'No—significant capital investment and time would be required.', 2: 'It can support temporary pilots, but requires manual upgrades for production scale.', 4: 'Scaling is possible and mostly automated, though cost caps restrict elasticity.', 5: 'Completely elastic and scalable infrastructure that dynamically absorbs AI workloads on demand.' } },
            { id: 'D3.Q5', text: 'Does the organisation have established DevOps or MLOps practices?', weight: 'Standard', scoringGuide: { 1: 'We do not practice DevOps; deployments are highly manual processes.', 2: 'Standard DevOps is established, but moving models to production (MLOps) is experimental.', 4: 'MLOps pipelines are built, but retraining requires manual intervention.', 5: 'We boast full MLOps maturity, including automated retraining and proactive drift detection.' } },
            { id: 'D3.Q6', text: 'How extensible are your monitoring capabilities regarding AI system behaviour and outputs?', weight: 'Standard', scoringGuide: { 1: 'We currently lack comprehensive system monitoring.', 2: 'Basic application monitoring is in place for traditional systems only.', 4: 'We can monitor basic AI uptime and latency, but not model outcomes.', 5: 'We possess comprehensive observability that continuously tracks model behaviour, drift, and accuracy.' } }
        ]
    },
    {
        id: 'Security',
        name: 'Security & Compliance',
        description: 'Security posture and compliance readiness for AI.',
        weight: 1.5,
        questions: [
            { id: 'D4.Q1', text: 'How would you rate the organisation\'s overarching cybersecurity maturity?', weight: 'High', scoringGuide: { 1: 'Minimal controls exist with no formal, managed security programme.', 2: 'A formal programme is developing, but significant security gaps remain.', 4: 'Solid perimeter and endpoint security are enforced universally.', 5: 'Advanced maturity featuring a Zero Trust architecture and continuous aggressive monitoring.' } },
            { id: 'D4.Q2', text: 'How mature is Identity & Access Management (IAM), particularly regarding system-to-model data access?', weight: 'High', scoringGuide: { 1: 'There is no formal or centralized IAM strategy.', 2: 'MFA and RBAC are partially implemented across some newer systems.', 4: 'Centralized SSO and RBAC are standard across the enterprise.', 5: 'Full IAM maturity including automated provisioning, PAM, and strict least-privilege enforcement.' } },
            { id: 'D4.Q3', text: 'How is the organisation handling compliance with rapidly emerging AI-specific regulations?', weight: 'Critical', scoringGuide: { 1: 'We have no awareness or dedicated focus on AI-specific regulations.', 2: 'A regulatory impact assessment is currently in progress.', 4: 'We map new projects against an established compliance checklist.', 5: 'We employ proactive, continuous compliance monitoring and help shape emerging industry standards.' } },
            { id: 'D4.Q4', text: 'Are appropriate technological controls in place to protect sensitive data ingested by AI systems?', weight: 'Critical', scoringGuide: { 1: 'We do not differentiate or protect data specifically for AI usage.', 2: 'Controls are applied occasionally but are highly inconsistent and manual.', 4: 'Most PII and sensitive data is restricted before hitting AI models.', 5: 'Advanced continuous controls are deployed, including automated tokenisation and masking for model training.' } },
            { id: 'D4.Q5', text: 'How rigorously do you assess the risks introduced by external AI vendors or third-party ML services?', weight: 'High', scoringGuide: { 1: 'There is no formal vendor risk assessment process.', 2: 'A generic vendor process exists, but it does not account for AI-specific risks (e.g., data residency).', 4: 'AI vendors undergo a targeted technical security assessment.', 5: 'AI vendors are subjected to rigorous, continuous assessments deeply integrated into the procurement lifecycle.' } }
        ]
    },
    {
        id: 'Skills',
        name: 'AI Skills & Talent',
        description: 'Human skills needed to implement, operate, and improve AI solutions.',
        weight: 1.5,
        questions: [
            { id: 'D5.Q1', text: 'What is the general level of AI literacy across the broader workforce?', weight: 'High', scoringGuide: { 1: 'Very low—most employees have no meaningful understanding of AI capabilities.', 2: 'AI-literate employees exist in isolated pockets or specific technical teams.', 4: 'A baseline understanding exists broadly across most departments.', 5: 'High AI literacy is woven org-wide, supported by an active grassroots champions network.' } },
            { id: 'D5.Q2', text: 'Does the organisation have the internal technical talent required to actively build and implement AI solutions?', weight: 'High', scoringGuide: { 1: 'We are completely dependent on external consultants or vendors.', 2: 'We have a very small internal team with severely constrained delivery capacity.', 4: 'We have a capable technical team, though they still require specialized external augmentation.', 5: 'We host a formidable AI Centre of Excellence possessing diverse, full-lifecycle ML skills.' } },
            { id: 'D5.Q3', text: 'Do you possess the necessary Data Engineering skills to prepare and continuously manage AI data pipelines?', weight: 'High', scoringGuide: { 1: 'We have zero dedicated data engineering capability.', 2: 'We have some capability, but it is entirely insufficient to support scalable production workloads.', 4: 'We have a reliable data engineering team adept at managing batch processing.', 5: 'We boast advanced data engineering talent capable of maintaining real-time pipelines and feature stores.' } },
            { id: 'D5.Q4', text: 'Does the organisation have a dedicated internal capability to manage change and drive end-user software adoption?', weight: 'High', scoringGuide: { 1: 'We do not have a recognized change management capability.', 2: 'A change management practice exists on paper, but it is rarely utilized effectively.', 4: 'We employ dedicated change managers for top-tier transformational projects.', 5: 'We have a highly proven, deeply embedded framework capable of driving large-scale technology adoption.' } },
            { id: 'D5.Q5', text: 'Is the organisation acutely aware of its AI skills gaps and taking action to address them?', weight: 'Standard', scoringGuide: { 1: 'There is no formalized awareness of our internal skills gaps.', 2: 'The gaps are known, and a fragmented training plan is slowly taking shape.', 4: 'We have active upskilling initiatives running across targeted departments.', 5: 'We run a continuous, active learning programme where employee capability metrics are meticulously tracked.' } }
        ]
    },
    {
        id: 'Ops',
        name: 'Organisational Readiness',
        description: 'Human and cultural factors — readiness to change, adopt, and sustain AI.',
        weight: 1.5,
        questions: [
            { id: 'D6.Q1', text: 'Historically, how capable is the organisation at absorbing and managing significant process change?', weight: 'Critical', scoringGuide: { 1: 'Change is historically actively resisted, resulting in failed deployments.', 2: 'We have seen mixed, inconsistent results from past transformational initiatives.', 4: 'Most major rollouts succeed, though they often require heavier-than-expected effort.', 5: 'Driving change is a recognized core competency that boasts universally high employee engagement.' } },
            { id: 'D6.Q2', text: 'Are all key stakeholders aligned on the strategic necessity and direction of the AI initiative?', weight: 'Critical', scoringGuide: { 1: 'There is significant overarching disagreement or complete disengagement from leadership.', 2: 'Senior leadership is aligned, but critical middle management remains highly skeptical.', 4: 'There is broad alignment, with only minor resistance in a few isolated groups.', 5: 'Complete alignment has been achieved, resulting in active, enthusiastic participation at all operational levels.' } },
            { id: 'D6.Q3', text: 'What is the most accurate description of the general employee attitude towards AI adoption?', weight: 'High', scoringGuide: { 1: 'There is strong, vocal resistance and widespread fear regarding job replacement.', 2: 'The mood is mostly neutral or cautiously open, but engagement is passive.', 4: 'Employees are optimistic and are beginning to interact with early AI tools.', 5: 'The workforce is enthusiastic—actively seeking out AI training and submitting novel use case ideas.' } },
            { id: 'D6.Q4', text: 'To what degree are the business processes that AI will eventually impact currently documented?', weight: 'Standard', scoringGuide: { 1: 'They are completely undocumented, relying exclusively on legacy tacit knowledge.', 2: 'Some key overarching processes are documented, but step-by-step specifics are missing.', 4: 'Most processes are well documented, requiring only minor updates before AI injection.', 5: 'The business operates on comprehensive, up-to-date process maps that are continuously refined.' } },
            { id: 'D6.Q5', text: 'How effectively does the organisation collaborate across distinct departmental boundaries?', weight: 'Standard', scoringGuide: { 1: 'The organisation operates in rigid silos; cross-functional cooperation is exceptionally rare.', 2: 'Collaboration happens, but it requires highly unusual, exhausting effort to orchestrate.', 4: 'Cross-functional projects exist and generally succeed with proper sponsorship.', 5: 'Fluid, cross-functional, multi-disciplinary teams are the absolute operational norm.' } },
            { id: 'D6.Q6', text: 'Does executive leadership actively and clearly communicate the overarching vision for AI?', weight: 'High', scoringGuide: { 1: 'There is virtually zero leadership communication regarding AI.', 2: 'AI is mentioned periodically in broad town halls, but lacks actionable specifics.', 4: 'Leadership provides consistent updates on AI progress and strategic direction.', 5: 'An inspiring, coherent vision for AI is deeply and continuously embedded into company culture.' } }
        ]
    },
    {
        id: 'Governance',
        name: 'AI Governance & Ethics',
        description: 'Governance structures, ethical practices, and risk management.',
        weight: 1.0,
        questions: [
            { id: 'D7.Q1', text: 'Does the organisation have a formalized governance structure dictating AI oversight?', weight: 'Critical', scoringGuide: { 1: 'There is no AI governance structure whatsoever.', 2: 'A rudimentary oversight structure is barely beginning to be established.', 4: 'A governance council exists and actively reviews high-risk AI models.', 5: 'A highly mature, formalized framework exists that mandates direct board-level reporting on AI impact.' } },
            { id: 'D7.Q2', text: 'Are responsible AI principles (fairness, transparency) formally defined and strictly enforced policies?', weight: 'High', scoringGuide: { 1: 'There are no responsible AI policies in existence.', 2: 'Some ethical principles have been drafted, but they are not yet officially approved or enforced.', 4: 'Policies are formally launched and heavily influence our major AI designs.', 5: 'Strict fairness and transparency checks are programmatically embedded directly into our development lifecycle.' } },
            { id: 'D7.Q3', text: 'How does the organisation assess and mitigate risks that are uniquely introduced by AI components?', weight: 'High', scoringGuide: { 1: 'There is absolutely no AI-specific risk management process in place.', 2: 'A rudimentary assessment framework is currently being brainstormed.', 4: 'AI models undergo a targeted risk review prior to receiving deployment approval.', 5: 'We utilize continuous, automated risk monitoring and mandate periodic model review cycles.' } },
            { id: 'D7.Q4', text: 'Does the organisation explicitly require explainability for its critical AI model decisions?', weight: 'High', scoringGuide: { 1: 'Explainability is not considered; models are viewed as black boxes.', 2: 'Explainability requirements are defined loosely, but only for a handful of targeted use cases.', 4: 'Explainability is required for all models that directly impact human outcomes.', 5: 'Deep explainability is a stringent, core design requirement for all AI deployments org-wide.' } },
            { id: 'D7.Q5', text: 'Is the organisation actively hunting for and mitigating the risk of bias within AI outputs?', weight: 'High', scoringGuide: { 1: 'There is zero formalized awareness or tracking of inherent bias risks.', 2: 'Initial manual bias reviews have commenced on our most visible models.', 4: 'Data bias is assessed during the training phase, though post-deployment checks are manual.', 5: 'We enforce stringent dataset diversity checks and mandate continuous algorithmic bias monitoring.' } }
        ]
    },
    {
        id: 'Financial',
        name: 'Financial & Operational Readiness',
        description: 'Financial commitment, support models, and success measurement.',
        weight: 1.0,
        questions: [
            { id: 'D8.Q1', text: 'Has the organisation formally ring-fenced financial budget specifically for the broader AI initiative?', weight: 'High', scoringGuide: { 1: 'There is no dedicated AI budget available.', 2: 'Budget has been reluctantly approved to cover the costs of the current exploratory phase only.', 4: 'We have secured a substantial annual budget designated solely for driving AI adoption.', 5: 'We are executing against a deeply strategic, multi-year, heavily-funded AI investment programme.' } },
            { id: 'D8.Q2', text: 'Has the organisation defined crystal-clear, measurable success criteria (KPIs) for evaluating AI impact?', weight: 'Critical', scoringGuide: { 1: 'No success metrics or targets have been defined at all.', 2: 'Some high-level KPIs have been identified, but they lack concrete baseline measurements.', 4: 'Robust success criteria are defined and actively tracked for all live AI projects.', 5: 'We operate a comprehensive measurement framework that rigorously attributes exact financial ROI to AI components.' } },
            { id: 'D8.Q3', text: 'Is there a solidified plan covering how live AI systems will be supported and maintained post-deployment?', weight: 'High', scoringGuide: { 1: 'There is no post-deployment plan; models are deployed and functionally orphaned.', 2: 'A support model is actively being designed but no resources are committed.', 4: 'We have an L1/L2 support structure ready to handle AI-related operational tickets.', 5: 'A sophisticated monitoring, model-drift handling, and rapid incident response model is fully established.' } },
            { id: 'D8.Q4', text: 'Does the organisation fiercely and effectively manage external AI vendors and specialized implementation partners?', weight: 'Standard', scoringGuide: { 1: 'We lack any vendor management capability.', 2: 'Vendor management exists, but it fundamentally treats AI services the same as basic software procurement.', 4: 'We actively manage our specialized AI partners against specific delivery milestones.', 5: 'Strategic AI partner management is highly mature with aggressively enforced SLAs and shared-risk models.' } },
            { id: 'D8.Q5', text: 'Is the organisation functionally prepared to track, manage, and optimize ongoing AI operational infrastructure costs (FinOps)?', weight: 'Standard', scoringGuide: { 1: 'There is no functional awareness of how AI cost structures scale.', 2: 'We have a basic awareness of costs but lack any ability to forecast spikes.', 4: 'Cloud and API costs are actively monitored to avoid bill shocks.', 5: 'We demonstrate full AI FinOps maturity, featuring granular cost-attribution to business units and automated optimisation.' } }
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
