class ChatMessage {
  final DateTime? dateTime;
  final String author;
  final String content;

  ChatMessage({this.dateTime, required this.author, required this.content});
}

class UserStat {
  int count = 0;
  int wordCount = 0;
  double avgMessageLength = 0;
  int emojiCount = 0;
  Map<String, int> topWords = {};
  Map<String, int> topEmojis = {};
  Map<int, int> hourlyMessages = {};

  UserStat();
}

class Persona {
  final String titleKey;
  final String descKey;
  final String icon;

  Persona({required this.titleKey, required this.descKey, required this.icon});
}

class ResponseTimeStat {
  final String user;
  final double avgTimeMinutes;
  final int count;

  ResponseTimeStat({
    required this.user,
    required this.avgTimeMinutes,
    required this.count,
  });
}

class ConversationStarterStat {
  final String user;
  final int count;

  ConversationStarterStat({required this.user, required this.count});
}

class DailyActivityStat {
  final String date;
  final int count;
  final int level;

  DailyActivityStat({
    required this.date,
    required this.count,
    required this.level,
  });
}

class UserDNA {
  final String user;
  final double laughter;
  final double media;
  final double night;
  final double empathy;
  final double consistency;
  final String vibe;

  UserDNA({
    required this.user,
    required this.laughter,
    required this.media,
    required this.night,
    required this.empathy,
    required this.consistency,
    required this.vibe,
  });
}

class ChatStats {
  final int totalMessages;
  final List<String> users;
  final Map<String, UserStat> userStats;
  final List<MapEntry<String, int>> timeline;
  final List<MapEntry<int, int>> hourly;
  final List<MapEntry<String, int>> topWords;
  final List<MapEntry<String, int>> topEmojis;
  final List<ChatMessage> firstMessages;
  final List<MapEntry<String, int>> busiestDates;
  final Map<String, Persona> personas;
  final List<ResponseTimeStat> responseTimes;
  final List<ConversationStarterStat> conversationStarters;
  final List<DailyActivityStat> dailyActivity;
  final int streakCurrent;
  final int streakMax;
  final List<MapEntry<String, int>> mediaStats;
  final List<UserDNA> relationshipDNA;
  final List<MapEntry<String, int>> topDomains;
  final Map<int, int> weekdayStats;

  ChatStats({
    required this.totalMessages,
    required this.users,
    required this.userStats,
    required this.timeline,
    required this.hourly,
    required this.topWords,
    required this.topEmojis,
    required this.firstMessages,
    required this.busiestDates,
    required this.personas,
    required this.responseTimes,
    required this.conversationStarters,
    required this.dailyActivity,
    required this.streakCurrent,
    required this.streakMax,
    required this.mediaStats,
    required this.relationshipDNA,
    required this.topDomains,
    required this.weekdayStats,
  });
}
