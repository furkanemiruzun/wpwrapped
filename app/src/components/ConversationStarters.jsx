import { GlassCard } from './ui/GlassCard';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ConversationStarters({ data }) {
    const { t } = useTranslation();
    if (!data || data.length === 0) return null;

    const max = Math.max(...data.map(d => d.count));

    return (
        <GlassCard className="h-full min-h-[300px]">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-yellow-400" size={20} />
                <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-200">
                    {t('conversation_starters_title')}
                </h2>
            </div>

            <div className="space-y-4">
                {data.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-cta">
                            #{index + 1}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{item.user}</span>
                                <span className="text-xs text-muted">{item.count} {t('times')}</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-500 rounded-full"
                                    style={{ width: `${(item.count / max) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
