import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from './ui/GlassCard';
import { Smartphone, Apple, CheckCircle2 } from 'lucide-react';

export default function GuideSection() {
    const { t } = useTranslation();
    const [os, setOs] = useState('android'); // 'android' | 'ios'

    return (
        <div className="max-w-3xl mx-auto mt-20 mb-20 animate-slide-up bg-black/20 rounded-3xl p-1 md:p-8 border border-white/5">
            <h2 className="text-3xl font-bold text-center mb-8">{t('how_to_export')}</h2>

            {/* Toggle */}
            <div className="flex justify-center mb-8">
                <div className="bg-white/5 p-1 rounded-full flex gap-1">
                    <button
                        onClick={() => setOs('android')}
                        className={`
                            flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 font-medium
                            ${os === 'android' ? 'bg-cta text-white shadow-lg' : 'text-muted hover:text-white hover:bg-white/5'}
                        `}
                    >
                        <Smartphone size={18} />
                        {t('android_tab')}
                    </button>
                    <button
                        onClick={() => setOs('ios')}
                        className={`
                             flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 font-medium
                            ${os === 'ios' ? 'bg-white text-black shadow-lg' : 'text-muted hover:text-white hover:bg-white/5'}
                        `}
                    >
                        <Apple size={18} />
                        {t('ios_tab')}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="relative h-64 md:h-auto rounded-xl overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center">
                    {/* Abstract Representation of Phone UI */}
                    <div className="w-40 h-72 border-4 border-white/10 rounded-2xl bg-secondary/50 relative p-3">
                        <div className="w-10 h-1 bg-white/10 mx-auto rounded-full mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-2 w-20 bg-white/10 rounded"></div>
                            <div className="h-10 w-full bg-white/5 rounded border border-white/5 flex items-center justify-center text-xs text-muted">
                                {t('title_chat')}
                            </div>
                            <div className="h-20 w-full bg-white/5 rounded border border-white/5 relative overflow-hidden">
                                {os === 'android' ? (
                                    <>
                                        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                        </div>
                                        <div className="absolute top-8 right-2 w-20 h-10 bg-black/80 rounded border border-white/20 flex items-center justify-center text-[8px] text-cta">
                                            Export Chat
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-center pt-2">
                                            <div className="w-12 h-2 bg-white/20 rounded-full"></div>
                                        </div>
                                        <div className="absolute bottom-2 w-full flex justify-center">
                                            <div className="w-24 h-6 bg-white/10 rounded border border-white/10 flex items-center justify-center text-[8px] text-blue-400">
                                                Export Chat
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="mt-1 min-w-[24px] text-cta">1</div>
                        <p className="text-sm text-gray-300">{t('step_1')}</p>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="mt-1 min-w-[24px] text-cta">2</div>
                        <p className="text-sm text-gray-300">{os === 'android' ? t('step_2_android') : t('step_2_ios')}</p>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="mt-1 min-w-[24px] text-cta">3</div>
                        <p className="text-sm text-gray-300">{t('step_3')}</p>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="mt-1 min-w-[24px] text-cta">4</div>
                        <p className="text-sm text-gray-300">{t('step_4')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
