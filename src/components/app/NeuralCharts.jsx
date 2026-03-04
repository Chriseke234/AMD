"use client"

import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from "recharts"

const data = [
    { name: "00:00", value: 40 },
    { name: "04:00", value: 30 },
    { name: "08:00", value: 65 },
    { name: "12:00", value: 45 },
    { name: "16:00", value: 90 },
    { name: "20:00", value: 70 },
    { name: "23:59", value: 85 },
]

export function NeuralActivityChart() {
    return (
        <div className="w-full h-[120px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#7c3aed" stopOpacity={0} />
                            <stop offset="50%" stopColor="#7c3aed" stopOpacity={1} />
                            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="url(#lineGradient)"
                        strokeWidth={4}
                        dot={false}
                        animationDuration={2000}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-background/80 backdrop-blur-md border border-border px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                        {payload[0].value}% Neural Load
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export function IntegritySparkline() {
    return (
        <div className="w-full h-[40px] absolute bottom-0 left-0 opacity-20 group-hover:opacity-40 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Line
                        type="stepAfter"
                        dataKey="value"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
