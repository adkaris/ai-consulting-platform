/**
 * Microsoft Copilot Readiness Assessment — Question Bank
 * Completely separate from the General AI assessment.
 * 8 Copilot-specific domains, ~40 questions, full 1–5 scoring guides.
 */

export interface CopilotQuestion {
    id: string
    text: string
    weight: 'Critical' | 'High' | 'Standard'
    scoringGuide: Record<number, string>
}

export interface CopilotDomain {
    id: string           // matches CopilotAssessment score field key
    name: string
    description: string
    weight: number
    icon: string
    questions: CopilotQuestion[]
}

// Maps DB domain name → CopilotAssessment field key
export const COPILOT_NAME_TO_SCORE_KEY: Record<string, string> = {
    'Copilot Strategy & Vision':            'Strategy',
    'Microsoft 365 Foundation':             'M365',
    'Content & Data Governance':            'Content',
    'Security & Compliance Readiness':      'Security',
    'Identity & Access Management':         'Identity',
    'User Adoption & Change Management':    'Adoption',
    'Use Case Identification & Value':      'UseCases',
    'Copilot Governance & Acceptable Use':  'Governance',
}

export const copilotAssessmentData: CopilotDomain[] = [

    // ── CP1: Copilot Strategy & Vision ────────────────────────────────────────
    {
        id: 'Strategy',
        name: 'Copilot Strategy & Vision',
        description: 'Evaluates executive sponsorship, business case clarity, and the strategic alignment of the Microsoft Copilot rollout.',
        weight: 1.5,
        icon: '🎯',
        questions: [
            {
                id: 'CP1.Q1',
                text: 'Is there an identified executive sponsor actively driving the Microsoft Copilot deployment?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'There is no executive sponsor. The Copilot interest is entirely bottom-up or IT-driven without leadership backing.',
                    2: 'A sponsor has been loosely identified, but their involvement is occasional and primarily informational.',
                    3: 'An executive sponsor is confirmed and attends key reviews, but their active communication to the organisation is limited.',
                    4: 'The executive sponsor is actively involved, attends steering meetings, removes blockers, and endorses the programme internally.',
                    5: 'A highly visible C-level champion owns the Copilot programme, communicates the vision org-wide, and is directly accountable for outcomes.',
                },
            },
            {
                id: 'CP1.Q2',
                text: 'Is the Copilot rollout tied to specific, measurable business outcomes with defined KPIs?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'No business outcomes or KPIs have been defined. The rollout is driven by licence availability alone.',
                    2: 'Outcomes are described in general terms (e.g., "improve productivity") but are not quantified or baselined.',
                    3: 'Some outcome areas are identified and partially quantified, but ownership and measurement methods are not confirmed.',
                    4: 'Business outcomes are clearly defined with baseline metrics and target improvements, linked to specific use cases.',
                    5: 'A full value realisation framework is in place — quantified targets, measurement approach, review cadence, and executive dashboard.',
                },
            },
            {
                id: 'CP1.Q3',
                text: 'Has the organisation defined a Copilot rollout roadmap with clear deployment phases and milestones?',
                weight: 'High',
                scoringGuide: {
                    1: 'No rollout plan exists. The approach to deployment has not been defined.',
                    2: 'A rough timeline exists but without phasing, milestones, or ownership.',
                    3: 'A phased plan has been drafted covering pilot → departmental → broad rollout, but detail is incomplete.',
                    4: 'A structured roadmap is defined with phases, milestones, success criteria, and named owners for each phase.',
                    5: 'A fully approved, board-level roadmap is in place with integrated change management, risk management, and quarterly review gates.',
                },
            },
            {
                id: 'CP1.Q4',
                text: 'Is the Copilot investment aligned with the organisation\'s broader Microsoft 365 and digital workplace strategy?',
                weight: 'High',
                scoringGuide: {
                    1: 'Copilot is being evaluated in isolation with no connection to the M365 strategy or roadmap.',
                    2: 'There is awareness of the connection to M365 but it has not been formally explored or documented.',
                    3: 'The relationship to M365 strategy is acknowledged and informally considered in planning.',
                    4: 'Copilot is explicitly positioned within the M365 roadmap with dependencies and sequencing documented.',
                    5: 'Copilot is a central pillar of the Digital Workplace strategy — fully integrated with M365 governance, licencing and adoption plans.',
                },
            },
            {
                id: 'CP1.Q5',
                text: 'Has the organisation secured budget and resources specifically for the Copilot programme — licences, change management, and training?',
                weight: 'High',
                scoringGuide: {
                    1: 'No budget has been allocated. The programme depends on discretionary spend or has no funding.',
                    2: 'Licence costs are approved but no budget exists for change management, training, or programme management.',
                    3: 'A budget is approved for the initial pilot but future phases are unfunded and unplanned.',
                    4: 'Multi-phase budget is approved covering licences, enablement, and change management for the full rollout.',
                    5: 'A multi-year strategic investment is approved, including licences, enablement, ongoing governance, and continuous improvement.',
                },
            },
        ],
    },

    // ── CP2: Microsoft 365 Foundation ─────────────────────────────────────────
    {
        id: 'M365',
        name: 'Microsoft 365 Foundation',
        description: 'Evaluates the maturity of the M365 tenant, licensing readiness, and baseline adoption of core M365 workloads that Copilot depends on.',
        weight: 2.0,
        icon: '🏢',
        questions: [
            {
                id: 'CP2.Q1',
                text: 'What is the organisation\'s Microsoft 365 licensing tier and are Copilot licences provisioned?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'The organisation is not on an eligible M365 plan (e.g., on E3 or below with no upgrade plan) and Copilot licences are not available.',
                    2: 'An eligible M365 plan exists, but Copilot licences have not been purchased or provisioned.',
                    3: 'Copilot licences are purchased but assigned only to IT or a small test group — not yet assigned for pilot users.',
                    4: 'Copilot licences are assigned to the pilot cohort and the process for broader licence management is defined.',
                    5: 'Copilot licences are fully provisioned for the target population with a lifecycle management process in place for future assignments.',
                },
            },
            {
                id: 'CP2.Q2',
                text: 'How mature is the organisation\'s adoption of core M365 workloads that Copilot integrates with — Teams, SharePoint, Outlook, and OneDrive?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'Core M365 workloads are deployed but adoption is very low — most employees still use legacy tools or workarounds.',
                    2: 'Some workloads (e.g., email, basic Teams messaging) are used, but SharePoint and OneDrive adoption is minimal.',
                    3: 'Teams and Outlook are well-adopted but SharePoint is inconsistently used and OneDrive is not standard practice.',
                    4: 'All core workloads are deployed and used across the organisation, though some pockets of inconsistency remain.',
                    5: 'All core M365 workloads are deeply embedded in daily work — Teams, SharePoint, Outlook, and OneDrive are the standard way of working.',
                },
            },
            {
                id: 'CP2.Q3',
                text: 'Is the M365 tenant on the Current Channel (or Monthly Enterprise Channel) required for Copilot features?',
                weight: 'High',
                scoringGuide: {
                    1: 'The tenant is on a semi-annual channel or has no defined update policy — Copilot features will not be available.',
                    2: 'The update channel is known but migration to Current/Monthly Enterprise has not been planned.',
                    3: 'A channel migration plan exists but has not yet been executed for the majority of devices.',
                    4: 'The majority of Copilot-eligible users are on the required channel, with a defined timeline for full compliance.',
                    5: 'All Copilot-eligible devices are on the Current Channel (or Monthly Enterprise Channel) with automated update management.',
                },
            },
            {
                id: 'CP2.Q4',
                text: 'How well managed is the M365 Admin Center — including health monitoring, policy configuration, and change management processes?',
                weight: 'Standard',
                scoringGuide: {
                    1: 'The M365 Admin Center is rarely used and not actively monitored. Changes are made reactively.',
                    2: 'Basic health monitoring occurs but policies are inconsistently configured and change management is informal.',
                    3: 'Core administrative functions are in place, with defined processes for common tasks, but not all areas are governed.',
                    4: 'The Admin Center is actively managed with documented policies, regular health reviews, and a structured change process.',
                    5: 'Full operational maturity — automated monitoring, documented run book, change advisory board, and regular admin team training.',
                },
            },
            {
                id: 'CP2.Q5',
                text: 'Is the organisation\'s M365 environment free of significant technical debt — outdated configurations, legacy integrations, or unmanaged guest accounts — that could affect Copilot performance or security?',
                weight: 'High',
                scoringGuide: {
                    1: 'Significant technical debt exists — legacy configurations, ghost accounts, and unmanaged apps are widespread and unaddressed.',
                    2: 'Technical debt is acknowledged but no remediation programme is in place.',
                    3: 'A remediation programme has started but significant issues remain that could impact Copilot deployment.',
                    4: 'Most known technical debt has been addressed or is on an active remediation plan with clear timelines.',
                    5: 'The tenant is clean — legacy issues are resolved, guest accounts are governed, and configurations are current and documented.',
                },
            },
        ],
    },

    // ── CP3: Content & Data Governance ────────────────────────────────────────
    {
        id: 'Content',
        name: 'Content & Data Governance',
        description: 'Evaluates the governance of content in SharePoint, Teams, and OneDrive — the primary data sources Copilot reasons over. Poor governance here is the most common Copilot blocker.',
        weight: 2.0,
        icon: '🗂️',
        questions: [
            {
                id: 'CP3.Q1',
                text: 'How well governed is content across SharePoint, Teams, and OneDrive — including site structure, naming conventions, permissions, and access controls?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'Content is completely ungoverned — sprawling sites, inconsistent naming, and open permissions are the norm.',
                    2: 'Some governance guidelines exist but are inconsistently applied, and large volumes of ungoverned content remain.',
                    3: 'A governance framework exists and is applied to new content, but historical content is largely ungoverned.',
                    4: 'Governance is applied consistently across key repositories, with active management of permissions and structure.',
                    5: 'Mature content governance is fully in place — automated policies, regular audits, and clear ownership of every content area.',
                },
            },
            {
                id: 'CP3.Q2',
                text: 'Have Microsoft Purview sensitivity labels been deployed and consistently applied to documents, emails, and Teams content?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'Sensitivity labels have not been deployed or are available but not in use.',
                    2: 'Labels are configured but applied manually by only some users — coverage is very low.',
                    3: 'Labels are deployed with some auto-labelling policies, but coverage across the content estate is inconsistent.',
                    4: 'Labels are consistently applied across most content with auto-labelling policies covering the majority of sensitive data.',
                    5: 'Comprehensive labelling is in place — automated classification, mandatory labelling for new content, and regular coverage reporting.',
                },
            },
            {
                id: 'CP3.Q3',
                text: 'Has the organisation assessed and actively remediated data oversharing in SharePoint and OneDrive — content accessible to more people than it should be?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'Data oversharing has not been assessed and is assumed to be significant given the lack of governance.',
                    2: 'Oversharing is acknowledged as a risk but no assessment or remediation has been initiated.',
                    3: 'An oversharing assessment has been conducted and high-risk items identified, but remediation is not yet underway.',
                    4: 'Oversharing remediation is underway — high-risk items are being addressed, and new-content guardrails are in place.',
                    5: 'Oversharing is fully remediated — automated permissions reviews, access expiration policies, and no known high-risk exposure.',
                },
            },
            {
                id: 'CP3.Q4',
                text: 'Are Microsoft 365 retention policies and information lifecycle policies configured — ensuring appropriate retention, deletion, and legal hold processes?',
                weight: 'High',
                scoringGuide: {
                    1: 'No retention policies are configured. Content is retained indefinitely with no deletion or lifecycle management.',
                    2: 'Retention policies exist in theory but are not configured in M365 or are applied to only a small subset of content.',
                    3: 'Core retention policies are configured for key workloads (Exchange, SharePoint) but Teams and OneDrive are not covered.',
                    4: 'Retention policies cover all major workloads, with defined retention periods aligned to regulatory requirements.',
                    5: 'Full lifecycle management is in place — retention, deletion triggers, legal hold workflows, and regular policy review.',
                },
            },
            {
                id: 'CP3.Q5',
                text: 'Has the organisation conducted a content audit to understand what data Copilot will have access to, and assessed the risk of that exposure?',
                weight: 'High',
                scoringGuide: {
                    1: 'No content audit has been conducted. The organisation does not know what Copilot will be able to access.',
                    2: 'An informal review has taken place but it was not systematic and did not produce actionable findings.',
                    3: 'A content audit is in progress or recently completed, with findings identified but not yet fully acted upon.',
                    4: 'A content audit has been completed, high-risk areas identified, and a remediation plan is in progress.',
                    5: 'A thorough content audit is complete, risks are fully remediated, and a process for ongoing content hygiene is established.',
                },
            },
        ],
    },

    // ── CP4: Security & Compliance Readiness ─────────────────────────────────
    {
        id: 'Security',
        name: 'Security & Compliance Readiness',
        description: 'Evaluates the security and compliance posture of the M365 environment for safe Copilot deployment — DLP, audit logging, regulatory compliance, and Copilot-specific security settings.',
        weight: 1.5,
        icon: '🔒',
        questions: [
            {
                id: 'CP4.Q1',
                text: 'Is Microsoft Purview Compliance deployed and configured — including compliance manager, audit logging, and eDiscovery readiness?',
                weight: 'High',
                scoringGuide: {
                    1: 'Microsoft Purview is not deployed or configured for compliance use.',
                    2: 'Purview is available but not actively used beyond basic configuration.',
                    3: 'Purview is configured for core compliance functions (audit logging, basic eDiscovery) but not fully deployed.',
                    4: 'Purview is actively used for compliance management including audit, eDiscovery, and compliance score monitoring.',
                    5: 'Full Purview deployment — compliance score tracked, all workloads audited, eDiscovery workflows defined, and regular compliance reviews.',
                },
            },
            {
                id: 'CP4.Q2',
                text: 'Are Data Loss Prevention (DLP) policies configured and enforced across M365 workloads — Teams, Exchange, SharePoint, and OneDrive?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'No DLP policies are configured. Sensitive data can be freely shared with no automated controls.',
                    2: 'Basic DLP policies exist for Exchange only — Teams, SharePoint, and OneDrive are uncovered.',
                    3: 'DLP policies cover the main workloads but are in monitor-only mode or have significant gaps.',
                    4: 'DLP policies are enforced across all M365 workloads with defined actions for violations.',
                    5: 'Comprehensive, enforced DLP policies — adaptive policies, full workload coverage, user-friendly blocking messages, and regular policy tuning.',
                },
            },
            {
                id: 'CP4.Q3',
                text: 'Has the organisation reviewed and configured Copilot-specific security settings — including which users can access Copilot features, Copilot interaction history settings, and plugin permissions?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'Copilot-specific security settings have not been reviewed. Default configurations are in use without deliberate decision-making.',
                    2: 'An initial review of Copilot settings has occurred but no deliberate configuration decisions have been made.',
                    3: 'Some Copilot security settings have been configured (e.g., user access scoping) but plugin controls and interaction history are not addressed.',
                    4: 'Copilot security settings are deliberately configured — user access, plugin permissions, and interaction history policies are defined.',
                    5: 'All Copilot security settings are reviewed, configured to organisational policy, documented, and reviewed on a regular cadence.',
                },
            },
            {
                id: 'CP4.Q4',
                text: 'Is the organisation aware of and compliant with AI-specific regulations and guidelines relevant to Copilot — such as the EU AI Act, GDPR, and sector-specific rules?',
                weight: 'High',
                scoringGuide: {
                    1: 'No awareness of AI-specific regulatory requirements or their implications for Copilot usage.',
                    2: 'Awareness exists at a high level but no assessment of specific obligations relative to Copilot has been conducted.',
                    3: 'A regulatory assessment is underway or recently completed, but gaps have not been fully addressed.',
                    4: 'Regulatory obligations are assessed, documented, and incorporated into Copilot deployment and governance policies.',
                    5: 'Full regulatory alignment — legal and DPO involved, obligations documented, compliance monitored, and policies regularly reviewed.',
                },
            },
        ],
    },

    // ── CP5: Identity & Access Management ─────────────────────────────────────
    {
        id: 'Identity',
        name: 'Identity & Access Management',
        description: 'Evaluates the maturity of identity, authentication, and access management — the foundation for controlling who can use Copilot and what data they can access through it.',
        weight: 1.5,
        icon: '🔐',
        questions: [
            {
                id: 'CP5.Q1',
                text: 'Is Microsoft Entra ID (formerly Azure AD) the single, trusted source of identity for all users who will access Copilot?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'Multiple identity providers are in use with no single authoritative source — synchronisation gaps exist.',
                    2: 'Entra ID is the primary IdP but shadow accounts or unsynchronised systems exist for some user populations.',
                    3: 'Entra ID is the standard IdP with minor exceptions that are known and on a remediation plan.',
                    4: 'Entra ID is the sole identity provider for all Copilot users, well-maintained and monitored.',
                    5: 'Entra ID is the fully governed, single source of truth — clean directory, automated lifecycle management, and regular access reviews.',
                },
            },
            {
                id: 'CP5.Q2',
                text: 'Is Multi-Factor Authentication (MFA) enforced for all users who will receive Copilot licences?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'MFA is not enforced — users can access M365 and Copilot with a password only.',
                    2: 'MFA is available but optional or enforced for only a subset of users (e.g., admins only).',
                    3: 'MFA is enforced for most users but exceptions exist and are not regularly reviewed.',
                    4: 'MFA is enforced for all Copilot-licensed users via Conditional Access policies with minimal exceptions.',
                    5: 'MFA is enforced universally via Conditional Access — phishing-resistant methods (FIDO2/Authenticator App) are standard, with zero exceptions.',
                },
            },
            {
                id: 'CP5.Q3',
                text: 'Are Conditional Access policies configured to govern access to Copilot-capable services — including device compliance, location, and risk-based controls?',
                weight: 'High',
                scoringGuide: {
                    1: 'No Conditional Access policies are in place — access to M365 is unrestricted by device or location.',
                    2: 'Basic Conditional Access exists (e.g., MFA requirement) but device compliance and risk signals are not used.',
                    3: 'Conditional Access covers core scenarios but Copilot-specific access controls have not been considered.',
                    4: 'Comprehensive Conditional Access policies govern Copilot access — device compliance, location, and sign-in risk are all evaluated.',
                    5: 'Zero Trust Conditional Access in place — continuous access evaluation, device compliance required, high-risk sign-ins blocked, all documented and reviewed.',
                },
            },
            {
                id: 'CP5.Q4',
                text: 'Is guest access in Teams and SharePoint governed, with regular reviews to ensure external users do not have inappropriate access to content that Copilot can reach?',
                weight: 'High',
                scoringGuide: {
                    1: 'Guest access is uncontrolled — external users have been granted access without review and their permissions have grown over time.',
                    2: 'Guest access is granted under a process but historical guest accounts are not reviewed or cleaned up.',
                    3: 'A guest access review has been conducted recently, but ongoing governance and automatic expiration are not in place.',
                    4: 'Guest access is governed — time-limited invitations, access reviews, and documented approval process.',
                    5: 'Full guest lifecycle management — automated expiration, quarterly access reviews, Entra ID Governance entitlement management, and zero standing external access.',
                },
            },
        ],
    },

    // ── CP6: User Adoption & Change Management ────────────────────────────────
    {
        id: 'Adoption',
        name: 'User Adoption & Change Management',
        description: 'Evaluates the organisation\'s readiness to drive genuine Copilot adoption — not just deployment. Technology without adoption delivers no value.',
        weight: 1.5,
        icon: '🚀',
        questions: [
            {
                id: 'CP6.Q1',
                text: 'Is there a dedicated change management programme for the Copilot rollout — with a named owner, defined activities, and budget?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'No change management programme exists. The plan is to deploy Copilot and announce it by email.',
                    2: 'Change management is acknowledged as important but no programme, owner, or budget has been defined.',
                    3: 'A change management approach has been outlined with a named owner, but activities and budget are not confirmed.',
                    4: 'A structured change management programme is in place with defined activities, a named owner, and approved budget.',
                    5: 'A best-practice change management programme is running — ADKAR or similar framework, trained practitioners, executive-backed comms, and progress tracking.',
                },
            },
            {
                id: 'CP6.Q2',
                text: 'Has a Copilot Champions network been established — power users who will drive peer adoption, surface use cases, and provide first-line enablement support?',
                weight: 'High',
                scoringGuide: {
                    1: 'No champions network exists or has been considered.',
                    2: 'The concept of Copilot champions has been discussed but no individuals have been identified or committed.',
                    3: 'Champions have been identified in some business areas but the network is incomplete and not yet activated.',
                    4: 'A champions network is established across key business areas — trained, with regular touchpoints and a clear purpose.',
                    5: 'A fully active champions network — trained, incentivised, connected via a champions channel, producing use case content, and measured on adoption impact.',
                },
            },
            {
                id: 'CP6.Q3',
                text: 'Is a Copilot-specific training and enablement programme in place — covering prompt engineering, key use cases, and responsible use?',
                weight: 'High',
                scoringGuide: {
                    1: 'No training programme exists. Users are expected to learn Copilot independently.',
                    2: 'Training is planned but not yet developed or scheduled.',
                    3: 'Training materials are available (e.g., Microsoft-provided resources shared) but no structured programme or tracking exists.',
                    4: 'A structured training programme is in place — onboarding content, prompt guides, use case playbooks, and delivery schedule.',
                    5: 'A comprehensive enablement ecosystem — role-based training paths, prompt engineering workshops, interactive learning, completion tracking, and regular refreshers.',
                },
            },
            {
                id: 'CP6.Q4',
                text: 'Is a user feedback mechanism in place to capture Copilot adoption challenges, use case ideas, and sentiment — and is it actively monitored?',
                weight: 'Standard',
                scoringGuide: {
                    1: 'No feedback mechanism exists. There is no way for users to report problems or share ideas about Copilot.',
                    2: 'Users can email IT or raise a ticket, but there is no structured Copilot feedback channel.',
                    3: 'A Copilot feedback channel exists (e.g., Teams channel) but it is not actively monitored or actioned.',
                    4: 'A structured feedback mechanism is in place, actively monitored, and findings are fed back into the programme.',
                    5: 'A comprehensive feedback loop — regular pulse surveys, sentiment tracking, dedicated feedback channel, monthly analysis, and programme adjustments driven by user input.',
                },
            },
            {
                id: 'CP6.Q5',
                text: 'Is the internal communications strategy for the Copilot rollout defined, approved, and being actively executed — keeping employees informed before, during, and after deployment?',
                weight: 'Standard',
                scoringGuide: {
                    1: 'No communications strategy exists. Employees have not been informed about the Copilot programme.',
                    2: 'An email announcement is planned for when Copilot is deployed — no ongoing communications are planned.',
                    3: 'A communications plan exists with key messages and channels identified, but delivery is not yet consistent or regular.',
                    4: 'An active communications programme is running — regular updates, manager briefings, and milestone announcements.',
                    5: 'Best-practice communications — multi-channel approach, executive sponsorship messages, progress updates, success story sharing, and two-way dialogue.',
                },
            },
        ],
    },

    // ── CP7: Use Case Identification & Value ──────────────────────────────────
    {
        id: 'UseCases',
        name: 'Use Case Identification & Value',
        description: 'Evaluates the maturity of Copilot use case identification, prioritisation, and the associated value measurement approach.',
        weight: 1.5,
        icon: '💡',
        questions: [
            {
                id: 'CP7.Q1',
                text: 'Have specific Microsoft Copilot use cases been identified and prioritised by business unit or role group — beyond generic "productivity improvement"?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'No specific use cases have been identified. The expectation is that users will find value themselves after deployment.',
                    2: 'Generic use case categories are identified (e.g., "meeting summaries", "email drafting") but no business-specific prioritisation exists.',
                    3: 'Use cases are identified and mapped to business units, but not yet formally prioritised or validated.',
                    4: 'A prioritised use case catalogue exists, covering multiple business units with role-specific scenarios and expected value.',
                    5: 'A fully validated use case portfolio — prioritised, business-case-backed, with owners, pilot targets, and measurable success criteria per use case.',
                },
            },
            {
                id: 'CP7.Q2',
                text: 'Is there a validated business case or ROI model for the Copilot investment — quantifying expected time savings, productivity gains, or cost reduction?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'No business case or ROI model exists. The investment decision was made without financial justification.',
                    2: 'A rough ROI narrative exists (e.g., "save 2 hours per user per week") but it has not been validated or baselined.',
                    3: 'An ROI model has been developed with estimated values, but baselines have not been measured and assumptions are unchallenged.',
                    4: 'A validated ROI model with baselined metrics, defined measurement approach, and realistic assumptions agreed with finance.',
                    5: 'A rigorous, finance-approved business case with baselined metrics, validated assumptions, and a committed measurement and reporting plan.',
                },
            },
            {
                id: 'CP7.Q3',
                text: 'Has a pilot group been selected for the initial Copilot deployment — representative users who will actively test use cases and provide structured feedback?',
                weight: 'High',
                scoringGuide: {
                    1: 'No pilot group has been defined. Copilot licences will be distributed broadly from day one.',
                    2: 'A broad group (e.g., "all of IT") has been identified as the pilot, but no selection criteria or structure exists.',
                    3: 'A pilot group is defined with some consideration for diversity of roles, but the structure, commitment, and objectives are not formalised.',
                    4: 'A structured pilot group is selected — diverse roles, willing participants, defined use cases to test, and a feedback process.',
                    5: 'A best-practice pilot — strategic cohort selection, defined test scenarios, committed participation agreements, structured feedback loops, and measurable pilot success criteria.',
                },
            },
            {
                id: 'CP7.Q4',
                text: 'Are use case owners identified — individuals within business units who will champion specific Copilot scenarios, measure impact, and drive adoption within their teams?',
                weight: 'High',
                scoringGuide: {
                    1: 'No use case owners are identified. Ownership of Copilot scenarios is undefined.',
                    2: 'The concept of use case ownership has been discussed but no individuals have been formally committed.',
                    3: 'Use case owners are identified for some key scenarios, but the majority of use cases have no named owner.',
                    4: 'Use case owners are identified for all priority scenarios — briefed, committed, and included in the programme governance.',
                    5: 'All use cases have committed owners who are trained, measured on adoption outcomes, and active participants in the programme governance.',
                },
            },
            {
                id: 'CP7.Q5',
                text: 'Is there a process for documenting and scaling successful Copilot use cases — capturing what works and systematically expanding proven scenarios?',
                weight: 'Standard',
                scoringGuide: {
                    1: 'No process exists for capturing or scaling use case learnings.',
                    2: 'Successful stories are shared informally (e.g., in meetings) but are not systematically captured.',
                    3: 'A mechanism for capturing use case outcomes exists but is not consistently used or connected to scaling decisions.',
                    4: 'Successful use cases are documented, reviewed regularly, and inform the expansion roadmap.',
                    5: 'A mature use case factory — structured capture, peer review, content library, and a defined process for scaling proven scenarios to new business units.',
                },
            },
        ],
    },

    // ── CP8: Copilot Governance & Acceptable Use ──────────────────────────────
    {
        id: 'Governance',
        name: 'Copilot Governance & Acceptable Use',
        description: 'Evaluates the governance structures, policies, and controls in place to ensure Copilot is used responsibly, safely, and in compliance with organisational and regulatory requirements.',
        weight: 1.0,
        icon: '📋',
        questions: [
            {
                id: 'CP8.Q1',
                text: 'Is an AI / Copilot Acceptable Use Policy (AUP) defined, approved, and communicated to all users who will have access to Copilot?',
                weight: 'Critical',
                scoringGuide: {
                    1: 'No Acceptable Use Policy exists for AI tools including Copilot.',
                    2: 'A general IT AUP exists but it does not specifically address AI or Copilot usage scenarios.',
                    3: 'A Copilot AUP is drafted but has not been formally approved or communicated to users.',
                    4: 'A Copilot AUP is approved, communicated to all users, and acknowledged as part of the licence onboarding process.',
                    5: 'A comprehensive, regularly reviewed AUP — covers all Copilot scenarios including content generation, data handling, and third-party sharing — enforced through onboarding and training.',
                },
            },
            {
                id: 'CP8.Q2',
                text: 'Has the organisation reviewed Microsoft\'s Responsible AI commitments for Copilot — including data residency, processing terms, and the Microsoft Copilot Copyright Commitment?',
                weight: 'High',
                scoringGuide: {
                    1: 'No review of Microsoft\'s Responsible AI terms or Copilot commitments has been conducted.',
                    2: 'An informal review has been done but findings are not documented or used in governance decisions.',
                    3: 'Key elements of Microsoft\'s terms have been reviewed and noted, but implications for policy have not been fully assessed.',
                    4: 'Microsoft\'s Responsible AI commitments are reviewed, understood, and reflected in internal governance policies.',
                    5: 'Full review and adoption — data processing terms signed, data residency confirmed, Copyright Commitment implications documented, and reviewed annually.',
                },
            },
            {
                id: 'CP8.Q3',
                text: 'Is there a process for monitoring Copilot usage — identifying misuse, detecting policy violations, and reviewing unusual activity?',
                weight: 'High',
                scoringGuide: {
                    1: 'No Copilot usage monitoring exists. The organisation has no visibility into how Copilot is being used.',
                    2: 'Basic M365 audit logs are available but not reviewed specifically for Copilot activity.',
                    3: 'Copilot usage reports from the M365 Admin Center are reviewed periodically but no defined monitoring process exists.',
                    4: 'A defined monitoring process is in place — Copilot usage dashboards are reviewed regularly and alert thresholds are configured.',
                    5: 'Proactive monitoring — automated alerts for anomalous usage, regular governance reviews, integration with SIEM, and a defined incident response process for Copilot misuse.',
                },
            },
            {
                id: 'CP8.Q4',
                text: 'Are there documented processes for handling Copilot-generated content in regulated or sensitive contexts — such as legal, HR, financial, or client-facing communications?',
                weight: 'High',
                scoringGuide: {
                    1: 'No guidance exists for regulated or sensitive contexts. Copilot output is treated the same as all other content.',
                    2: 'There is informal awareness that Copilot output in sensitive areas needs review, but no documented process.',
                    3: 'Guidance exists for some regulated contexts (e.g., legal) but is not comprehensive or consistently applied.',
                    4: 'Documented processes exist for all key regulated contexts — review requirements, approval workflows, and disclaimer requirements.',
                    5: 'Comprehensive, enforced processes — role-specific guidance, mandatory human review for defined content types, audit trail, and regular process reviews.',
                },
            },
            {
                id: 'CP8.Q5',
                text: 'Has the organisation assessed the risk of Copilot generating inaccurate, biased, or inappropriate outputs — and are controls in place to detect and manage this risk?',
                weight: 'High',
                scoringGuide: {
                    1: 'No risk assessment has been conducted. The assumption is that Copilot output is reliable and accurate.',
                    2: 'The risk of inaccurate output is acknowledged informally but no formal assessment or controls exist.',
                    3: 'A risk assessment has been conducted, key risks identified, but controls are not yet fully implemented.',
                    4: 'Key risks are assessed, documented, and mitigating controls are in place — user training on output verification, disclaimer requirements for certain content types.',
                    5: 'Comprehensive risk management — formal AI risk register for Copilot, controls tested, user education active, incident reporting process defined, and risk reviewed quarterly.',
                },
            },
        ],
    },
]

export function calculateCopilotDomainScore(
    questions: { weight: string }[],
    scores: Record<string, number>,
    questionIds: string[]
): number {
    const WEIGHTS = { Critical: 3, High: 2, Standard: 1 }
    let weighted = 0, total = 0
    questionIds.forEach((qId, i) => {
        const score = scores[qId]
        if (score === undefined || score === 0) return
        const w = WEIGHTS[questions[i]?.weight as keyof typeof WEIGHTS] ?? 1
        weighted += score * w
        total += w
    })
    return total > 0 ? Math.round((weighted / total) * 10) / 10 : 0
}
