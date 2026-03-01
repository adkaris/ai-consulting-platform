import { getAllUseCases, getAllAssessments, getCustomers } from '@/app/actions'
import AnalyticsClient from '@/components/AnalyticsClient'
import { LineChart, BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react'

export default async function AnalyticsPage() {
    const customers = await getCustomers()
    const assessments = await getAllAssessments()
    const useCases = await getAllUseCases()

    // Aggregation Logic

    // 1. Average maturity by industry
    const industryStats: Record<string, { sum: number, count: number }> = {}
    assessments.forEach(a => {
        const domainScores = [a.scoreStrategy, a.scoreData, a.scoreTech, a.scoreSecurity, a.scoreSkills, a.scoreOps, a.scoreGovernance, a.scoreFinancial]
        const avg = domainScores.reduce((acc: number, score: number | null) => acc + (score || 0), 0) / domainScores.length

        const cust = customers.find(c => c.id === a.customerId)
        const industry = cust?.industry || 'Unknown'

        if (!industryStats[industry]) industryStats[industry] = { sum: 0, count: 0 }
        industryStats[industry].sum += avg
        industryStats[industry].count += 1
    })
    const maturityByIndustry = Object.keys(industryStats).map(name => ({
        name,
        value: parseFloat((industryStats[name].sum / industryStats[name].count).toFixed(1))
    }))

    // 2. ROI by department
    const deptROI: Record<string, number> = {}
    useCases.forEach(uc => {
        const dept = uc.department || 'General'
        deptROI[dept] = (deptROI[dept] || 0) + (uc.roiEstimate || 0)
    })
    const roiByDepartment = Object.keys(deptROI).map(name => ({
        name,
        value: deptROI[name]
    }))

    // 3. Priority spread
    const priorities: Record<string, number> = { 'HIGH': 0, 'MEDIUM': 0, 'LOW': 0 }
    useCases.forEach(uc => {
        const p = uc.priority || 'LOW'
        priorities[p] = (priorities[p] || 0) + 1
    })
    const prioritySpread = Object.keys(priorities).map(name => ({
        name,
        value: priorities[name]
    }))

    // 4. Global domain averages
    const domainTotals = {
        Strategy: { sum: 0, count: 0 },
        Data: { sum: 0, count: 0 },
        Tech: { sum: 0, count: 0 },
        Security: { sum: 0, count: 0 },
        Skills: { sum: 0, count: 0 },
        Ops: { sum: 0, count: 0 },
        Governance: { sum: 0, count: 0 },
        Financial: { sum: 0, count: 0 },
    }

    assessments.forEach(a => {
        if (a.scoreStrategy) { domainTotals.Strategy.sum += a.scoreStrategy; domainTotals.Strategy.count++ }
        if (a.scoreData) { domainTotals.Data.sum += a.scoreData; domainTotals.Data.count++ }
        if (a.scoreTech) { domainTotals.Tech.sum += a.scoreTech; domainTotals.Tech.count++ }
        if (a.scoreSecurity) { domainTotals.Security.sum += a.scoreSecurity; domainTotals.Security.count++ }
        if (a.scoreSkills) { domainTotals.Skills.sum += a.scoreSkills; domainTotals.Skills.count++ }
        if (a.scoreOps) { domainTotals.Ops.sum += a.scoreOps; domainTotals.Ops.count++ }
        if (a.scoreGovernance) { domainTotals.Governance.sum += a.scoreGovernance; domainTotals.Governance.count++ }
        if (a.scoreFinancial) { domainTotals.Financial.sum += a.scoreFinancial; domainTotals.Financial.count++ }
    })

    const domainAverages = Object.keys(domainTotals).map(key => ({
        domain: key,
        score: (domainTotals as any)[key].count > 0 ? parseFloat(((domainTotals as any)[key].sum / (domainTotals as any)[key].count).toFixed(1)) : 0
    }))

    const analyticsData = {
        maturityByIndustry,
        roiByDepartment,
        prioritySpread,
        domainAverages
    }

    return (
        <div className="space-y-8 animate-in fade-in fill-mode-both duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Portfolio Insights</h1>
                    <p className="text-slate-500">Aggregated intelligence and performance metrics across all AI engagements.</p>
                </div>
            </div>

            <AnalyticsClient data={analyticsData} />
        </div>
    )
}
