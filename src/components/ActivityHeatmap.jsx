import { useState, useMemo, useRef } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Activity, Calendar, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActivityHeatmap({ data }) {
    const { t } = useTranslation();
    const [focusedIndex, setFocusedIndex] = useState(null);
    const scrollContainerRef = useRef(null);

    // Calculate stats
    const stats = useMemo(() => {
        if (!data || data.length === 0) return { max: 0, total: 0, avg: 0 };
        const max = Math.max(...data.map(d => d.count));
        const total = data.reduce((a, b) => a + b.count, 0);
        return { max, total, avg: total / data.length };
    }, [data]);

    if (!data || data.length === 0) return null;

    // Get focused data or default to the busiest day or last day
    const activeData = useMemo(() => {
        if (focusedIndex !== null && data[focusedIndex]) {
            return data[focusedIndex];
        }
        return null;
    }, [focusedIndex, data]);

    return (
        <GlassCard className="h-full min-h-[400px] flex flex-col relative overflow-hidden group">

            {/* Header & HUD */}
            <div className="flex-shrink-0 flex items-start justify-between mb-2 z-20 relative">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Activity className="text-indigo-400" size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
                            {t('heatmap_title')}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-indigo-300/60 font-medium">
                            <span>{data.length} {t('days_tracked')}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span>{t('total_label')} {stats.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* HUD Panel - Dynamic Info */}
                <div className="flex flex-col items-end">
                    <AnimatePresence mode="wait">
                        {activeData ? (
                            <motion.div
                                key="active"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="text-right"
                            >
                                <div className="text-3xl font-black text-white leading-none mb-1">
                                    {activeData.count}
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1">
                                    {t('messages_label')}
                                </div>
                                <div className="text-xs text-gray-400 font-mono">
                                    {new Date(activeData.date).toLocaleDateString(i18n.language || 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="default"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="text-right"
                            >
                                <div className="flex items-center gap-2 mb-1 justify-end">
                                    <Trophy size={14} className="text-yellow-400" />
                                    <span className="text-xs text-yellow-100 font-bold">{t('best_day')}</span>
                                </div>
                                <div className="text-xl font-bold text-white mb-0.5">
                                    {stats.max}
                                </div>
                                <div className="text-[10px] text-gray-500">{t('peak_volume')}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Waveform Visualization */}
            <div
                ref={scrollContainerRef}
                className="flex-grow flex items-end gap-[2px] overflow-x-auto overflow-y-hidden custom-scrollbar pb-2 px-2 select-none"
                style={{ scrollBehavior: 'smooth' }}
            >
                {/* Spacer to center content if small, or start from left */}
                <div className="w-4 flex-shrink-0" />

                {data.map((day, index) => {
                    const intensity = day.count / (stats.max || 1);
                    // Base height: minimum 10%, scale rest based on intensity
                    const heightPercent = Math.max(5, intensity * 100);

                    const isFocused = focusedIndex === index;
                    // Check if neighbor (fisheye effect)
                    const isNeighbor = focusedIndex !== null && Math.abs(focusedIndex - index) === 1;

                    return (
                        <motion.div
                            key={index}
                            layoutId={`bar-${index}`} // Framer motion layout
                            className={`relative rounded-t-sm flex-shrink-0 transition-all duration-200 ease-out cursor-pointer group/bar`}
                            style={{
                                height: `${heightPercent}%`,
                                width: isFocused ? '24px' : isNeighbor ? '12px' : '4px', // Fisheye width
                                backgroundColor: isFocused ? '#fff' : isNeighbor ? '#67e8f9' : '#3b82f6', // White -> Cyan -> Blue
                                opacity: isFocused ? 1 : Math.max(0.3, intensity * 0.9),
                            }}
                            onMouseEnter={() => setFocusedIndex(index)}
                            onMouseLeave={() => setFocusedIndex(null)}
                        >
                            {/* Gradient Overlay for style */}
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 via-transparent to-transparent pointer-events-none"
                            />

                            {/* Reflection effect (pseudo) */}
                            <div
                                className="absolute top-full left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent transform scale-y-[-0.5] opacity-20 pointer-events-none"
                            />
                        </motion.div>
                    );
                })}
                <div className="w-4 flex-shrink-0" />
            </div>

            {/* Scroll Indication */}
            <div className="absolute bottom-1 left-0 right-0 flex justify-center text-[10px] text-white/10 pointer-events-none">
                {t('scroll_explore')}
            </div>

            {/* Background elements */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none -z-10" />

        </GlassCard>
    );
}
