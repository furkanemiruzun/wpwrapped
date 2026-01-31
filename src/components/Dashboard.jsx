import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid
} from 'recharts';
import { MessageSquare, Users, Calendar, Clock, Smile, Type, ChevronLeft, ChevronRight } from 'lucide-react';
import PersonaCard from './PersonaCard';
import ResponseTimeChart from './ResponseTimeChart';
import ConversationStarters from './ConversationStarters';
import ActivityHeatmap from './ActivityHeatmap';

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
    const [currentPersonaIndex, setCurrentPersonaIndex] = useState(0);

    const personas = useMemo(() => {
        return stats.personas ? Object.entries(stats.personas) : [];
    }, [stats.personas]);

    const nextPersona = () => {
        setCurrentPersonaIndex((prev) => (prev + 1) % personas.length);
    };

    const prevPersona = () => {
        setCurrentPersonaIndex((prev) => (prev - 1 + personas.length) % personas.length);
    };

    const timelineData = useMemo(() => {
        return stats.timeline;
    }, [stats.timeline]);

    const hourlyData = useMemo(() => stats.hourly.map(h => ({ ...h, hour: `${h.hour}:00` })), [stats.hourly]);

    const userPieData = useMemo(() =>
        Object.entries(stats.userStats).map(([name, data]) => ({ name, value: data.count })),
        [stats.userStats]
    );

    return (
        <div className="space-y-6 animate-fade-in pb-20">

            {/* TOP SECTION: PERSONA & HOURLY ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* LEFT: PERSONA CARDS SLIDER */}
                {personas.length > 0 && (
                    <GlassCard className="relative w-full group h-[400px] overflow-hidden">
                        <div className="h-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentPersonaIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full"
                                >
                                    <PersonaCard
                                        user={personas[currentPersonaIndex][0]}
                                        data={personas[currentPersonaIndex][1]}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation Buttons */}
                        {personas.length > 1 && (
                            <>
                                <button
                                    onClick={prevPersona}
                                    className="absolute top-1/2 left-2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextPersona}
                                    className="absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                                >
                                    <ChevronRight size={24} />
                                </button>

                                {/* Dots Indicator */}
                                <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-10">
                                    {personas.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentPersonaIndex(idx)}
                                            className={`w-2 h-2 rounded-full transition-all shadow-sm ${idx === currentPersonaIndex ? 'bg-cta w-4' : 'bg-white/30'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </GlassCard>
                )}

                {/* RIGHT: HOURLY ACTIVITY */}
                <GlassCard delay={0.5} className="h-[400px]">
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="text-blue-400" size={20} />
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                            {t('busiest_times')}
                        </h2>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                                <Bar dataKey="count" name={t('message_count')} fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Messages */}
                <GlassCard delay={0.1} className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />

                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform duration-300">
                                <MessageSquare size={28} className="text-emerald-400" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 mb-1">
                                {stats.totalMessages.toLocaleString()}
                            </h3>
                            <p className="text-sm font-medium text-emerald-100/60 uppercase tracking-widest pl-1">
                                {t('total_messages')}
                            </p>
                        </div>
                    </div>
                </GlassCard>

                {/* Active Users */}
                <GlassCard delay={0.2} className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />

                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:scale-110 transition-transform duration-300">
                                <Users size={28} className="text-blue-400" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-300 mb-1">
                                {stats.users.length}
                            </h3>
                            <p className="text-sm font-medium text-blue-100/60 uppercase tracking-widest pl-1">
                                {t('active_users')}
                            </p>
                        </div>
                    </div>
                </GlassCard>

                {/* Total Days */}
                <GlassCard delay={0.3} className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500" />

                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:scale-110 transition-transform duration-300">
                                <Calendar size={28} className="text-purple-400" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-300 mb-1">
                                {stats.timeline.length}
                            </h3>
                            <p className="text-sm font-medium text-purple-100/60 uppercase tracking-widest pl-1">
                                {t('total_days')}
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Main Activity Chart (Timeline) */}
            <GlassCard delay={0.4} className="h-[400px]">
                <div className="flex items-center gap-2 mb-6">
                    <Calendar className="text-cta" size={20} />
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cta via-emerald-300 to-teal-400">
                        {t('message_history')}
                    </h2>
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
                            <Area type="monotone" dataKey="count" name={t('message_count')} stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* User Distribution (Pie Chart) */}
                <GlassCard delay={0.6} className="h-[350px]">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="text-purple-400" size={20} />
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-400">
                            {t('who_talks_most')}
                        </h2>
                    </div>
                    <div className="flex flex-col md:flex-row h-full md:h-[80%] gap-4 md:gap-0">
                        <ResponsiveContainer width="100%" height={200} className="md:w-[60%] md:h-full min-h-[200px]">
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
                        <div className="flex flex-col justify-center gap-2 text-sm w-full md:w-[40%] pl-2 md:pl-0">
                            {userPieData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="truncate flex-1">{entry.name}</span>
                                    <span className="text-muted">{(entry.value / stats.totalMessages * 100).toFixed(0)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassCard>

                {/* Top Words */}
                <GlassCard delay={0.7} className="h-[350px] overflow-hidden">
                    <div className="flex items-center gap-2 mb-6">
                        <Type className="text-yellow-400" size={20} />
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400">
                            {t('most_used_words')}
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
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
            </div>

            {/* Top Emojis & First Messages Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Emojis */}
                <GlassCard delay={0.8} className="max-h-[500px] overflow-hidden">
                    <div className="flex items-center gap-2 mb-6">
                        <Smile className="text-pink-400" size={20} />
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-300 to-red-400">
                            {t('emoji_addiction')}
                        </h2>
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

                {/* First Messages */}
                {stats.firstMessages && stats.firstMessages.length > 0 && (
                    <GlassCard delay={0.9} className="relative overflow-hidden max-h-[500px]">
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cta to-emerald-700 flex items-center justify-center text-white shadow-lg">
                                <span className="text-xl">🌱</span>
                            </div>
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-300 to-teal-200">
                                {t('how_it_started')}
                            </h3>
                        </div>

                        <div className="space-y-4 relative z-10 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
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

            {/* NEW METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ResponseTimeChart data={stats.responseTimes} />
                </div>
                <div className="lg:col-span-1">
                    <ConversationStarters data={stats.conversationStarters} />
                </div>
                <div className="lg:col-span-1 md:col-span-2">
                    <ActivityHeatmap data={stats.dailyActivity} />
                </div>
            </div>
        </div>
    );
}
