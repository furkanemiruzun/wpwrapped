import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Share2, Download, Flame, Fingerprint } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PersonaCard from './PersonaCard';
import RelationshipDNA from './RelationshipDNA';
import { GlassCard } from './ui/GlassCard';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function StoryMode({ stats, onClose }) {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Story Slides Configuration
    const slides = [
        // 1. Intro Slide
        {
            id: 'intro',
            render: () => (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-8 p-6 bg-cta/20 rounded-full text-cta"
                    >
                        <span className="text-6xl">🎉</span>
                    </motion.div>
                    <h2 className="text-4xl font-bold mb-4">Sohbetiniz Hazır!</h2>
                    <p className="text-xl text-muted">Birlikte tam</p>
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cta to-blue-500 my-4">
                        {stats.totalMessages.toLocaleString()}
                    </h1>
                    <p className="text-xl text-muted">mesajlaştınız.</p>
                </div>
            )
        },
        // 2. Personas (Dynamic for each user)
        ...Object.entries(stats.personas).map(([user, data]) => ({
            id: `persona-${user}`,
            render: () => (
                <div className="flex flex-col items-center justify-center h-full p-6">
                    <h3 className="text-2xl font-bold mb-8 text-muted uppercase tracking-widest">Karakter Analizi</h3>
                    <div className="w-full max-w-md">
                        <PersonaCard user={user} data={data} />
                    </div>
                </div>
            )
        })),
        // 2b. Relationship DNA
        {
            id: 'dna',
            render: () => (
                <div className="flex flex-col items-center justify-center h-full p-6">
                    <h3 className="text-3xl font-bold mb-8">Sohbet DNA'nız 🧬</h3>
                    <div className="w-full max-w-md h-[450px]">
                        <RelationshipDNA dna={stats.relationshipDNA} />
                    </div>
                </div>
            )
        },
        // 3. User Distribution
        {
            id: 'distribution',
            render: () => (
                <div className="flex flex-col items-center justify-center h-full p-6">
                    <h3 className="text-3xl font-bold mb-8">Kim Daha Çok Konuştu? 🗣️</h3>
                    <div className="h-64 w-full max-w-md">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={Object.entries(stats.userStats).map(([name, d]) => ({ name, value: d.count }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {Object.entries(stats.userStats).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#000000cc', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
                        {Object.entries(stats.userStats).map(([name, d], index) => (
                            <div key={name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="font-bold">{name}</span>
                                </div>
                                <span>{((d.count / stats.totalMessages) * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        // 4. Streaks Slide
        {
            id: 'streaks',
            render: () => (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mb-8 p-6 bg-orange-500/20 rounded-full text-orange-500"
                    >
                        <Flame size={80} />
                    </motion.div>
                    <h3 className="text-3xl font-bold mb-4">{t('best_streak')}</h3>
                    <h1 className="text-7xl font-black text-orange-400 mb-6">
                        {stats.streaks.max} {t('days')}
                    </h1>
                    <p className="text-xl text-muted max-w-sm">
                        {t('streak_congrats', { days: stats.streaks.max })}
                    </p>
                </div>
            )
        },
        // 5. Response Times (Ghosting) Slide
        {
            id: 'response-times',
            render: () => (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <h3 className="text-3xl font-bold mb-10">Kimin Parmağı Daha Hızlı? ⚡</h3>
                    <div className="w-full max-w-md space-y-6">
                        {stats.responseTimes.slice(0, 3).map((rs, idx) => (
                            <motion.div
                                key={rs.user}
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.2 }}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-yellow-500 text-black' : 'bg-white/10'}`}>
                                        {idx + 1}
                                    </div>
                                    <span className="font-bold text-lg">{rs.user}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-mono text-xl text-emerald-400">{rs.avgTimeMinutes.toFixed(1)} {t('minutes')}</span>
                                    <span className="text-xs text-muted uppercase">{t('fastest_responder')}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )
        },
        // 6. Top Emojis
        {
            id: 'emojis',
            render: () => (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <h3 className="text-3xl font-bold mb-2">En Sevdiğiniz Emojiler</h3>
                    <p className="text-muted mb-8">Duygularınızı böyle ifade ettiniz</p>

                    <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                        {stats.emojiStats.slice(0, 6).map((emoji, index) => (
                            <motion.div
                                key={emoji.emoji}
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                                className="aspect-square flex flex-col items-center justify-center bg-white/10 rounded-2xl p-4 border border-white/5"
                            >
                                <span className="text-5xl mb-2">{emoji.emoji}</span>
                                <span className="text-xs text-muted font-mono">{emoji.count}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )
        },
        // 7. Hourly Activity (Night Owl Check)
        {
            id: 'hourly',
            render: () => (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <h3 className="text-3xl font-bold mb-8">En Aktif Saatleriniz ⏰</h3>
                    <div className="w-full h-64 max-w-lg">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.hourly.map(h => ({ ...h, hour: `${h.hour}:00` }))}>
                                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 4, 4]} />
                                <RechartsTooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#000000cc', border: 'none', borderRadius: '8px' }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="mt-6 text-muted max-w-md">
                        Günün hangi saatlerinde konuşmayı seviyorsunuz? Grafiğe bakılırsa {
                            (stats.hourly && stats.hourly.length > 0) ? (
                                parseInt(stats.hourly.sort((a, b) => b.count - a.count)[0]?.hour) >= 22 ||
                                    parseInt(stats.hourly.sort((a, b) => b.count - a.count)[0]?.hour) < 5
                                    ? "geceleri uyumuyorsunuz! 🦉"
                                    : "gündüz insanısınız. ☀️"
                            ) : "veriler işleniyor... 🕒"
                        }
                    </p>
                </div>
            )
        },
        // 8. Outro
        {
            id: 'outro',
            render: () => (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <h2 className="text-4xl font-bold mb-6">İşte Hikayeniz!</h2>
                    <p className="text-lg text-muted mb-10 max-w-md">
                        Sohbetinizde binlerce anı, duygu ve kelime saklı.
                    </p>

                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <button onClick={onClose} className="py-4 bg-cta hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-cta/20 flex items-center justify-center gap-2">
                            Detaylı Raporu Gör
                        </button>
                        <button
                            className="py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                            onClick={() => {
                                const element = document.getElementById('story-content');
                                if (element) {
                                    import('html-to-image').then(lib => {
                                        lib.toPng(element).then(dataUrl => {
                                            const link = document.createElement('a');
                                            link.download = 'chatwrapp-story.png';
                                            link.href = dataUrl;
                                            link.click();
                                        });
                                    });
                                }
                            }}
                        >
                            <Share2 size={20} />
                            Sonucu Resim Olarak Kaydet
                        </button>
                    </div>
                </div>
            )
        }
    ];

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            onClose(); // End of story
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide, slides.length]); // Added slides.length for safety

    return (
        <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col items-center justify-center backdrop-blur-xl select-none">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-[60]"
            >
                <X size={24} />
            </button>

            {/* Progress Bars */}
            <div className="absolute top-0 left-0 w-full flex gap-1 p-2 z-50">
                {slides.map((_, index) => (
                    <div key={index} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: index <= currentSlide ? "100%" : "0%" }}
                            transition={{ duration: 0.3 }}
                            className={`h-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Areas (Improved) */}
            <div
                className="absolute inset-y-0 left-0 w-1/4 z-50 cursor-w-resize"
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            />
            <div
                className="absolute inset-y-0 right-0 w-3/4 z-50 cursor-e-resize"
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            />

            {/* Slide Content */}
            <div id="story-content" className="w-full h-full max-w-2xl mx-auto relative z-30 flex flex-col bg-black pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slides[currentSlide]?.id || currentSlide}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                        className="flex-1 w-full h-full"
                    >
                        {slides[currentSlide]?.render ? slides[currentSlide].render() : null}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Mobile Navigation Hints */}
            <div className="absolute bottom-10 w-full flex justify-between px-8 text-white/20 pointer-events-none">
                <div className="flex items-center gap-1"><ChevronLeft size={16} /> Geri</div>
                <div className="flex items-center gap-1">İleri <ChevronRight size={16} /></div>
            </div>
        </div>
    );
}
