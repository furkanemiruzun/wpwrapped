import 'dart:convert';
import 'package:chatwrapp_mobile/models/chat_data.dart';
import 'package:intl/intl.dart';

class ChatParser {
  static const Set<String> stopWords = {
    'the',
    'be',
    'to',
    'of',
    'and',
    'a',
    'in',
    'that',
    'have',
    'i',
    'it',
    'for',
    'not',
    'on',
    'with',
    'he',
    'as',
    'you',
    'do',
    'at',
    'this',
    'but',
    'his',
    'by',
    'from',
    'they',
    'we',
    'say',
    'her',
    'she',
    'or',
    'an',
    'will',
    'my',
    'one',
    'all',
    'would',
    'there',
    'their',
    'what',
    'so',
    'up',
    'out',
    'if',
    'about',
    'who',
    'get',
    'which',
    'go',
    'me',
    'when',
    'make',
    'can',
    'like',
    'time',
    'no',
    'just',
    'him',
    'know',
    'take',
    'people',
    'into',
    'year',
    'your',
    'good',
    'some',
    'could',
    'them',
    'see',
    'other',
    'than',
    'then',
    'now',
    'look',
    'only',
    'come',
    'its',
    'over',
    'think',
    'also',
    'back',
    'after',
    'use',
    'two',
    'how',
    'our',
    'work',
    'first',
    'well',
    'way',
    'even',
    'new',
    'want',
    'because',
    'any',
    'these',
    'give',
    'day',
    'most',
    'us',
    'track',
    'media',
    'attached',
    'omitted',
    'medya',
    'dahil',
    'edilmedi',
    'farklı',
    'uçtan',
    'uca',
    'şifrelendi',
    'öğrenmek',
    'dokunun',
    'mesaj',
    'silindi',
    'arama',
    'görüntülü',
    'sesli',
    'cevapsız',
    'yok',
    'kişi',
    'kartı',
    'paylaşıldı',
    'görüntü',
    'bir',
    've',
    'ile',
    'bu',
    'da',
    'de',
    'ama',
    'fakat',
    'lakin',
    'için',
    'ben',
    'sen',
    'o',
    'biz',
    'siz',
    'onlar',
    'ne',
    'var',
    'mı',
    'mi',
    'mu',
    'mü',
    'diye',
    'gibi',
    'kadar',
    'sonra',
    'önce',
    'şu',
    'şey',
    'belki',
    'sanki',
    'en',
    'çok',
    'daha',
    'nasıl',
    'neden',
    'niye',
    'acaba',
    'eğer',
    'ise',
    'ki',
    'yani',
    'işte',
    'böyle',
    'öyle',
    'hiç',
    'image',
    'sticker',
    'gif',
    'audio',
    'video',
  };

  static ChatStats parse(String text) {
    try {
      // BOM ve LTR gibi gizli karakterleri temizliyoruz
      final cleanText = text
          .replaceFirst(RegExp(r'^\uFEFF'), '')
          .replaceAll('\u200e', '')
          .replaceAll('\u200f', '');

      final lines = LineSplitter.split(cleanText).toList();
      final List<ChatMessage> messages = [];

      // UNIVERSAL REGEX: Tarih, Saat ve İsim arasındaki tüm varyasyonları (-, :, [, ], virgül) yakalar.
      final regex = RegExp(
        r'^\[?(\d{1,4}[\/.-]\d{1,2}[\/.-]\d{1,4})[,\sT]+(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?)\]?[\s-]*[:\-]?\s*([^:]+):\s*(.*)$',
      );

      ChatMessage? currentEntry;

      for (var line in lines) {
        if (line.trim().isEmpty) continue;

        final match = regex.firstMatch(line);
        if (match != null) {
          if (currentEntry != null) messages.add(currentEntry);

          final dateStr = match.group(1)!;
          final timeStr = match.group(2)!;
          final author = match.group(3)!.trim();
          final content = match.group(4)!.trim();

          DateTime? dt;
          try {
            // Tarih ayrıştırma mantığını güçlendiriyoruz
            final dateParts = dateStr.split(RegExp(r'[\/.-]'));
            final timeParts = timeStr.split(RegExp(r'[:.]'));

            int day, month, year;
            if (dateParts[0].length == 4) {
              // YYYY-MM-DD
              year = int.parse(dateParts[0]);
              month = int.parse(dateParts[1]);
              day = int.parse(dateParts[2]);
            } else {
              // DD-MM-YYYY or MM-DD-YYYY
              day = int.parse(dateParts[0]);
              month = int.parse(dateParts[1]);
              year = int.parse(dateParts[2]);
              if (year < 100) year += 2000;

              // Ay/Gün karışıklığı kontrolü: Eğer 2. sayı 12'den büyükse muhtemelen format MM-DD-YYYY
              if (month > 12) {
                int temp = month;
                month = day;
                day = temp;
              }
            }

            dt = DateTime(
              year,
              month,
              day,
              int.parse(timeParts[0]),
              int.parse(timeParts[1]),
            );
          } catch (e) {
            // Tarih okunamasa bile mesajı kaybetmiyoruz
            dt = null;
          }

          currentEntry = ChatMessage(
            dateTime: dt,
            author: author,
            content: content,
          );
        } else if (currentEntry != null) {
          // Çok satırlı mesajları birleştiriyoruz
          currentEntry = ChatMessage(
            dateTime: currentEntry.dateTime,
            author: currentEntry.author,
            content: '${currentEntry.content}\n${line.trim()}',
          );
        }
      }

      if (currentEntry != null) messages.add(currentEntry);

      if (messages.isEmpty) {
        throw Exception(
          'Dosya içinde eşleşen mesaj bulunamadı. Lütfen "Medya Olmadan" dışa aktardığınızdan emin olun.',
        );
      }

      return _analyze(messages);
    } catch (e) {
      rethrow;
    }
  }

  static ChatStats _analyze(List<ChatMessage> messages) {
    final Map<String, UserStat> userStats = {};
    final Map<String, int> wordCounts = {};
    final Map<String, int> emojiCounts = {};
    final Map<String, int> dateCounts = {};
    final Map<int, int> hourCounts = {};
    final Map<int, int> weekdayStats = {for (var i = 1; i <= 7; i++) i: 0};
    final Map<String, int> domainCounts = {};

    final emojiRegex = RegExp(
      r'[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{303D}\u{2139}\u{2122}\u{3297}\u{3299}]',
      unicode: true,
    );

    final domainRegex = RegExp(
      r'https?://(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)',
    );

    for (var msg in messages) {
      final user = msg.author;
      userStats.putIfAbsent(user, () => UserStat());
      userStats[user]!.count++;

      final content = msg.content.toLowerCase();

      // Domain Analysis
      final domainMatches = domainRegex.allMatches(content);
      for (var dm in domainMatches) {
        final domain = dm.group(1)!;
        domainCounts[domain] = (domainCounts[domain] ?? 0) + 1;
      }

      final words = content
          .split(RegExp(r'\s+'))
          .where((w) => w.isNotEmpty)
          .toList();
      userStats[user]!.wordCount += words.length;

      for (var word in words) {
        final cleanWord = word.replaceAll(
          RegExp(r'[^\p{L}\p{N}]', unicode: true),
          '',
        );
        if (cleanWord.isNotEmpty && !stopWords.contains(cleanWord)) {
          // Bireysel hikaye için
          if (cleanWord.length > 1) {
            userStats[user]!.topWords[cleanWord] =
                (userStats[user]!.topWords[cleanWord] ?? 0) + 1;
          }
          // Genel dashboard için
          if (cleanWord.length > 2) {
            wordCounts[cleanWord] = (wordCounts[cleanWord] ?? 0) + 1;
          }
        }
      }

      final emojis = emojiRegex.allMatches(msg.content);
      for (var em in emojis) {
        final emoji = em.group(0)!;
        emojiCounts[emoji] = (emojiCounts[emoji] ?? 0) + 1;
        userStats[user]!.emojiCount++;
        userStats[user]!.topEmojis[emoji] =
            (userStats[user]!.topEmojis[emoji] ?? 0) + 1;
      }

      if (msg.dateTime != null) {
        final dateKey = DateFormat('yyyy-MM-dd').format(msg.dateTime!);
        dateCounts[dateKey] = (dateCounts[dateKey] ?? 0) + 1;

        final hour = msg.dateTime!.hour;
        hourCounts[hour] = (hourCounts[hour] ?? 0) + 1;
        userStats[user]!.hourlyMessages[hour] =
            (userStats[user]!.hourlyMessages[hour] ?? 0) + 1;

        // Weekday
        weekdayStats[msg.dateTime!.weekday] =
            (weekdayStats[msg.dateTime!.weekday] ?? 0) + 1;
      }
    }

    final topWords = wordCounts.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    final topEmojis = emojiCounts.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    final topDomains = domainCounts.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    final sortedHourCounts = hourCounts.entries.toList()
      ..sort((a, b) => a.key.compareTo(b.key));

    final sortedTimeline = dateCounts.entries.toList()
      ..sort((a, b) => a.key.compareTo(b.key));

    final sortedBusiestDates = dateCounts.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    // Personas
    final Map<String, Persona> personas = {};
    for (var user in userStats.keys) {
      final stat = userStats[user]!;
      if (stat.count > 0) {
        stat.avgMessageLength = stat.wordCount / stat.count;

        int nightMsgs = 0;
        int morningMsgs = 0;
        for (var h in [0, 1, 2, 3, 4, 5]) {
          nightMsgs += stat.hourlyMessages[h] ?? 0;
        }
        for (var h in [5, 6, 7, 8, 9]) {
          morningMsgs += stat.hourlyMessages[h] ?? 0;
        }

        final nightRatio = nightMsgs / stat.count;
        final morningRatio = morningMsgs / stat.count;
        final emojiRatio = stat.emojiCount / stat.count;

        String pTitle = "persona_chatterbox_title";
        String pDesc = "persona_chatterbox_desc";
        String pIcon = "💬";

        if (nightRatio > 0.2) {
          pTitle = "persona_night_owl_title";
          pDesc = "persona_night_owl_desc";
          pIcon = "🦉";
        } else if (morningRatio > 0.15) {
          pTitle = "persona_early_bird_title";
          pDesc = "persona_early_bird_desc";
          pIcon = "☀️";
        } else if (emojiRatio > 1.5) {
          pTitle = "persona_emoji_lover_title";
          pDesc = "persona_emoji_lover_desc";
          pIcon = "😍";
        } else if (stat.avgMessageLength > 10) {
          pTitle = "persona_philosopher_title";
          pDesc = "persona_philosopher_desc";
          pIcon = "📜";
        } else if (stat.avgMessageLength < 3) {
          pTitle = "persona_quick_draw_title";
          pDesc = "persona_quick_draw_desc";
          pIcon = "⚡";
        }

        personas[user] = Persona(titleKey: pTitle, descKey: pDesc, icon: pIcon);
      }
    }

    // Response Times & Starters
    final List<ResponseTimeStat> responseTimes = _calculateResponseTimes(
      messages,
      userStats.keys.toList(),
    );
    final List<ConversationStarterStat> starters = _calculateStarters(
      messages,
      userStats.keys.toList(),
    );
    final List<DailyActivityStat> dailyActivity = _calculateDailyActivity(
      dateCounts,
    );

    final streaks = _calculateStreaks(dailyActivity);
    final mediaStats = _calculateMediaStats(messages, userStats.keys.toList());
    final relationshipDNA = _calculateRelationshipDNA(
      messages,
      userStats.keys.toList(),
      userStats,
      dailyActivity,
      mediaStats,
    );

    return ChatStats(
      totalMessages: messages.length,
      users: userStats.keys.toList(),
      userStats: userStats,
      timeline: sortedTimeline,
      hourly: sortedHourCounts,
      topWords: topWords.take(100).toList(),
      topEmojis: topEmojis.take(30).toList(),
      firstMessages: messages.take(50).toList(),
      busiestDates: sortedBusiestDates.take(20).toList(),
      personas: personas,
      responseTimes: responseTimes,
      conversationStarters: starters,
      dailyActivity: dailyActivity,
      streakCurrent: streaks['current']!,
      streakMax: streaks['max']!,
      mediaStats: mediaStats,
      relationshipDNA: relationshipDNA,
      topDomains: topDomains,
      weekdayStats: weekdayStats,
    );
  }

  static Map<String, int> _calculateStreaks(List<DailyActivityStat> activity) {
    if (activity.isEmpty) return {'current': 0, 'max': 0};

    int maxStreak = 0;
    int currentStreak = 0;

    final dates = activity.map((a) => DateTime.parse(a.date)).toList()..sort();

    int tempStreak = 1;
    for (int i = 0; i < dates.length - 1; i++) {
      final d1 = dates[i];
      final d2 = dates[i + 1];
      final diff = d2.difference(d1).inDays;

      if (diff == 1) {
        tempStreak++;
      } else if (diff > 1) {
        if (tempStreak > maxStreak) maxStreak = tempStreak;
        tempStreak = 1;
      }
    }
    if (tempStreak > maxStreak) maxStreak = tempStreak;

    // Current streak check
    final now = DateTime.now();
    final lastDate = dates.last;
    final diffToNow = DateTime(
      now.year,
      now.month,
      now.day,
    ).difference(DateTime(lastDate.year, lastDate.month, lastDate.day)).inDays;

    if (diffToNow <= 1) {
      int current = 1;
      for (int i = dates.length - 1; i > 0; i--) {
        final diff = dates[i].difference(dates[i - 1]).inDays;
        if (diff == 1) {
          current++;
        } else {
          break;
        }
      }
      currentStreak = current;
    }

    return {'current': currentStreak, 'max': maxStreak};
  }

  static List<MapEntry<String, int>> _calculateMediaStats(
    List<ChatMessage> messages,
    List<String> users,
  ) {
    final mediaIndicators = [
      'media omitted',
      'medya dahil edilmedi',
      'görüntü dahil edilmedi',
      '<media omitted>',
      'sticker',
      'gif',
      'image omitted',
      'video omitted',
      'ses dahil edilmedi',
      'ptt',
    ];

    final Map<String, int> stats = {for (var u in users) u: 0};

    for (var msg in messages) {
      final content = msg.content.toLowerCase();
      if (mediaIndicators.any((indicator) => content.contains(indicator))) {
        stats[msg.author] = (stats[msg.author] ?? 0) + 1;
      }
    }

    return stats.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
  }

  static List<ResponseTimeStat> _calculateResponseTimes(
    List<ChatMessage> messages,
    List<String> users,
  ) {
    if (messages.length < 2) return [];

    final Map<String, List<int>> diffs = {for (var u in users) u: []};

    for (int i = 0; i < messages.length - 1; i++) {
      final curr = messages[i];
      final next = messages[i + 1];

      if (curr.author != next.author &&
          curr.dateTime != null &&
          next.dateTime != null) {
        final diff = next.dateTime!.difference(curr.dateTime!).inMilliseconds;
        // < 6 hours
        if (diff > 0 && diff < 6 * 60 * 60 * 1000) {
          diffs[next.author]?.add(diff);
        }
      }
    }

    return diffs.entries.map((e) {
      final avg = e.value.isEmpty
          ? -1.0
          : e.value.reduce((a, b) => a + b) / e.value.length / 60000;
      return ResponseTimeStat(
        user: e.key,
        avgTimeMinutes: avg,
        count: e.value.length,
      );
    }).toList()..sort((a, b) {
      if (a.avgTimeMinutes < 0) return 1;
      if (b.avgTimeMinutes < 0) return -1;
      return a.avgTimeMinutes.compareTo(b.avgTimeMinutes);
    });
  }

  static List<ConversationStarterStat> _calculateStarters(
    List<ChatMessage> messages,
    List<String> users,
  ) {
    if (messages.isEmpty) return [];

    final Map<String, int> starterCounts = {for (var u in users) u: 0};

    if (messages[0].author.isNotEmpty) {
      starterCounts[messages[0].author] = 1;
    }

    for (int i = 0; i < messages.length - 1; i++) {
      final curr = messages[i];
      final next = messages[i + 1];

      if (curr.dateTime != null && next.dateTime != null) {
        final diff = next.dateTime!.difference(curr.dateTime!).inHours;
        if (diff > 6) {
          starterCounts[next.author] = (starterCounts[next.author] ?? 0) + 1;
        }
      }
    }

    return starterCounts.entries
        .map((e) => ConversationStarterStat(user: e.key, count: e.value))
        .toList()
      ..sort((a, b) => b.count.compareTo(a.count));
  }

  static List<DailyActivityStat> _calculateDailyActivity(
    Map<String, int> dateCounts,
  ) {
    final activity = dateCounts.entries.toList()
      ..sort((a, b) => a.key.compareTo(b.key));
    if (activity.isEmpty) return [];

    final maxVal = activity.map((e) => e.value).reduce((a, b) => a > b ? a : b);
    if (maxVal == 0)
      return activity
          .map((e) => DailyActivityStat(date: e.key, count: e.value, level: 0))
          .toList();

    return activity.map((e) {
      final level = (e.value / maxVal * 4).round().clamp(1, 4);
      return DailyActivityStat(date: e.key, count: e.value, level: level);
    }).toList();
  }

  static List<UserDNA> _calculateRelationshipDNA(
    List<ChatMessage> messages,
    List<String> users,
    Map<String, UserStat> userStats,
    List<DailyActivityStat> dailyActivity,
    List<MapEntry<String, int>> mediaStats,
  ) {
    final funnyKeywords = [
      '😂',
      '🤣',
      'haha',
      'hihi',
      'sjsk',
      'asdf',
      'koptum',
      'öldüm',
      'lol',
      'lmfao',
      'gülmek',
      'şaka',
    ];
    final emotionalKeywords = [
      '❤️',
      '💙',
      '💕',
      'canım',
      'özledim',
      'seviyorum',
      '🥺',
      '😭',
      'kıyamam',
      'aşkım',
      'bebeğim',
    ];

    final Map<String, Map<String, double>> scores = {
      for (var u in users)
        u: {'laughter': 0, 'media': 0, 'night': 0, 'empathy': 0},
    };

    for (var msg in messages) {
      final user = msg.author;
      if (!scores.containsKey(user)) continue;

      final content = msg.content.toLowerCase();

      // Laughter
      if (funnyKeywords.any((k) => content.contains(k))) {
        scores[user]!['laughter'] = scores[user]!['laughter']! + 1;
      }

      // Empathy
      if (emotionalKeywords.any((k) => content.contains(k))) {
        scores[user]!['empathy'] = scores[user]!['empathy']! + 1;
      }

      // Night
      if (msg.dateTime != null &&
          msg.dateTime!.hour >= 0 &&
          msg.dateTime!.hour < 6) {
        scores[user]!['night'] = scores[user]!['night']! + 1;
      }
    }

    // Media
    for (var ms in mediaStats) {
      if (scores.containsKey(ms.key)) {
        scores[ms.key]!['media'] = ms.value.toDouble();
      }
    }

    return users.map((u) {
      final stat = userStats[u]!;
      final totalMsgs = stat.count > 0 ? stat.count : 1;

      final laughter = ((scores[u]!['laughter']! / totalMsgs) * 500).clamp(
        0.0,
        100.0,
      );
      final media = ((scores[u]!['media']! / totalMsgs) * 200).clamp(
        0.0,
        100.0,
      );
      final night = ((scores[u]!['night']! / totalMsgs) * 300).clamp(
        0.0,
        100.0,
      );
      final empathy = ((scores[u]!['empathy']! / totalMsgs) * 400).clamp(
        0.0,
        100.0,
      );
      final consistency = ((dailyActivity.length / 365) * 100).clamp(
        0.0,
        100.0,
      );

      String vibe = 'Enerjik';
      if (laughter > 40) {
        vibe = 'Mizahşör';
      } else if (empathy > 30) {
        vibe = 'Candan';
      } else if (night > 50) {
        vibe = 'Gece Kuşu';
      } else if (media > 25) {
        vibe = 'Görselci';
      }

      return UserDNA(
        user: u,
        laughter: laughter,
        media: media,
        night: night,
        empathy: empathy,
        consistency: consistency,
        vibe: vibe,
      );
    }).toList();
  }
}
