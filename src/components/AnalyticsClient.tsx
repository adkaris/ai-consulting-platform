'use client'

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
    PieChart, Pie, Cell,
    ScatterChart, Scatter, ZAxis, ReferenceLine,
} from 'recharts'

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

interface AnalyticsData {
    maturityByIndustry: { name: string; value: number }[]
    roiByDepartment: { name: string; value: number }[]
    prioritySpread: { name: string; value: number }[]
    domainAverages: { domain: string; score: number; benchmark: number }[]
    riskMatrix: { name: string; maturity: number; ambition: number }[]
    roiByStatus: { dept: string; DRAFT: number; APPROVED: number; PILOTING: number; PRODUCTION: number }[]
}

const TOOLTIP_STYLE = { borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 1. Domain Averages Radar + Benchmark overlay */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Portfolio Domain Maturity
                </h3>
                <p className="text-xs text-slate-400 mb-5">vs. mid-market industry benchmark</p>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.domainAverages}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="domain" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                            <Radar name="Portfolio Avg" dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.35} />
                            <Radar name="Benchmark" dataKey="benchmark" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} strokeDasharray="4 3" />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Average Maturity by Industry */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Average Maturity by Industry
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.maturityByIndustry} layout="vertical" margin={{ left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" domain={[0, 5]} hide />
                            <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="value" fill="#4f46e5" radius={[0, 8, 8, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. Portfolio Risk Matrix — maturity vs ambition */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Portfolio Risk Matrix
                </h3>
                <p className="text-xs text-slate-400 mb-5">Maturity score vs. ambition level per customer</p>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis type="number" dataKey="maturity" domain={[0, 5]} name="Maturity" label={{ value: 'Maturity', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <YAxis type="number" dataKey="ambition" domain={[0, 5]} name="Ambition" label={{ value: 'Ambition', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <ZAxis range={[60, 60]} />
                            <ReferenceLine x={2.5} stroke="#e2e8f0" strokeDasharray="4 3" />
                            <ReferenceLine y={2.5} stroke="#e2e8f0" strokeDasharray="4 3" />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={TOOLTIP_STYLE}
                                formatter={(value, name) => [value, name === 'maturity' ? 'Maturity' : 'Ambition']}
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null
                                    const d = payload[0].payload
                                    return (
                                        <div className="bg-white rounded-xl shadow-lg border-0 px-3 py-2 text-xs">
                                            <p className="font-bold text-slate-800 mb-1">{d.name}</p>
                                            <p className="text-slate-500">Maturity: <span className="font-semibold text-indigo-600">{d.maturity}</span></p>
                                            <p className="text-slate-500">Ambition: <span className="font-semibold text-rose-500">{d.ambition}</span></p>
                                        </div>
                                    )
                                }}
                            />
                            <Scatter data={data.riskMatrix} fill="#4f46e5" fillOpacity={0.75} />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 4. Stacked ROI by Department & Status */}
            {data.roiByStatus.length > 0 ? (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-md font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        ROI Pipeline by Department
                    </h3>
                    <p className="text-xs text-slate-400 mb-5">Stacked by initiative status (€ estimated)</p>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.roiByStatus} margin={{ bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="dept" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} axisLine={false} />
                                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`€${v.toLocaleString()}`, '']} />
                                <Legend wrapperStyle={{ fontSize: 11 }} />
                                <Bar dataKey="DRAFT"      stackId="a" fill="#cbd5e1" radius={[0, 0, 0, 0]} name="Draft" />
                                <Bar dataKey="APPROVED"   stackId="a" fill="#10b981" name="Approved" />
                                <Bar dataKey="PILOTING"   stackId="a" fill="#f59e0b" name="Piloting" />
                                <Bar dataKey="PRODUCTION" stackId="a" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Production" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                /* Fallback to priority spread if no ROI-by-dept data */
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-md font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Portfolio Initiative Priority
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.prioritySpread}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} axisLine={false} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={TOOLTIP_STYLE} />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                                    {data.prioritySpread.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.name === 'HIGH' ? '#ef4444' : entry.name === 'MEDIUM' ? '#f59e0b' : '#64748b'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* 5. ROI by Department Donut — full width if risk matrix is shown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2">
                <h3 className="text-md font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    Potential ROI Distribution by Department
                </h3>
                <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.roiByDepartment}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={4}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {data.roiByDepartment.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`€${v.toLocaleString()}`, 'Est. ROI']} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
