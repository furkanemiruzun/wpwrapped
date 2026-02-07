import { motion } from 'framer-motion';
import { X, ShieldCheck, Lock, ServerOff, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PrivacyModal({ onClose }) {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-secondary/90 border border-white/10 backdrop-blur-xl p-8 rounded-2xl max-w-lg w-full shadow-2xl relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-cta/20 rounded-xl text-cta">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold">{t('privacy_title')}</h2>
                </div>

                <p className="text-muted mb-8 text-lg leading-relaxed">
                    {t('privacy_intro')}
                </p>

                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="mt-1 text-blue-400">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-white mb-1">{t('privacy_p1_title')}</h3>
                            <p className="text-muted text-sm leading-relaxed">{t('privacy_p1_desc')}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="mt-1 text-purple-400">
                            <ServerOff size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-white mb-1">{t('privacy_p2_title')}</h3>
                            <p className="text-muted text-sm leading-relaxed">{t('privacy_p2_desc')}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="mt-1 text-red-400">
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-white mb-1">{t('privacy_p3_title')}</h3>
                            <p className="text-muted text-sm leading-relaxed">{t('privacy_p3_desc')}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-10 py-3 rounded-xl bg-cta hover:bg-emerald-600 text-white font-semibold transition-colors"
                >
                    {t('close')}
                </button>
            </motion.div>
        </div>
    );
}
