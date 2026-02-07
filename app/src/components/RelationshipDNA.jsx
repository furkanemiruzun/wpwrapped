import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { GlassCard } from './ui/GlassCard';
import { Fingerprint, Laugh, Image as ImageIcon, Moon, Heart, ShieldCheck } from 'lucide-react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

export default function RelationshipDNA({ dna }) {
    const { t } = useTranslation();
    if (!dna || dna.length === 0) return null;

    // For visual consistency, we'll show the DNA of the first two users or average?
    // Let's show a toggle or just the first user for simplicity in this specific card, 
    // or a multi-radar. Let's do a multi-radar if 2 users, or just one.

    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

    const chartData = [
        { subject: t('dna_laughter'), icon: <Laugh size={14} /> },
        { subject: t('dna_media'), icon: <ImageIcon size={14} /> },
        { subject: t('dna_night'), icon: <Moon size={14} /> },
        { subject: t('dna_empathy'), icon: <Heart size={14} /> },
        { subject: t('dna_consistency'), icon: <ShieldCheck size={14} /> },
    ].map(item => {
        const entry = { subject: item.subject };
        dna.forEach((userDna, idx) => {
            const key = `user${idx}`;
            if (item.subject === t('dna_laughter')) entry[key] = userDna.laughter;
            if (item.subject === t('dna_media')) entry[key] = userDna.media;
            if (item.subject === t('dna_night')) entry[key] = userDna.night;
            if (item.subject === t('dna_empathy')) entry[key] = userDna.empathy;
            if (item.subject === t('dna_consistency')) entry[key] = userDna.consistency;
        });
        return entry;
    });

    return (
        <GlassCard className="h-full min-h-[400px] flex flex-col group overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
                <Fingerprint className="text-emerald-400" size={20} />
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                    {t('relationship_dna')}
                </h2>
            </div>

            <div className="flex-1 w-full min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#ffffff10" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

                        {dna.map((userDna, idx) => (
                            <Radar
                                key={userDna.user}
                                name={userDna.user}
                                dataKey={`user${idx}`}
                                stroke={COLORS[idx % COLORS.length]}
                                fill={COLORS[idx % COLORS.length]}
                                fillOpacity={0.3}
                            />
                        ))}
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 justify-center">
                {dna.map((userDna, idx) => (
                    <div key={userDna.user} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-xs font-medium">{userDna.user}: <span className="text-emerald-400">{userDna.vibe}</span></span>
                    </div>
                ))}
            </div>

            {/* Decorative pulse */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700" />
        </GlassCard>
    );
}
