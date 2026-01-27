import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "title_chat": "Chat",
            "title_wrapp": "Wrapp",
            "analyze_another": "Analyze Another",
            "hero_badge": "✨ WhatsApp Analysis Reimagined",
            "hero_title": "Unlock insights from <br/> your conversations.",
            "hero_subtitle": "Visualize usage patterns, most discussed topics, sleep schedules, and top emojis with our premium analysis engine.",
            "drop_text": "Drop _chat.txt or Click to Upload",
            "crunching": "Crunching data...",
            "card_private_title": "100% Private",
            "card_private_desc": "Analysis runs entirely in your browser. No data leaves your device.",
            "card_insights_title": "Deep Insights",
            "card_insights_desc": "Discover who talks the most and your group's peak activity times.",
            "card_result_title": "Instant Result",
            "card_result_desc": "Drop your text file and get beautiful, shareable charts instantly.",
            "report_title": "Analysis Report:",
            "generated_now": "Generated Now",

            // Dashboard
            "total_messages": "Total Messages",
            "active_users": "Active Users",
            "total_days": "Total Days",
            "message_history": "Message History",
            "busiest_times": "Busiest Times of Day",
            "who_talks_most": "Who Talks the Most?",
            "most_used_words": "Most Used Words",
            "emoji_addiction": "Emoji Addiction",
            "no_emojis": "No emojis found 😢",
            "how_it_started": "How it Started (First 10)",
            "developed_by": "Developed by",
        }
    },
    tr: {
        translation: {
            "title_chat": "Sohbet",
            "title_wrapp": "Analiz",
            "analyze_another": "Yeni Analiz Yap",
            "hero_badge": "✨ WhatsApp Analizi Yeniden Tasarlandı",
            "hero_title": "Sohbetlerinizdeki <br/> gizli detayları keşfedin.",
            "hero_subtitle": "Konuşma alışkanlıklarınızı, en çok konuşulan konuları, uyku düzeninizi ve favori emojilerinizi görselleştirin.",
            "drop_text": "_chat.txt dosyasını bırakın veya tıklayın",
            "crunching": "Veriler işleniyor...",
            "card_private_title": "%100 Gizli",
            "card_private_desc": "Analiz tamamen tarayıcınızda yapılır. Verileriniz asla cihazınızdan çıkmaz.",
            "card_insights_title": "Derinlemesine Analiz",
            "card_insights_desc": "Kimin en çok konuştuğunu ve grubunuzun en aktif saatlerini keşfedin.",
            "card_result_title": "Anında Sonuç",
            "card_result_desc": "Dosyanızı bırakın ve saniyeler içinde paylaşılabilir grafikler elde edin.",
            "report_title": "Analiz Raporu:",
            "generated_now": "Şimdi Oluşturuldu",

            // Dashboard
            "total_messages": "Toplam Mesaj",
            "active_users": "Aktif Kullanıcı",
            "total_days": "Toplam Gün",
            "message_history": "Mesaj Geçmişi",
            "busiest_times": "Günün En Yoğun Saatleri",
            "who_talks_most": "En Çok Kim Konuşuyor?",
            "most_used_words": "En Çok Kullanılan Kelimeler",
            "emoji_addiction": "Emoji Bağımlılığı",
            "no_emojis": "Emoji bulunamadı 😢",
            "how_it_started": "Nasıl Başladı (İlk 10)",
            "developed_by": "Furkan Emir Uzun tarafından geliştirildi",
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
