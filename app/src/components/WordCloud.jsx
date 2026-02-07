import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Type } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

export default function WordCloud({ words }) {
    const { t } = useTranslation();

    // Take top 30 words and normalize their sizes
    const displayWords = words.slice(0, 30);
    const maxCount = displayWords[0]?.value || 1;

    return (
        <GlassCard delay={0.7} className="h-[400px] overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <Type className="text-yellow-400" size={20} />
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400">
                    {t('most_used_words')}
                </h2>
            </div>

            <div className="flex-1 relative flex flex-wrap items-center justify-center gap-x-6 gap-y-2 p-4 overflow-hidden">
                {displayWords.map((word, i) => {
                    const size = Math.max(0.8, (word.value / maxCount) * 2.5 + 0.5);
                    const opacity = Math.max(0.4, (word.value / maxCount));

                    return (
                        <motion.span
                            key={word.text}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: opacity, scale: 1 }}
                            whileHover={{ scale: 1.2, opacity: 1, color: '#F59E0B' }}
                            transition={{
                                delay: i * 0.05,
                                type: "spring",
                                stiffness: 200,
                                damping: 15
                            }}
                            className="cursor-default select-none font-bold"
                            style={{
                                fontSize: `${size}rem`,
                                color: i % 2 === 0 ? '#ffffff' : '#94a3b8'
                            }}
                        >
                            {word.text}
                        </motion.span>
                    );
                })}

                {/* Visual Flair: Floating background elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1],
                            rotate: [0, 90, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.05, 0.15, 0.05],
                            rotate: [0, -90, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, delay: 2 }}
                        className="absolute -bottom-10 -left-10 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl"
                    />
                </div>
            </div>
        </GlassCard>
    );
}
