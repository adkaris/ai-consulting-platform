export interface UseCaseTemplate {
    id: string;
    title: string;
    description: string;
    department: 'Sales' | 'Marketing' | 'HR' | 'Finance' | 'IT' | 'Operations' | 'Legal' | 'Customer Service';
    priority: 'High' | 'Medium' | 'Low';
    roiEstimate: number;
}

export const USE_CASE_TEMPLATES: UseCaseTemplate[] = [
    {
        id: 'customer_service_chatbot',
        title: 'AI-Powered Customer Service Chatbot',
        description: 'Implement a generative AI chatbot to handle common customer inquiries, reducing wait times and human agent workload.',
        department: 'Customer Service',
        priority: 'High',
        roiEstimate: 250000,
    },
    {
        id: 'invoice_processing_automation',
        title: 'Automated Invoice Processing',
        description: 'Use OCR and AI to extract data from invoices and automatically populate the finance system, reducing manual entry errors.',
        department: 'Finance',
        priority: 'High',
        roiEstimate: 180000,
    },
    {
        id: 'predictive_maintenance',
        title: 'Predictive Equipment Maintenance',
        description: 'Analyze sensor data from manufacturing equipment to predict failures before they happen, minimizing downtime.',
        department: 'Operations',
        priority: 'Medium',
        roiEstimate: 450000,
    },
    {
        id: 'personalized_marketing_campaigns',
        title: 'AI-Driven Personalized Marketing',
        description: 'Segment customers and generate personalized email content based on purchase history and browsing behavior.',
        department: 'Marketing',
        priority: 'High',
        roiEstimate: 320000,
    },
    {
        id: 'hr_resume_screening',
        title: 'AI Resume Screening & Ranking',
        description: 'Automatically screen resumes against job descriptions to identify top candidates, speeding up the hiring process.',
        department: 'HR',
        priority: 'Medium',
        roiEstimate: 95000,
    },
    {
        id: 'sales_lead_scoring',
        title: 'Automated Sales Lead Scoring',
        description: 'Predict the likelihood of a lead converting based on historical data, allowing sales teams to prioritize high-value prospects.',
        department: 'Sales',
        priority: 'High',
        roiEstimate: 210000,
    },
    {
        id: 'legal_contract_analysis',
        title: 'AI Contract Review & Analysis',
        description: 'Automatically extract key clauses and identify potential risks in legal contracts using NLP.',
        department: 'Legal',
        priority: 'Medium',
        roiEstimate: 140000,
    },
    {
        id: 'it_incident_triage',
        title: 'AI-Powered IT Incident Triage',
        description: 'Categorize and route IT support tickets automatically to the correct resolver group based on historical patterns.',
        department: 'IT',
        priority: 'Medium',
        roiEstimate: 120000,
    },
    {
        id: 'inventory_optimization',
        title: 'AI Demand Forecasting & Inventory Optimization',
        description: 'Predict future demand for products to optimize stock levels and reduce holding costs or stockouts.',
        department: 'Operations',
        priority: 'High',
        roiEstimate: 500000,
    },
    {
        id: 'sentiment_analysis_social_media',
        title: 'Real-time Brand Sentiment Analysis',
        description: 'Monitor social media mentions and analyze sentiment to track brand reputation and respond to issues quickly.',
        department: 'Marketing',
        priority: 'Low',
        roiEstimate: 45000,
    },
    {
        id: 'employee_onboarding_assistant',
        title: 'AI Onboarding Concierge',
        description: 'A chatbot that answers new employee questions about policies, benefits, and IT setup during their first 30 days.',
        department: 'HR',
        priority: 'Low',
        roiEstimate: 30000,
    },
    {
        id: 'fraud_detection_finance',
        title: 'AI Transaction Fraud Detection',
        description: 'Identify anomalous transaction patterns in real-time to flag potential fraudulent activity in financial systems.',
        department: 'Finance',
        priority: 'High',
        roiEstimate: 600000,
    },
    {
        id: 'code_review_assistant',
        title: 'AI-Assisted Code Quality Review',
        description: 'Automatically scan pull requests for security vulnerabilities and adherence to coding standards before human review.',
        department: 'IT',
        priority: 'Medium',
        roiEstimate: 150000,
    },
    {
        id: 'sales_call_transcription_analysis',
        title: 'Sales Intelligence from Call Transcripts',
        description: 'Analyze sales call recordings to extract key objections, customer pain points, and competitor mentions.',
        department: 'Sales',
        priority: 'Medium',
        roiEstimate: 110000,
    },
    {
        id: 'procurement_vendor_assessment',
        title: 'AI Vendor Risk & Performance Scoring',
        description: 'Aggregates vendor data, news, and financial reports to provide a continuous risk score for the supply chain.',
        department: 'Operations',
        priority: 'Medium',
        roiEstimate: 200000,
    }
];
