import { parse, format, isValid } from 'date-fns';

const STOP_WORDS = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
    'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no',
    'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
    'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well',
    'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'track', 'omitted', 'media', 'attached',
    'dahil', 'be', 'medya', 'görüntü', 'omitted', 'media', 'attached', 'image', 'sticker', 'gif', 'audio', 'video',
    'bir', 've', 'ile', 'bu', 'da', 'de', 'ama', 'fakat', 'lakin', 'için', 'ben', 'sen', 'o', 'biz', 'siz', 'onlar',
    'ne', 'var', 'yok', 'mı', 'mi', 'mu', 'mü', 'diye', 'gibi', 'kadar', 'sonra', 'önce', 'şu', 'şey', 'belki', 'sanki',
    'en', 'çok', 'daha', 'nasıl', 'neden', 'niye', 'acaba', 'eğer', 'ise', 'ki', 'yani', 'işte', 'böyle', 'öyle', 'hiç', 'edilmedi', 'silindi',
    'image omitted', 'media omitted', 'medya dahil edilmedi', 'görüntü dahil edilmedi'
]);

export const parseWhatsAppChat = (text) => {
    // Remove BOM if present
    const cleanText = text.replace(/^\uFEFF/, '');
    const lines = cleanText.split(/\r?\n/);
    const messages = [];

    // Regex to match: [Date, Time] User: Message
    // Supports:
    // [21/01/2024, 15:33:12] Name: Message
    // 21/01/2024, 15:33 - Name: Message
    const regex = /^\[?(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})[,\sT]+(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?)\]?[\s-]*([^:]+): (.*)$/;

    let currentEntry = null;

    lines.forEach((line) => {
        const match = line.match(regex);
        if (match) {
            if (currentEntry) messages.push(currentEntry);

            const [_, dateStr, timeStr, author, content] = match;
            // Normalize author name (remove suspicious characters)
            const cleanAuthor = author.trim();

            currentEntry = {
                date: dateStr,
                time: timeStr,
                author: cleanAuthor,
                content: content.trim()
            };
        } else {
            // Continuation of previous message
            if (currentEntry) {
                currentEntry.content += `\n${line.trim()}`;
            }
        }
    });
    if (currentEntry) messages.push(currentEntry);

    return analyzeMessages(messages);
};

const analyzeMessages = (messages) => {
    const stats = {
        totalMessages: messages.length,
        users: [],
        userStats: {},
        timeline: {}, // date -> count
        hourly: {}, // hour -> count
        wordLengthFreq: {},
        topWords: [],
        emojiStats: [],
        activeDates: [], // Sortable array
        firstMessages: messages.slice(0, 10)
    };

    const wordCounts = {};
    const emojiCounts = {};
    const dateCounts = {};
    const hourCounts = {};

    // Emoji regex
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    messages.forEach(msg => {
        // User Stats
        if (!stats.userStats[msg.author]) {
            stats.userStats[msg.author] = { count: 0, wordCount: 0 };
        }
        stats.userStats[msg.author].count++;

        // Content Analysis
        const content = msg.content.toLowerCase();
        const words = content.split(/\s+/);
        stats.userStats[msg.author].wordCount += words.length;

        words.forEach(word => {
            const cleanWord = word.replace(/[^\p{L}\p{N}]/gu, ''); // Remove punctuation but keep any unicode letter/number
            if (cleanWord.length > 2 && !STOP_WORDS.has(cleanWord)) {
                wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
            }
        });

        // Emojis
        const emojis = msg.content.match(emojiRegex);
        if (emojis) {
            emojis.forEach(emoji => {
                emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
            });
        }

        // Timeline (Date) - Assuming DD/MM/YYYY or MM/DD/YYYY format inconsistency, 
        // simply using the string key for grouping first. 
        // Ideally we parse, but format varies wildly.
        dateCounts[msg.date] = (dateCounts[msg.date] || 0) + 1;

        // Hourly
        // Normalize time to HH (24hr)
        // 15:33 -> 15
        // 3:00 pm -> Needs parsing if 12hr. 
        // Assuming 24hr or handling basic 12hr valid logic if needed. 
        // For simplicity, taking first part of split ':'
        const hour = parseInt(msg.time.split(/[:.]/)[0]);
        // If it's a valid number 0-23
        if (!isNaN(hour)) {
            const hourKey = hour.toString().padStart(2, '0');
            hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1;
        }
    });

    // Process Aggregates
    stats.users = Object.keys(stats.userStats);

    // Top Words
    stats.topWords = Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
        .map(([text, value]) => ({ text, value }));

    // Top Emojis
    stats.emojiStats = Object.entries(emojiCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([emoji, count]) => ({ emoji, count }));

    // Timeline Array
    stats.timeline = Object.entries(dateCounts).map(([date, count]) => ({ date, count }));

    // Hourly Array
    stats.hourly = Object.entries(hourCounts)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([hour, count]) => ({ hour, count }));

    // --- PERSONA ANALYSIS ---
    stats.personas = {};
    
    // 1. Night Owl (Gece Kuşu): Most messages between 00:00 - 05:00
    // 2. Early Bird (Erkenci Kuş): Most messages between 05:00 - 09:00
    // 3. The Chatterbox (Çenebaz): Highest word count average per message
    // 4. The Ghost (Hayalet): Lowest message count but present
    // 5. Emoji Lover (Emoji Aşığı): Highest emoji usage
    
    const nightOwlHours = ['00', '01', '02', '03', '04', '05'];
    const earlyBirdHours = ['05', '06', '07', '08', '09'];

    stats.users.forEach(user => {
        let nightMsgs = 0;
        let morningMsgs = 0;
        let totalWords = stats.userStats[user].wordCount;
        let totalMsgs = stats.userStats[user].count;
        let emojiCount = 0;

        // Re-scan messages for this user to count specific stats (inefficient but accurate for MVP)
        // Optimization: Could have done this in the main loop, but keeping logic clean here.
        messages.forEach(msg => {
            if (msg.author === user) {
                const h = msg.time.split(/[:.]/)[0].padStart(2, '0');
                if (nightOwlHours.includes(h)) nightMsgs++;
                if (earlyBirdHours.includes(h)) morningMsgs++;
                
                const emojis = msg.content.match(emojiRegex);
                if (emojis) emojiCount += emojis.length;
            }
        });

        // Determine main persona
        let persona = "The Chatterbox"; // Default
        let description = "Her zaman söyleyecek bir sözü var.";
        let icon = "💬";

        // Logic (Simple Heuristics)
        const nightRatio = nightMsgs / totalMsgs;
        const morningRatio = morningMsgs / totalMsgs;
        const avgWords = totalWords / totalMsgs;
        const emojiRatio = emojiCount / totalMsgs;

        if (nightRatio > 0.2) {
            persona = "Gece Kuşu 🦉";
            description = "Geceleri yaşıyor, güneş doğarken uyuyor.";
            icon = "🦉";
        } else if (morningRatio > 0.15) {
            persona = "Erkenci Kuş ☀️";
            description = "Güne enerjik başlıyor, sabah mesajları ondan sorulur.";
            icon = "☀️";
        } else if (emojiRatio > 1.5) {
            persona = "Emoji Aşığı 😍";
            description = "Kelimeler yetersiz kaldığında emojiler konuşur.";
            icon = "😍";
        } else if (avgWords > 10) {
            persona = "Filozof 📜";
            description = "Uzun uzun anlatmayı seviyor, kısa cevaplar ona göre değil.";
            icon = "📜";
        } else if (avgWords < 3) {
            persona = "Hızlı Silahşör ⚡";
            description = "Kısa, öz ve hızlı. Ok, tmm, aynen.";
            icon = "⚡";
        }

        stats.personas[user] = {
            title: persona,
            description: description,
            icon: icon,
            stats: {
                nightRatio,
                avgWords,
                emojiRatio
            }
        };
    });

    return stats;
};
