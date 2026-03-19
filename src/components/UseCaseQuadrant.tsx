'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { updateUseCaseMetrics } from '@/app/actions'

interface UCData {
    id: string
    title: string
    complexity: number | null
    value: number | null
    priority: string | null
    department: string | null
    status: string
}

interface Position { complexity: number; value: number }

const PRIORITY_DOT: Record<string, string> = {
    HIGH:   'bg-rose-500 border-rose-600',
    MEDIUM: 'bg-amber-400 border-amber-500',
    LOW:    'bg-slate-400 border-slate-500',
}

function abbrev(title: string): string {
    const words = title.trim().split(/\s+/)
    if (words.length === 1) return title.slice(0, 4)
    return words.slice(0, 3).map(w => w[0].toUpperCase()).join('')
}

const toXPct = (c: number) => ((c - 1) / 9) * 100
const toYPct = (v: number) => ((10 - v) / 9) * 100

function pixelToPos(px: number, py: number, w: number, h: number): Position {
    const c = Math.round(Math.max(0, Math.min(1, px / w)) * 9 + 1)
    const v = Math.round((1 - Math.max(0, Math.min(1, py / h))) * 9 + 1)
    return { complexity: c, value: v }
}

// Spread overlapping dots in a small circle so all are visible
const CLUSTER_RADIUS = 20 // px

function computeClusterOffsets(
    useCases: UCData[],
    positions: Record<string, Position>
): Map<string, { dx: number; dy: number }> {
    const groups = new Map<string, string[]>()
    for (const uc of useCases) {
        const pos = positions[uc.id] ?? { complexity: 3, value: 3 }
        const key = `${pos.complexity},${pos.value}`
        const existing = groups.get(key) ?? []
        existing.push(uc.id)
        groups.set(key, existing)
    }

    const offsets = new Map<string, { dx: number; dy: number }>()
    for (const ids of groups.values()) {
        if (ids.length === 1) {
            offsets.set(ids[0], { dx: 0, dy: 0 })
        } else {
            ids.forEach((id, i) => {
                // Start from top (−π/2) and distribute evenly around the circle
                const angle = (2 * Math.PI * i) / ids.length - Math.PI / 2
                offsets.set(id, {
                    dx: Math.round(CLUSTER_RADIUS * Math.cos(angle)),
                    dy: Math.round(CLUSTER_RADIUS * Math.sin(angle)),
                })
            })
        }
    }
    return offsets
}

export default function UseCaseQuadrant({
    useCases,
    customerId,
}: {
    useCases: UCData[]
    customerId: string
}) {
    const containerRef = useRef<HTMLDivElement>(null)

    const [positions, setPositions] = useState<Record<string, Position>>(() =>
        Object.fromEntries(useCases.map(uc => [uc.id, {
            complexity: uc.complexity ?? 3,
            value: uc.value ?? 3,
        }]))
    )

    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [draggingId, setDraggingId] = useState<string | null>(null)

    const dragRef = useRef<{
        id: string
        startMouseX: number
        startMouseY: number
        startDotPxX: number
        startDotPxY: number
    } | null>(null)
    const latestPosRef = useRef<Position | null>(null)

    // Recompute cluster offsets whenever positions change (live during drag)
    const dotOffsets = useMemo(
        () => computeClusterOffsets(useCases, positions),
        [useCases, positions]
    )

    // Sync positions on prop change (after server revalidation), skip the item being dragged
    useEffect(() => {
        setPositions(prev => {
            const next = { ...prev }
            for (const uc of useCases) {
                if (draggingId !== uc.id) {
                    next[uc.id] = { complexity: uc.complexity ?? 3, value: uc.value ?? 3 }
                }
            }
            return next
        })
    }, [useCases]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!dragRef.current || !containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const { id, startMouseX, startMouseY, startDotPxX, startDotPxY } = dragRef.current
            const rawPx = startDotPxX + (e.clientX - startMouseX)
            const rawPy = startDotPxY + (e.clientY - startMouseY)
            const pos = pixelToPos(rawPx, rawPy, rect.width, rect.height)
            latestPosRef.current = pos
            setPositions(prev => ({ ...prev, [id]: pos }))
        }

        const onUp = async () => {
            if (!dragRef.current) return
            const { id } = dragRef.current
            const pos = latestPosRef.current
            dragRef.current = null
            latestPosRef.current = null
            setDraggingId(null)
            if (pos) {
                await updateUseCaseMetrics(id, customerId, pos.complexity, pos.value)
            }
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
        }
    }, [customerId])

    const handleMouseDown = (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        const pos = positions[id]
        // Drag from the base grid position (cluster offset is display-only)
        dragRef.current = {
            id,
            startMouseX: e.clientX,
            startMouseY: e.clientY,
            startDotPxX: toXPct(pos.complexity) / 100 * rect.width,
            startDotPxY: toYPct(pos.value) / 100 * rect.height,
        }
        latestPosRef.current = { ...pos }
        setDraggingId(id)
    }

    if (useCases.length === 0) return null

    return (
        <div className="space-y-3 select-none">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Initiative Quadrant</h3>
                <p className="text-[11px] text-slate-400 italic">Drag use cases to update complexity &amp; value</p>
            </div>

            <div className="flex gap-2 items-stretch">
                {/* Y-axis label */}
                <div className="flex items-center justify-center w-4 shrink-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
                        Value ↑
                    </span>
                </div>

                {/* Y-axis ticks */}
                <div className="flex flex-col justify-between shrink-0 py-1" style={{ height: 360 }}>
                    {[5, 4, 3, 2, 1].map(n => (
                        <span key={n} className="text-[10px] font-bold text-slate-400 leading-none">{n}</span>
                    ))}
                </div>

                {/* Main quadrant */}
                <div className="flex-1 flex flex-col">
                    <div
                        ref={containerRef}
                        className="relative rounded-2xl overflow-hidden border border-slate-200"
                        style={{ height: 360 }}
                    >
                        {/* 2×2 quadrant backgrounds */}
                        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
                            <div className="bg-emerald-50 border-r border-b border-dashed border-emerald-200 relative">
                                <div className="absolute top-3 left-3">
                                    <p className="text-[11px] font-black text-emerald-600 uppercase tracking-wide leading-none">⭐ Quick Wins</p>
                                    <p className="text-[9px] text-emerald-500 mt-0.5">Low effort · High value</p>
                                </div>
                            </div>
                            <div className="bg-blue-50 border-l border-b border-dashed border-blue-200 relative">
                                <div className="absolute top-3 right-3 text-right">
                                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-wide leading-none">🎯 Strategic Bets</p>
                                    <p className="text-[9px] text-blue-500 mt-0.5">High effort · High value</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 border-r border-t border-dashed border-slate-200 relative">
                                <div className="absolute bottom-3 left-3">
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-wide leading-none">📌 Fill-ins</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5">Low effort · Low value</p>
                                </div>
                            </div>
                            <div className="bg-amber-50 border-l border-t border-dashed border-amber-200 relative">
                                <div className="absolute bottom-3 right-3 text-right">
                                    <p className="text-[11px] font-black text-amber-600 uppercase tracking-wide leading-none">⚠️ Reconsider</p>
                                    <p className="text-[9px] text-amber-500 mt-0.5">High effort · Low value</p>
                                </div>
                            </div>
                        </div>

                        {/* Use case dots — cluster-spread when overlapping */}
                        {useCases.map(uc => {
                            const pos = positions[uc.id] ?? { complexity: 3, value: 3 }
                            const isDragging = draggingId === uc.id
                            const isHovered = hoveredId === uc.id
                            const dotColor = PRIORITY_DOT[uc.priority ?? 'LOW'] ?? PRIORITY_DOT.LOW
                            // Drop cluster offset while dragging so movement feels direct
                            const { dx, dy } = isDragging
                                ? { dx: 0, dy: 0 }
                                : (dotOffsets.get(uc.id) ?? { dx: 0, dy: 0 })

                            return (
                                <div
                                    key={uc.id}
                                    onMouseDown={e => handleMouseDown(e, uc.id)}
                                    onMouseEnter={() => setHoveredId(uc.id)}
                                    onMouseLeave={() => !isDragging && setHoveredId(null)}
                                    className={`absolute w-11 h-11 rounded-full border-2 flex items-center justify-center
                                        text-white cursor-grab z-10
                                        ${dotColor}
                                        ${isDragging ? 'cursor-grabbing scale-125 shadow-xl z-20 ring-2 ring-white ring-offset-1' : 'hover:scale-110 hover:shadow-lg'}
                                    `}
                                    style={{
                                        left: `${toXPct(pos.complexity)}%`,
                                        top: `${toYPct(pos.value)}%`,
                                        transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`,
                                        transition: isDragging
                                            ? 'transform 0.1s ease, box-shadow 0.1s ease'
                                            : 'left 0s, top 0s, transform 0.2s ease, box-shadow 0.15s ease',
                                    }}
                                >
                                    <span className="text-[10px] font-black leading-none tracking-tight">{abbrev(uc.title)}</span>

                                    {/* Tooltip */}
                                    {(isHovered || isDragging) && (
                                        <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none whitespace-nowrap">
                                            <div className="bg-slate-900 text-white rounded-xl px-3 py-2.5 shadow-2xl text-left">
                                                <p className="text-xs font-bold mb-1.5 max-w-[160px] truncate">{uc.title}</p>
                                                <div className="flex gap-3 text-[11px]">
                                                    <span className="text-slate-400">Complexity <b className="text-white">{pos.complexity}/10</b></span>
                                                    <span className="text-slate-400">Value <b className="text-white">{pos.value}/10</b></span>
                                                </div>
                                                {uc.department && (
                                                    <p className="text-[10px] text-slate-500 mt-1">{uc.department}</p>
                                                )}
                                            </div>
                                            <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 mx-auto -mt-1.5 rounded-sm" />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* X-axis ticks */}
                    <div className="flex justify-between px-1 mt-1.5">
                        {[1, 2, 3, 4, 5].map(n => (
                            <span key={n} className="text-[10px] font-bold text-slate-400">{n}</span>
                        ))}
                    </div>
                    <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                        Complexity →
                    </p>
                </div>
            </div>

            {/* Priority legend */}
            <div className="flex items-center gap-5 pt-1">
                {[
                    { label: 'High Priority',   cls: 'bg-rose-500'  },
                    { label: 'Medium Priority', cls: 'bg-amber-400' },
                    { label: 'Low Priority',    cls: 'bg-slate-400' },
                ].map(({ label, cls }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-full ${cls}`} />
                        <span className="text-[10px] font-semibold text-slate-500">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
