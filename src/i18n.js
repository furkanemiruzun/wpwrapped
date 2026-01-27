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
            "drop_text": "Drop _chat.txt or .zip file",
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

            // New Content
            "privacy_policy": "Privacy Policy",
            "close": "Close",
            "how_to_export": "How to Export Your Chat?",
            "android_tab": "Android",
            "ios_tab": "iOS",
            "step_1": "1. Open the WhatsApp chat you want to analyze.",
            "step_2_android": "2. Tap the three dots (⋮) > More > Export Chat.",
            "step_2_ios": "2. Tap the contact name at the top > Export Chat.",
            "step_3": "3. Choose 'Without Media'.",
            "step_4": "4. Save the file or share it to your computer.",

            "privacy_title": "Privacy & Security",
            "privacy_intro": "Your data privacy is our top priority. Key points:",
            "privacy_p1_title": "Local Processing",
            "privacy_p1_desc": "Your file is processed entirely within your browser on your device.",
            "privacy_p2_title": "No Servers",
            "privacy_p2_desc": "We do not have a backend server. Your chat logs are never uploaded to the internet.",
            "privacy_p3_title": "No Storage",
            "privacy_p3_desc": "We don't verify, store, or view your personal messages. Once you refresh the page, all data is gone.",
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
            "drop_text": "_chat.txt veya .zip dosyasını bırakın",
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
            "developed_by": "Furkan Emir Uzun tarafından geliştirildi. ",

            // New Content TR
            "privacy_policy": "Gizlilik Politikası",
            "close": "Kapat",
            "how_to_export": "Sohbet Geçmişi Nasıl Alınır?",
            "android_tab": "Android",
            "ios_tab": "iOS",
            "step_1": "1. Analiz etmek istediğiniz WhatsApp sohbetini açın.",
            "step_2_android": "2. Sağ üstteki üç noktaya (⋮) basın > Diğer > Sohbeti Dışa Aktar.",
            "step_2_ios": "2. En üstteki kişi/grup adına dokunun > Sohbeti Dışa Aktar.",
            "step_3": "3. 'Medyasız' seçeneğini işaretleyin.",
            "step_4": "4. Dosyayı kaydedin veya kendinize mail atıp bilgisayara indirin.",

            "privacy_title": "Gizlilik ve Güvenlik",
            "privacy_intro": "Veri gizliliğiniz bizim için en önemli önceliktir. Temel ilkelerimiz:",
            "privacy_p1_title": "Yerel İşleme",
            "privacy_p1_desc": "Dosyanız tamamen cihazınızdaki tarayıcı içinde işlenir.",
            "privacy_p2_title": "Sunucu Yok",
            "privacy_p2_desc": "Arka uç sunucumuz yoktur. Sohbet kayıtlarınız asla internete yüklenmez.",
            "privacy_p3_title": "Kayıt Tutulmaz",
            "privacy_p3_desc": "Mesajlarınızı görmeyiz, saklamayız veya doğrulamayız. Sayfayı yenilediğinizde tüm veriler kaybolur.",
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
