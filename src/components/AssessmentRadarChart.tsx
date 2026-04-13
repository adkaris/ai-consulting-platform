'use client'

import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    Radar, Legend, Tooltip, ResponsiveContainer,
} from 'recharts'

interface RadarPoint {
    domain: string
    score: number
    benchmark: number
}

// Industry-average benchmarks (mid-market enterprise starting AI transformation)
const BENCHMARKS: Record<string, number> = {
    'Strategy':    3.2,
    'Data':        2.8,
    'Tech':        3.0,
    'Security':    3.4,
    'Skills':      2.6,
    'Ops':         3.1,
    'Governance':  2.9,
    'Financial':   3.0,
}

interface Props {
    domainScores: { radarKey: string; label: string; score: number }[]
}

export default function AssessmentRadarChart({ domainScores }: Props) {
    const data: RadarPoint[] = domainScores.map(d => ({
        domain: d.radarKey,
        score: d.score,
        benchmark: BENCHMARKS[d.radarKey] ?? 3.0,
    }))

    return (
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis
                        dataKey="domain"
                        tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 5]}
                        tick={{ fill: '#94a3b8', fontSize: 9 }}
                        tickCount={6}
                    />
                    {/* Industry average */}
                    <Radar
                        name="Industry Average"
                        dataKey="benchmark"
                        stroke="#94a3b8"
                        fill="#94a3b8"
                        fillOpacity={0.15}
                        strokeDasharray="4 3"
                        strokeWidth={1.5}
                    />
                    {/* Your organisation */}
                    <Radar
                        name="Your Organisation"
                        dataKey="score"
                        stroke="#4f46e5"
                        fill="#4f46e5"
                        fillOpacity={0.35}
                        strokeWidth={2}
                    />
                    <Tooltip
                        formatter={(value: number, name: string) => [
                            `${value.toFixed(1)} / 5.0`,
                            name,
                        ]}
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}
