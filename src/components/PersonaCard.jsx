import { motion } from 'framer-motion';
import { ScanFace } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PersonaCard({ user, data }) {
  const { t } = useTranslation();
  if (!data) return null;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
          <ScanFace className="text-purple-400" size={20} />
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300">
            Karakter Analizi
          </h2>
        </div>

        <div className="mb-4">
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
            {t(data.title)} {data.icon}
          </h4>

          <p className="text-muted text-sm leading-relaxed px-4">
            {t(data.description)}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-muted">
          <span>{t('avg_words')}: {Math.round(data.stats.avgWords)}</span>
          <span>{t('night')}: {Math.round(data.stats.nightRatio * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
