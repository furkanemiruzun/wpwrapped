import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';

export default function PersonaCard({ user, data }) {
  if (!data) return null;

  return (
    <GlassCard className="p-6 relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-4">
          <div className="text-sm text-muted uppercase tracking-wider mb-1">Karakter Analizi</div>
          <h3 className="text-xl font-bold text-white truncate">{user}</h3>
        </div>

        <div className="flex-grow flex flex-col justify-center items-center text-center py-6">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-6xl mb-4 drop-shadow-lg"
          >
            {data.icon}
          </motion.div>
          
          <h4 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cta to-blue-400 mb-2">
            {data.title}
          </h4>
          
          <p className="text-muted text-sm leading-relaxed px-4">
            {data.description}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-muted">
          <span>Ort. Kelime: {Math.round(data.stats.avgWords)}</span>
          <span>Gece: {Math.round(data.stats.nightRatio * 100)}%</span>
        </div>
      </div>
    </GlassCard>
  );
}
