'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, CheckCircle, Settings, BarChart2, CheckSquare } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Action Plan', href: '/action-plan', icon: CheckSquare },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Assessments', href: '/assessments', icon: CheckCircle },
    { name: 'Use Cases', href: '/use-cases', icon: FileText },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar({ className, pendingCount = 0 }: { className?: string; pendingCount?: number }) {
    const pathname = usePathname()

    return (
        <div className={cn('h-full flex flex-col pt-8 pb-4', className)}>
            <div className="px-6 mb-10 flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    AI
                </div>
                <div className="font-semibold text-xl tracking-tight text-slate-900 leading-tight">
                    UniSystems <br />
                    <span className="text-sm font-normal text-slate-500">Consulting Platform</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-3">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`) && item.href !== '/'
                    const Icon = item.icon
                    const showBadge = item.href === '/action-plan' && pendingCount > 0

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                                isActive
                                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            )}
                        >
                            <Icon
                                className={cn(
                                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                                )}
                                aria-hidden="true"
                            />
                            <span className="flex-1">{item.name}</span>
                            {showBadge && (
                                <span className="ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-[10px] font-bold bg-red-500 text-white">
                                    {pendingCount > 99 ? '99+' : pendingCount}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="px-6 mt-auto">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <p className="text-xs text-slate-600 font-medium mb-1">MVP Version 1.0</p>
                    <p className="text-[10px] text-slate-500">Connected to Local SQLite Database.</p>
                </div>
            </div>
        </div>
    )
}
