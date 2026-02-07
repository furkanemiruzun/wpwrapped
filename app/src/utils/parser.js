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
        let persona = "persona_chatterbox_title"; // Default key
        let description = "persona_chatterbox_desc"; // Default key
        let icon = "💬";

        // Logic (Simple Heuristics)
        const nightRatio = nightMsgs / totalMsgs;
        const morningRatio = morningMsgs / totalMsgs;
        const avgWords = totalWords / totalMsgs;
        const emojiRatio = emojiCount / totalMsgs;

        if (nightRatio > 0.2) {
            persona = "persona_night_owl_title";
            description = "persona_night_owl_desc";
            icon = "🦉";
        } else if (morningRatio > 0.15) {
            persona = "persona_early_bird_title";
            description = "persona_early_bird_desc";
            icon = "☀️";
        } else if (emojiRatio > 1.5) {
            persona = "persona_emoji_lover_title";
            description = "persona_emoji_lover_desc";
            icon = "😍";
        } else if (avgWords > 10) {
            persona = "persona_philosopher_title";
            description = "persona_philosopher_desc";
            icon = "📜";
        } else if (avgWords < 3) {
            persona = "persona_quick_draw_title";
            description = "persona_quick_draw_desc";
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

    // --- NEW METRICS ---
    stats.responseTimes = calculateResponseTimes(messages, stats.users);
    stats.conversationStarters = calculateConversationStarters(messages, stats.users);
    stats.dailyActivity = calculateDailyActivity(messages);
    stats.streaks = calculateStreaks(stats.dailyActivity);
    stats.mediaStats = calculateMediaStats(messages, stats.users);
    stats.relationshipDNA = calculateVibeAndDNA(messages, stats.users, stats);

    return stats;
};

const calculateStreaks = (dailyActivity) => {
    if (dailyActivity.length === 0) return { current: 0, max: 0 };

    let maxStreak = 0;
    let currentStreak = 0;

    // Convert activity to a sorted set of dates
    const dates = dailyActivity.map(a => a.date).sort();

    if (dates.length === 0) return { current: 0, max: 0 };

    let tempStreak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
        const d1 = new Date(dates[i]);
        const d2 = new Date(dates[i + 1]);
        const diffDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            tempStreak++;
        } else if (diffDays > 1) {
            maxStreak = Math.max(maxStreak, tempStreak);
            tempStreak = 1;
        }
    }
    maxStreak = Math.max(maxStreak, tempStreak);

    // Calculate current streak (if last entry is yesterday or today)
    const lastDate = new Date(dates[dates.length - 1]);
    const today = new Date();
    const diffToToday = Math.round((today - lastDate) / (1000 * 60 * 60 * 24));

    if (diffToToday <= 1) {
        // Find current streak by counting backwards
        let current = 1;
        for (let i = dates.length - 1; i > 0; i--) {
            const d1 = new Date(dates[i - 1]);
            const d2 = new Date(dates[i]);
            if (Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) === 1) {
                current++;
            } else {
                break;
            }
        }
        currentStreak = current;
    } else {
        currentStreak = 0;
    }

    return { current: currentStreak, max: maxStreak };
};

const calculateMediaStats = (messages, users) => {
    const mediaIndicators = [
        'media omitted', 'medya dahil edilmedi', 'görüntü dahil edilmedi',
        '<media omitted>', 'sticker', 'gif', 'image omitted', 'video omitted',
        'ses dahil edilmedi', 'ptt'
    ];

    const stats = {};
    users.forEach(u => stats[u] = 0);

    messages.forEach(msg => {
        const content = msg.content.toLowerCase();
        if (mediaIndicators.some(indicator => content.includes(indicator))) {
            if (stats[msg.author] !== undefined) {
                stats[msg.author]++;
            }
        }
    });

    return Object.entries(stats)
        .map(([user, count]) => ({ user, count }))
        .sort((a, b) => b.count - a.count);
};

const calculateResponseTimes = (messages, users) => {
    if (messages.length < 2) return [];

    let responseStats = {};
    users.forEach(u => responseStats[u] = { totalTime: 0, count: 0 });

    const parseDateTime = (d, t) => {
        try {
            const parts = d.split(/[\/\-\.]/);
            // Handle different date formats if needed, assuming DD/MM/YYYY mostly
            // If parts[0] is year (YYYY-MM-DD)
            let day, month, year;
            if (parts[0].length === 4) {
                year = parts[0]; month = parts[1]; day = parts[2];
            } else {
                day = parts[0]; month = parts[1]; year = parts[2];
            }

            const tParts = t.split(/[:\.]/);
            const hour = tParts[0];
            const minute = tParts[1];

            return new Date(year, month - 1, day, hour, minute);
        } catch (e) {
            return null;
        }
    };

    for (let i = 0; i < messages.length - 1; i++) {
        const curr = messages[i];
        const next = messages[i + 1];

        if (curr.author !== next.author && curr.author && next.author) {
            const t1 = parseDateTime(curr.date, curr.time);
            const t2 = parseDateTime(next.date, next.time);

            if (t1 && t2) {
                const diffMs = t2 - t1;
                // legitimate response window: > 0 and < 6 hours
                if (diffMs > 0 && diffMs < 6 * 60 * 60 * 1000) {
                    if (!responseStats[next.author]) responseStats[next.author] = { totalTime: 0, count: 0 };
                    responseStats[next.author].totalTime += diffMs;
                    responseStats[next.author].count++;
                }
            }
        }
    }

    return Object.entries(responseStats)
        .map(([user, data]) => ({
            user,
            avgTimeMinutes: data.count > 0 ? (data.totalTime / data.count / 60000) : 0,
            count: data.count
        }))
        .sort((a, b) => a.avgTimeMinutes - b.avgTimeMinutes);
};

const calculateConversationStarters = (messages, users) => {
    if (messages.length < 2) return [];

    let starterCounts = {};
    users.forEach(u => starterCounts[u] = 0);

    const parseDateTime = (d, t) => {
        try {
            const parts = d.split(/[\/\-\.]/);
            let day, month, year;
            if (parts[0].length === 4) {
                year = parts[0]; month = parts[1]; day = parts[2];
            } else {
                day = parts[0]; month = parts[1]; year = parts[2];
            }
            const tParts = t.split(/[:\.]/);
            return new Date(year, month - 1, day, tParts[0], tParts[1]);
        } catch (e) { return null; }
    };

    if (messages[0].author) starterCounts[messages[0].author] = (starterCounts[messages[0].author] || 0) + 1;

    for (let i = 0; i < messages.length - 1; i++) {
        const curr = messages[i];
        const next = messages[i + 1];

        const t1 = parseDateTime(curr.date, curr.time);
        const t2 = parseDateTime(next.date, next.time);

        if (t1 && t2) {
            const diffMs = t2 - t1;
            if (diffMs > 6 * 60 * 60 * 1000) { // 6 hours
                if (next.author) {
                    starterCounts[next.author] = (starterCounts[next.author] || 0) + 1;
                }
            }
        }
    }

    return Object.entries(starterCounts)
        .map(([user, count]) => ({ user, count }))
        .sort((a, b) => b.count - a.count);
};

const calculateDailyActivity = (messages) => {
    const activity = {}; // 'YYYY-MM-DD': count

    const parseDateKey = (d) => {
        try {
            const parts = d.split(/[\/\-\.]/);
            let day, month, year;
            if (parts[0].length === 4) {
                year = parts[0]; month = parts[1]; day = parts[2];
            } else {
                day = parts[0]; month = parts[1]; year = parts[2];
            }
            // ensure YYYY-MM-DD format
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } catch (e) { return null; }
    };

    messages.forEach(msg => {
        const key = parseDateKey(msg.date);
        if (key) {
            activity[key] = (activity[key] || 0) + 1;
        }
    });

    // Convert to array
    const activityArray = Object.entries(activity).map(([date, count]) => ({ date, count }));

    // Calculate levels (0-4) for heatmap
    // Find max to normalize
    const maxCount = Math.max(...activityArray.map(a => a.count), 1);

    return activityArray.map(a => ({
        ...a,
        level: Math.ceil((a.count / maxCount) * 4) // 0 is empty, 1-4 are levels
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
};
// --- DNA & EMOTION ANALYTICS ---
const calculateVibeAndDNA = (messages, users, stats) => {
    const funnyKeywords = ['😂', '🤣', 'haha', 'hihi', 'sjsk', 'asdf', 'koptum', 'öldüm', 'lol', 'lmfao', 'gülmek', 'şaka'];
    const emotionalKeywords = ['❤️', '💙', '💕', 'canım', 'özledim', 'seviyorum', '🥺', '😭', 'kıyamam', 'aşkım', 'bebeğim'];
    const seriousKeywords = ['tamam', 'peki', 'anladım', 'rapor', 'toplantı', 'mail', 'dosya', 'hallederiz', 'yapalım', 'deadline'];
    const energeticKeywords = ['🔥', '🚀', 'haydi', 'süper', 'harika', 'şahane', 'gidelim', 'bas', 'yapıştır', 'yürürü'];

    const userDNAScores = {};
    users.forEach(u => {
        userDNAScores[u] = {
            laughter: 0,
            media: 0,
            night: 0,
            empathy: 0,
            consistency: 0,
            vibe: 'Neutral'
        };
    });

    const hourlyActivity = {}; // hour -> total
    const dateActivity = {}; // date -> total

    messages.forEach(msg => {
        const u = msg.author;
        if (!userDNAScores[u]) return;

        const content = msg.content.toLowerCase();

        // Laughter
        if (funnyKeywords.some(k => content.includes(k))) userDNAScores[u].laughter++;

        // Empathy
        if (emotionalKeywords.some(k => content.includes(k))) userDNAScores[u].empathy++;

        // Night (00-05)
        const hour = parseInt(msg.time.split(/[:.]/)[0]);
        if (hour >= 0 && hour < 6) userDNAScores[u].night++;

        // Consistency (based on frequency/spread of active days)
        dateActivity[msg.date] = (dateActivity[msg.date] || 0) + 1;
    });

    // Media scores from previous stats
    stats.mediaStats.forEach(ms => {
        if (userDNAScores[ms.user]) userDNAScores[ms.user].media = ms.count;
    });

    // Normalize DNA scores (0-100 scale)
    const processedDNA = Object.entries(userDNAScores).map(([user, scores]) => {
        const totalMsgs = stats.userStats[user].count;
        const normalized = {
            user,
            laughter: Math.min(100, (scores.laughter / totalMsgs) * 500),
            media: Math.min(100, (scores.media / totalMsgs) * 200),
            night: Math.min(100, (scores.night / totalMsgs) * 300),
            empathy: Math.min(100, (scores.empathy / totalMsgs) * 400),
            consistency: Math.min(100, (stats.dailyActivity.length / 365) * 100)
        };

        // Determine Vibe
        let vibe = 'Cheerful';
        if (normalized.laughter > 40) vibe = 'Funny';
        if (normalized.empathy > 30) vibe = 'Warm';
        if (normalized.night > 50) vibe = 'Night Runner';
        if (normalized.media > 25) vibe = 'Visualist';

        return { ...normalized, vibe };
    });

    return processedDNA;
};

// Add to analyzeMessages at the end
// stats.relationshipDNA = calculateVibeAndDNA(messages, stats.users, stats);
