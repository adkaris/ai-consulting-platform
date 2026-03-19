export interface IntakeResults {
    readinessScores: Record<string, number>;
    useCases: Array<{
        title: string;
        description: string;
        department: string;
        priority: 'HIGH' | 'MEDIUM' | 'LOW';
        roiEstimate: number;
    }>;
    sentimentSummary: string;
}

/**
 * Simulates a sophisticated LLM analysis of meeting notes.
 * In a real-world scenario, this would call Google Gemini or OpenAI.
 */
export async function analyzeMeetingNotes(notes: string): Promise<IntakeResults> {
    // Simulate network latency / processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    const lowercaseNotes = notes.toLowerCase();

    // THE ANALYZER STARTS WITH AN EMPTY SET OF FINDINGS
    // ONLY ITEMS EXPLICITLY DETECTED OR IMPACTED BY THE CONTENT WILL BE RETURNED
    const results: IntakeResults = {
        readinessScores: {},
        useCases: [],
        sentimentSummary: "The client appears committed to AI transformation but is currently hampered by significant data silos and a lack of internal technical baseline. Executive sponsorship is present but requires a more formalized roadmap to align with business objectives."
    };

    // "Extract" some use cases if keywords are found
    if (lowercaseNotes.includes('customer') || lowercaseNotes.includes('support')) {
        results.useCases.push({
            title: 'AI-Enhanced Customer Support Portal',
            description: 'Automated resolution of Tier-1 support tickets using vectorized knowledge bases.',
            department: 'Customer Service',
            priority: 'HIGH',
            roiEstimate: 120000
        });
    }

    if (lowercaseNotes.includes('invoice') || lowercaseNotes.includes('finance') || lowercaseNotes.includes('billing')) {
        results.useCases.push({
            title: 'Intelligent Invoice Processing',
            description: 'Automated data extraction and validation for accounts payable workflows.',
            department: 'Finance',
            priority: 'HIGH',
            roiEstimate: 85000
        });
    }

    if (lowercaseNotes.includes('marketing') || lowercaseNotes.includes('content') || lowercaseNotes.includes('social')) {
        results.useCases.push({
            title: 'Generative Content Factory',
            description: 'AI-assisted creation of multi-channel marketing copy and social assets.',
            department: 'Marketing',
            priority: 'MEDIUM',
            roiEstimate: 45000
        });
    }

    // Adjust scores based on keywords
    if (lowercaseNotes.includes('executive') || lowercaseNotes.includes('champion') || lowercaseNotes.includes('vision') || lowercaseNotes.includes('ceo')) {
        results.readinessScores.Strategy = 4.0;
    }
    
    if (lowercaseNotes.includes('legacy') || lowercaseNotes.includes('old') || lowercaseNotes.includes('on-prem') || lowercaseNotes.includes('architecture')) {
        results.readinessScores.Tech = 1.5;
    }

    if (lowercaseNotes.includes('clean') || lowercaseNotes.includes('cloud') || lowercaseNotes.includes('snowflake') || lowercaseNotes.includes('databricks') || lowercaseNotes.includes('silos')) {
        results.readinessScores.Data = 4.5;
    }

    if (lowercaseNotes.includes('security') || lowercaseNotes.includes('risk') || lowercaseNotes.includes('compliance')) {
        results.readinessScores.Security = 2.0;
    }

    if (lowercaseNotes.includes('skills') || lowercaseNotes.includes('training') || lowercaseNotes.includes('talent')) {
        results.readinessScores.Skills = 1.8;
    }

    if (lowercaseNotes.includes('ops') || lowercaseNotes.includes('operations') || lowercaseNotes.includes('workflow')) {
        results.readinessScores.Ops = 2.3;
    }

    if (lowercaseNotes.includes('governance') || lowercaseNotes.includes('policy') || lowercaseNotes.includes('standards')) {
        results.readinessScores.Governance = 3.2;
    }

    if (lowercaseNotes.includes('finance') || lowercaseNotes.includes('budget') || lowercaseNotes.includes('cost')) {
        results.readinessScores.Financial = 2.8;
    }

/* 
    // Removed generic fallback to respect "only impacted items" rule
    if (results.useCases.length === 0) {
        results.useCases.push({
            title: 'General AI Efficiency Pilot',
            description: 'Internal productivity tools for text summarization and email drafting.',
            department: 'General',
            priority: 'MEDIUM',
            roiEstimate: 25000
        });
    }
    */

    return results;
}
