import { GlassCard } from './ui/GlassCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ResponseTimeChart({ data }) {
    const { t } = useTranslation();
    if (!data || data.length === 0) return null;

    const chartHeight = Math.max(250, data.length * 40);

    return (
        <GlassCard className="h-full max-h-[450px] flex flex-col">
            <div className="flex-shrink-0 flex items-center gap-2 mb-4">
                <Timer className="text-orange-400" size={20} />
                <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-200">
                    {t('response_time_title')}
                </h2>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 -mr-2">
                <div className="w-full overflow-x-visible" style={{ height: chartHeight }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
                            <defs>
                                <linearGradient id="barGradientBest" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#34D399" />
                                </linearGradient>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="100%" stopColor="#60A5FA" />
                                </linearGradient>
                            </defs>
                            <XAxis
                                type="number"
                                stroke="#94a3b8"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `${val}m`}
                            />
                            <YAxis
                                dataKey="user"
                                type="category"
                                stroke="#fff"
                                fontSize={11}
                                fontWeight={500}
                                tickLine={false}
                                axisLine={false}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 4 }}
                                contentStyle={{
                                    backgroundColor: '#1a1a1a',
                                    borderColor: '#ffffff20',
                                    color: '#fff',
                                    borderRadius: '12px',
                                    padding: '8px 12px',
                                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                                }}
                                itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}
                                labelStyle={{ color: '#9ca3af', fontSize: '11px', marginBottom: '4px' }}
                                formatter={(value) => [`${Math.round(value)} ${t('minutes')}`, t('response_time_title')]}
                            />
                            <Bar
                                dataKey="avgTimeMinutes"
                                radius={[0, 6, 6, 0]}
                                barSize={20}
                                animationDuration={1000}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === 0 ? "url(#barGradientBest)" : "url(#barGradient)"}
                                        style={{
                                            filter: index === 0 ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))' : 'none'
                                        }}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </GlassCard>
    );
}
