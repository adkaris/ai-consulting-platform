'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LabelList
} from 'recharts'
import { Rocket, Sparkles, Building2, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Hex values for Recharts (cannot use Tailwind classes there)
const STATUS_COLORS = {
  DRAFT: '#94a3b8',
  APPROVED: '#3b82f6',
  PILOTING: '#f59e0b',
  PRODUCTION: '#10b981'
}

// Tailwind classes for HTML dot indicators (avoids inline styles)
const STATUS_DOT_CLASS: Record<string, string> = {
  DRAFT: 'bg-slate-400',
  APPROVED: 'bg-blue-500',
  PILOTING: 'bg-amber-500',
  PRODUCTION: 'bg-emerald-500',
}

const PHASE_NAMES = ['Discovery', 'Strategy', 'PoV Execution', 'Change Mgt', 'Realization']

export default function DashboardClient({ customers, assessments, useCases, phaseDist }: any) {
  const router = useRouter()

  // ── 1. Pipeline Value Chart
  // Fix: UseCase has no .phase field — group by the customer's currentPhase instead
  const pipelineData = useMemo(() => {
    const customerPhaseMap = new Map(customers.map((c: any) => [c.id, c.currentPhase]))
    return [1, 2, 3, 4, 5].map(phaseNum => {
      const phaseCases = useCases.filter((uc: any) => customerPhaseMap.get(uc.customerId) === phaseNum)
      const customerCount = customers.filter((c: any) => c.currentPhase === phaseNum).length
      return {
        name: PHASE_NAMES[phaseNum - 1],
        roi: phaseCases.reduce((sum: number, uc: any) => sum + (uc.roiEstimate || 0), 0),
        customers: customerCount,
        phase: phaseNum,
      }
    })
  }, [customers, useCases])

  // ── 2. Delivery Velocity (Use Case Status Breakdown)
  const velocityData = useMemo(() => {
    const counts = { DRAFT: 0, APPROVED: 0, PILOTING: 0, PRODUCTION: 0 }
    useCases.forEach((uc: any) => {
      if (counts[uc.status as keyof typeof counts] !== undefined) {
        counts[uc.status as keyof typeof counts]++
      }
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [useCases])

  // ── 3. Top Initiatives (sorted by ROI desc)
  const topInitiatives = useMemo(() => {
    return [...useCases]
      .sort((a, b) => (b.roiEstimate || 0) - (a.roiEstimate || 0))
      .slice(0, 5)
  }, [useCases])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* ── Pipeline Value Chart ──────────────────────────────────────────────── */}
      <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/10" />
        <div className="flex items-center justify-between mb-8 z-10 relative">
          <div>
            <h2 className="text-xl font-black text-slate-900">Pipeline Value by Phase</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              Est. ROI · labels show customer count per phase
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/customers"
              className="flex items-center gap-1 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors"
            >
              All customers <ArrowRight className="w-3 h-3" />
            </Link>
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="h-72 w-full z-10 relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineData} margin={{ top: 32, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(val: any, name: string) => {
                  if (name === 'roi') return [`$${Number(val).toLocaleString()}`, 'Total ROI']
                  if (name === 'customers') return [val, 'Customers']
                  return [val, name]
                }}
              />
              <Bar dataKey="roi" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {/* Customer count badge above each bar */}
                <LabelList
                  dataKey="customers"
                  position="top"
                  content={(props: any) => {
                    const { x, y, width, value } = props
                    if (!value) return null
                    return (
                      <g>
                        <rect
                          x={x + width / 2 - 15}
                          y={y - 24}
                          width={30}
                          height={18}
                          rx={5}
                          fill="#eff6ff"
                          stroke="#bfdbfe"
                          strokeWidth={1}
                        />
                        <text
                          x={x + width / 2}
                          y={y - 11}
                          textAnchor="middle"
                          fill="#3b82f6"
                          fontSize={10}
                          fontWeight="800"
                        >
                          {value}c
                        </text>
                      </g>
                    )
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Delivery Velocity Chart ───────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-amber-500/10" />
        <div className="flex items-center justify-between mb-8 z-10 relative">
          <div>
            <h2 className="text-xl font-black text-slate-900">Delivery Velocity</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Use Case Status Breakdown</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/use-cases"
              className="flex items-center gap-1 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
              <Rocket className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="h-56 w-full z-10 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={velocityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {velocityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 z-10 relative">
          {velocityData.map((entry) => (
            <Link
              key={entry.name}
              href="/use-cases"
              className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
            >
              <span className="text-xs font-black text-slate-500">{entry.name}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT_CLASS[entry.name] ?? 'bg-slate-300'}`} />
                <span className="text-lg font-black text-slate-900">{entry.value}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Top Initiatives Table ─────────────────────────────────────────────── */}
      <div className="lg:col-span-3 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm relative group overflow-hidden">
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900">Top Initiatives</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              Highest value AI use cases across the portfolio — click any row to open
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/use-cases"
              className="flex items-center gap-1 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors"
            >
              All use cases <ArrowRight className="w-3 h-3" />
            </Link>
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Initiative</th>
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Client</th>
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Department</th>
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right pr-2">Est. ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topInitiatives.map((uc: any) => (
                <tr
                  key={uc.id}
                  className="group/row hover:bg-emerald-50/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/customers/${uc.customerId}`)}
                >
                  <td className="py-4 pl-2">
                    <div className="font-bold text-slate-900 group-hover/row:text-emerald-700 transition-colors">
                      {uc.title}
                    </div>
                    {uc.description && (
                      <div className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">{uc.description}</div>
                    )}
                  </td>
                  <td className="py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                        <Building2 className="w-3 h-3 text-slate-500" />
                      </div>
                      <span className="text-sm font-semibold text-slate-600 truncate max-w-[120px]">
                        {uc.customer?.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 hidden sm:table-cell">
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      {uc.department || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT_CLASS[uc.status] ?? 'bg-slate-300'}`} />
                      <span className="text-xs font-black text-slate-600 uppercase tracking-wider">{uc.status}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-2 text-right">
                    <span className="text-[15px] font-black text-slate-900">
                      ${(uc.roiEstimate || 0).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {topInitiatives.length === 0 && (
            <div className="py-16 text-center">
              <Sparkles className="w-8 h-8 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-bold">No use cases logged yet.</p>
              <p className="text-xs text-slate-300 mt-1">
                Add use cases inside a customer profile to see them ranked here.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
