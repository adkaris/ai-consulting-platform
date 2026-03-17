'use client'

import React, { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { Rocket, Sparkles, Building2, TrendingUp, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const STATUS_COLORS = {
  DRAFT: '#94a3b8',
  APPROVED: '#3b82f6',
  PILOTING: '#f59e0b',
  PRODUCTION: '#10b981'
}

const PHASE_NAMES = ['Discovery', 'Strategy', 'PoV Execution', 'Change Mgt', 'Realization']

export default function DashboardClient({ customers, assessments, useCases }: any) {

  // ---- 1. Pipeline Value Chart Data ----
  const pipelineData = useMemo(() => {
    return [1, 2, 3, 4, 5].map(phaseNum => {
      const phaseCases = useCases.filter((uc: any) => uc.phase === phaseNum)
      return {
        name: `Phase ${phaseNum}: ${PHASE_NAMES[phaseNum - 1]}`,
        roi: phaseCases.reduce((sum: number, uc: any) => sum + (uc.roiEstimate || 0), 0)
      }
    })
  }, [useCases])

  // ---- 2. Delivery Velocity (Status) Data ----
  const velocityData = useMemo(() => {
    const counts = { DRAFT: 0, APPROVED: 0, PILOTING: 0, PRODUCTION: 0 }
    useCases.forEach((uc: any) => {
      if (counts[uc.status as keyof typeof counts] !== undefined) {
        counts[uc.status as keyof typeof counts]++
      }
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [useCases])

  // ---- 3. Top Initiatives Table Data ----
  const topInitiatives = useMemo(() => {
    return [...useCases]
      .sort((a, b) => (b.roiEstimate || 0) - (a.roiEstimate || 0))
      .slice(0, 5)
  }, [useCases])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Col - Pipeline Chart */}
      <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/10" />
        <div className="flex items-center justify-between mb-8 z-10 relative">
          <div>
            <h2 className="text-xl font-black text-slate-900">Pipeline Value by Phase</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Expected ROI Distribution</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="h-72 w-full z-10 relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val: any) => [`$${val.toLocaleString()}`, 'Total ROI']}
              />
              <Bar dataKey="roi" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right Col - Velocity Chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-amber-500/10" />
        <div className="flex items-center justify-between mb-8 z-10 relative">
          <div>
            <h2 className="text-xl font-black text-slate-900">Delivery Velocity</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Use Case Status Breakdown</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
            <Rocket className="w-5 h-5" />
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
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 z-10 relative">
          {velocityData.map((entry) => (
            <div key={entry.name} className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-black text-slate-500">{entry.name}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] }} />
                <span className="text-lg font-black text-slate-900">{entry.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Track - Top Initiatives */}
      <div className="lg:col-span-3 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm relative group overflow-hidden">
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900">Top Initiatives</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Highest value AI use cases across the portfolio</p>
          </div>
          <Sparkles className="w-5 h-5 text-emerald-500" />
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Initiative Name</th>
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Client</th>
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Department</th>
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status / Phase</th>
                <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right pr-2">Est. ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topInitiatives.map((uc: any) => (
                <tr key={uc.id} className="group/row hover:bg-emerald-50/50 transition-colors">
                  <td className="py-4 pl-2">
                    <div className="font-bold text-slate-900 group-hover/row:text-emerald-700 transition-colors">{uc.title}</div>
                  </td>
                  <td className="py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                        <Building2 className="w-3 h-3 text-slate-500" />
                      </div>
                      <Link href={`/customers/${uc.customerId}`} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors truncate max-w-[120px]">
                        {uc.customer?.name}
                      </Link>
                    </div>
                  </td>
                  <td className="py-4 hidden sm:table-cell">
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{uc.department || 'N/A'}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[uc.status as keyof typeof STATUS_COLORS] }} />
                      <span className="text-xs font-black text-slate-600 uppercase tracking-wider">{uc.status}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase">Ph {uc.phase}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-2 text-right">
                    <span className="text-[15px] font-black text-slate-900">${(uc.roiEstimate || 0).toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {topInitiatives.length === 0 && (
            <div className="py-12 text-center text-slate-400 font-medium">No use cases logged yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
