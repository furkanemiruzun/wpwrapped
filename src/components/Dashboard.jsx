import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from './ui/GlassCard';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid
} from 'recharts';
import { MessageSquare, Users, Calendar, Clock, Smile, Type } from 'lucide-react';

const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl text-text text-sm">
                <p className="font-semibold mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {entry.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function Dashboard({ stats }) {
    const { t } = useTranslation();

    const timelineData = useMemo(() => {
        // Basic fix for timeline sorting if needed, usually file order is enough
        return stats.timeline;
    }, [stats.timeline]);

    const hourlyData = useMemo(() => stats.hourly.map(h => ({ ...h, hour: `${h.hour}:00` })), [stats.hourly]);

    const userPieData = useMemo(() =>
        Object.entries(stats.userStats).map(([name, data]) => ({ name, value: data.count })),
        [stats.userStats]
    );

    return (
        <div className="space-y-6 animate-fade-in pb-20">

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard delay={0.1} className="flex items-center gap-4">
                    <div className="p-3 bg-cta/20 rounded-xl text-cta">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <p className="text-muted text-sm">{t('total_messages')}</p>
                        <h3 className="text-3xl font-bold">{stats.totalMessages.toLocaleString()}</h3>
                    </div>
                </GlassCard>

                <GlassCard delay={0.2} className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-muted text-sm">{t('active_users')}</p>
                        <h3 className="text-3xl font-bold">{stats.users.length}</h3>
                    </div>
                </GlassCard>

                <GlassCard delay={0.3} className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-muted text-sm">{t('total_days')}</p>
                        <h3 className="text-3xl font-bold">{stats.timeline.length}</h3>
                    </div>
                </GlassCard>
            </div>

            {/* Main Activity Chart */}
            <GlassCard delay={0.4} className="h-[400px]">
                <div className="flex items-center gap-2 mb-6">
                    <Calendar className="text-cta" size={20} />
                    <h2 className="text-xl font-semibold">{t('message_history')}</h2>
                </div>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timelineData}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} minTickGap={50} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="count" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hourly Activity */}
                <GlassCard delay={0.5} className="h-[350px]">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="text-blue-400" size={20} />
                        <h2 className="text-xl font-semibold">{t('busiest_times')}</h2>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* User Distribution */}
                <GlassCard delay={0.6} className="h-[350px]">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="text-purple-400" size={20} />
                        <h2 className="text-xl font-semibold">{t('who_talks_most')}</h2>
                    </div>
                    <div className="flex h-[80%]">
                        <ResponsiveContainer width="60%" height="100%">
                            <PieChart>
                                <Pie
                                    data={userPieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {userPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-col justify-center gap-2 text-sm w-[40%]">
                            {userPieData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="truncate">{entry.name}</span>
                                    <span className="text-muted ml-auto">{(entry.value / stats.totalMessages * 100).toFixed(0)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Words */}
                <GlassCard delay={0.7} className="max-h-[500px] overflow-hidden">
                    <div className="flex items-center gap-2 mb-6">
                        <Type className="text-yellow-400" size={20} />
                        <h2 className="text-xl font-semibold">{t('most_used_words')}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                        {stats.topWords.slice(0, 40).map((word, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm hover:bg-cta/20 transition-colors"
                                style={{ fontSize: Math.max(0.8, 1 + (40 - i) / 40) + 'rem', opacity: Math.max(0.5, (40 - i) / 40) }}
                            >
                                {word.text} <span className="text-xs text-muted ml-1">{word.value}</span>
                            </span>
                        ))}
                    </div>
                </GlassCard>

                {/* Top Emojis */}
                <GlassCard delay={0.8} className="max-h-[500px] overflow-hidden">
                    <div className="flex items-center gap-2 mb-6">
                        <Smile className="text-pink-400" size={20} />
                        <h2 className="text-xl font-semibold">{t('emoji_addiction')}</h2>
                    </div>
                    <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                        {stats.emojiStats.map((emoji, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">{emoji.emoji}</span>
                                    <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-pink-500"
                                            style={{ width: `${(emoji.count / stats.emojiStats[0].count) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="font-mono text-sm">{emoji.count}</span>
                            </div>
                        ))}
                        {stats.emojiStats.length === 0 && (
                            <p className="text-muted text-center py-10">{t('no_emojis')}</p>
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* First Messages */}
            {stats.firstMessages && stats.firstMessages.length > 0 && (
                <GlassCard delay={0.9} className="relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cta to-emerald-700 flex items-center justify-center text-white shadow-lg">
                            <span className="text-xl">🌱</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white">{t('how_it_started')}</h3>
                    </div>

                    <div className="space-y-4 relative z-10 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {stats.firstMessages.map((msg, i) => (
                            <div key={i} className="flex flex-col gap-1 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-cta text-sm">{msg.author}</span>
                                    <span className="text-xs text-muted">{msg.date} {msg.time}</span>
                                </div>
                                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
