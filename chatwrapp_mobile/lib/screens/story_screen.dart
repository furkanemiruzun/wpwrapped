import 'package:flutter/material.dart';
import 'package:chatwrapp_mobile/models/chat_data.dart';
import 'package:chatwrapp_mobile/theme/app_theme.dart';
import 'package:chatwrapp_mobile/widgets/radar_chart_widget.dart';
import 'package:flutter_animate/flutter_animate.dart';

class StoryScreen extends StatefulWidget {
  final ChatStats stats;
  const StoryScreen({super.key, required this.stats});

  @override
  State<StoryScreen> createState() => _StoryScreenState();
}

class _StoryScreenState extends State<StoryScreen> {
  int _currentIndex = 0;
  final PageController _pageController = PageController();
  late List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _pages = [
      _buildWelcomePage(),
      _buildMessageCountPage(),
      _buildActiveDaysPage(),
      _buildWeeklyPage(),
      _buildStreaksPage(),
      _buildDNAPage(),
      _buildResponseTimePage(),
      _buildHourlyPage(),
      _buildLinksPage(),
      _buildPersonaPage(),
      _buildEndPage(),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: Stack(
        children: [
          // Background Gradient Animation
          Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: _getGradientForIndex(_currentIndex),
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
              )
              .animate(target: _currentIndex.toDouble())
              .tint(color: Colors.black.withOpacity(0.4)),

          // Content
          PageView(
            controller: _pageController,
            onPageChanged: (idx) => setState(() => _currentIndex = idx),
            children: _pages,
          ),

          // Top Progress Bars
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: List.generate(
                  _pages.length,
                  (idx) => Expanded(
                    child: Container(
                      height: 3,
                      margin: const EdgeInsets.symmetric(horizontal: 2),
                      decoration: BoxDecoration(
                        color: idx <= _currentIndex
                            ? Colors.white
                            : Colors.white24,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Tap Areas
          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () {
                    if (_currentIndex > 0) {
                      _pageController.previousPage(
                        duration: 300.ms,
                        curve: Curves.easeInOut,
                      );
                    }
                  },
                  child: Container(color: Colors.transparent),
                ),
              ),
              Expanded(
                child: GestureDetector(
                  onTap: () {
                    if (_currentIndex < _pages.length - 1) {
                      _pageController.nextPage(
                        duration: 300.ms,
                        curve: Curves.easeInOut,
                      );
                    } else {
                      Navigator.pop(context);
                    }
                  },
                  child: Container(color: Colors.transparent),
                ),
              ),
            ],
          ),

          // Close Button
          Positioned(
            top: 50,
            right: 20,
            child: IconButton(
              onPressed: () => Navigator.pop(context),
              icon: const Icon(
                Icons.close_rounded,
                color: Colors.white70,
                size: 28,
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<Color> _getGradientForIndex(int idx) {
    final List<List<Color>> grads = [
      [const Color(0xFF0F172A), const Color(0xFF020617)], // Welcome
      [const Color(0xFF14B8A6), const Color(0xFF0F766E)], // Message Count
      [const Color(0xFF3B82F6), const Color(0xFF1D4ED8)], // Active Days
      [const Color(0xFFF59E0B), const Color(0xFFD97706)], // Weekly (Amber)
      [const Color(0xFFF97316), const Color(0xFFEA580C)], // Streaks
      [const Color(0xFF06B6D4), const Color(0xFF0891B2)], // DNA
      [const Color(0xFF8B5CF6), const Color(0xFF6D28D9)], // Response
      [const Color(0xFFF43F5E), const Color(0xFFBE123C)], // Hourly
      [const Color(0xFF4F46E5), const Color(0xFF3730A3)], // Links (Indigo)
      [const Color(0xFF10B981), const Color(0xFF047857)], // Persona
      [const Color(0xFF0F172A), const Color(0xFF020617)], // End
    ];
    return grads[idx % grads.length];
  }

  Widget _buildWelcomePage() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          'Hazır mısın?',
          style: TextStyle(fontSize: 24, color: Colors.white60),
        ).animate().fadeIn(delay: 500.ms),
        const SizedBox(height: 12),
        const Text(
          'ChatWrapp',
          style: TextStyle(
            fontSize: 48,
            fontWeight: FontWeight.w900,
            color: Colors.white,
            letterSpacing: -2,
          ),
        ).animate().scale(duration: 600.ms, curve: Curves.easeOutBack),
        const SizedBox(height: 8),
        const Text(
          'Sohbetinin hikayesi burada başlıyor...',
          style: TextStyle(fontSize: 16, color: Colors.white70),
        ),
      ],
    );
  }

  Widget _buildMessageCountPage() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          'Tam tamına',
          style: TextStyle(fontSize: 20, color: Colors.white70),
        ).animate().fadeIn(),
        const SizedBox(height: 12),
        Text(
          widget.stats.totalMessages.toString(),
          style: const TextStyle(
            fontSize: 84,
            fontWeight: FontWeight.w900,
            color: Colors.white,
          ),
        ).animate().scale(duration: 800.ms, curve: Curves.elasticOut),
        const SizedBox(height: 12),
        const Text(
          'mesaj paylaşıldı! 💬',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ).animate().fadeIn(delay: 400.ms),
      ],
    );
  }

  Widget _buildActiveDaysPage() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          'Sohbet hiç durmadı!',
          style: TextStyle(fontSize: 20, color: Colors.white70),
        ),
        const SizedBox(height: 12),
        Text(
          '${widget.stats.timeline.length}',
          style: const TextStyle(
            fontSize: 84,
            fontWeight: FontWeight.w900,
            color: Colors.white,
          ),
        ).animate().slideX(begin: -0.5, end: 0, curve: Curves.easeOutCubic),
        const SizedBox(height: 12),
        const Text(
          'farklı günde beraberdiniz. 📅',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ],
    );
  }

  Widget _buildStreaksPage() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(
              Icons.local_fire_department_rounded,
              color: Colors.orangeAccent,
              size: 84,
            )
            .animate(onPlay: (c) => c.repeat())
            .scale(begin: const Offset(1, 1), end: const Offset(1.2, 1.2)),
        const SizedBox(height: 24),
        const Text(
          'En uzun seriniz',
          style: TextStyle(fontSize: 20, color: Colors.white70),
        ),
        const SizedBox(height: 12),
        Text(
          '${widget.stats.streakMax}',
          style: const TextStyle(
            fontSize: 84,
            fontWeight: FontWeight.w900,
            color: Colors.white,
          ),
        ).animate().scale(duration: 800.ms, curve: Curves.elasticOut),
        const SizedBox(height: 12),
        const Text(
          'gün aralıksız sürdü! 🔥',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ],
    );
  }

  Widget _buildResponseTimePage() {
    final fast = widget.stats.responseTimes.isNotEmpty
        ? widget.stats.responseTimes.first
        : null;
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          'Kimin parmağı daha hızlı? ⚡',
          style: TextStyle(fontSize: 20, color: Colors.white70),
        ),
        const SizedBox(height: 40),
        if (fast != null) ...[
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                Text(
                  fast.user,
                  style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.cta,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '${fast.avgTimeMinutes.toStringAsFixed(1)} dk',
                  style: const TextStyle(
                    fontSize: 48,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                  ),
                ),
                const Text(
                  'ortalama cevap süresi',
                  style: TextStyle(fontSize: 14, color: Colors.white60),
                ),
              ],
            ),
          ).animate().slideY(begin: 0.5, end: 0, curve: Curves.easeOutBack),
        ],
      ],
    );
  }

  Widget _buildHourlyPage() {
    final busiestHour = widget.stats.hourly.isEmpty
        ? 0
        : widget.stats.hourly.reduce((a, b) => a.value > b.value ? a : b).key;
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          'En koyu sohbetler saat',
          style: TextStyle(fontSize: 20, color: Colors.white70),
        ),
        const SizedBox(height: 12),
        Text(
          '${busiestHour.toString().padLeft(2, '0')}:00',
          style: const TextStyle(
            fontSize: 84,
            fontWeight: FontWeight.w900,
            color: Colors.white,
          ),
        ).animate().blur(begin: const Offset(10, 10), end: const Offset(0, 0)),
        const SizedBox(height: 12),
        const Text(
          'civarında döndü. 🌙',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ],
    );
  }

  Widget _buildPersonaPage() {
    final topPersonaEntry = widget.stats.personas.entries.first;
    return Padding(
      padding: const EdgeInsets.all(40.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            'Ve senin ruhun...',
            style: TextStyle(fontSize: 20, color: Colors.white70),
          ),
          const SizedBox(height: 40),
          Container(
            padding: const EdgeInsets.all(30),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Text(
              topPersonaEntry.value.icon,
              style: const TextStyle(fontSize: 84),
            ),
          ).animate().scale(duration: 1.seconds, curve: Curves.elasticOut),
          const SizedBox(height: 30),
          Text(
            topPersonaEntry.key,
            style: const TextStyle(
              fontSize: 24,
              color: AppTheme.cta,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            _translateTitle(topPersonaEntry.value.titleKey),
            style: const TextStyle(
              fontSize: 42,
              fontWeight: FontWeight.w900,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDNAPage() {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            'Sohbet DNA\'nız 🧬',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ).animate().fadeIn().scale(),
          const SizedBox(height: 40),
          SizedBox(
            height: 400,
            child: RadarChartWidget(dna: widget.stats.relationshipDNA),
          ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.2),
        ],
      ),
    );
  }

  Widget _buildEndPage() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(Icons.favorite_rounded, color: Colors.pinkAccent, size: 84)
            .animate(onPlay: (c) => c.repeat())
            .scale(begin: const Offset(1, 1), end: const Offset(1.2, 1.2)),
        const SizedBox(height: 40),
        const Text(
          'Dostluğunuzun hikayesi\ndevam ediyor.',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 40),
        ElevatedButton(
          onPressed: () => Navigator.pop(context),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor: Colors.black,
            padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30),
            ),
          ),
          child: const Text(
            'Kapat',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
      ],
    );
  }

  Widget _buildWeeklyPage() {
    const days = [
      'Pazartesi',
      'Salı',
      'Çarşamba',
      'Perşembe',
      'Cuma',
      'Cumartesi',
      'Pazar',
    ];
    final weekdayStats = widget.stats.weekdayStats;
    final maxVal = weekdayStats.values.isEmpty
        ? 1
        : weekdayStats.values.reduce((a, b) => a > b ? a : b);
    final bestDayIdx = weekdayStats.entries.isEmpty
        ? 1
        : weekdayStats.entries.reduce((a, b) => a.value > b.value ? a : b).key;

    return Padding(
      padding: const EdgeInsets.all(32.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            'Haftalık Ritm 📊',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ).animate().fadeIn(),
          const SizedBox(height: 20),
          Text(
            'Sohbetin en çok ${days[bestDayIdx - 1]} günü canlanıyor!',
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 18, color: Colors.white70),
          ).animate().fadeIn(delay: 400.ms),
          const SizedBox(height: 60),
          SizedBox(
            height: 240,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: List.generate(7, (i) {
                final val = weekdayStats[i + 1] ?? 0;
                return Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        height: (val / maxVal) * 200,
                        decoration: BoxDecoration(
                          color: i + 1 == bestDayIdx
                              ? Colors.white
                              : Colors.white24,
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ).animate().scaleY(begin: 0, delay: (i * 100).ms),
                      const SizedBox(height: 12),
                      Text(
                        days[i].substring(0, 1),
                        style: TextStyle(
                          color: i + 1 == bestDayIdx
                              ? Colors.white
                              : Colors.white54,
                          fontWeight: i + 1 == bestDayIdx
                              ? FontWeight.bold
                              : FontWeight.normal,
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLinksPage() {
    final domains = widget.stats.topDomains;
    return Padding(
      padding: const EdgeInsets.all(32.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.link_rounded, size: 64, color: Colors.white),
          const SizedBox(height: 24),
          const Text(
            'Link Meraklısı 🔗',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ).animate().fadeIn(),
          const SizedBox(height: 16),
          const Text(
            'Bunları paylaşmadan duramadınız:',
            style: TextStyle(fontSize: 18, color: Colors.white70),
          ).animate().fadeIn(delay: 400.ms),
          const SizedBox(height: 48),
          if (domains.isEmpty)
            const Text(
              'Hiç link paylaşmamışsınız!',
              style: TextStyle(color: Colors.white54),
            )
          else
            ...domains
                .take(3)
                .map(
                  (e) => Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.public_rounded,
                          color: Colors.white70,
                          size: 20,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            e.key,
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Text(
                          '${e.value}',
                          style: const TextStyle(color: Colors.white54),
                        ),
                      ],
                    ),
                  ).animate().slideX(begin: 1, delay: 600.ms),
                ),
        ],
      ),
    );
  }

  String _translateTitle(String key) {
    final Map<String, String> tr = {
      'persona_night_owl_title': 'Gece Kuşu',
      'persona_early_bird_title': 'Erkenci Kuş',
      'persona_emoji_lover_title': 'Emoji Aşığı',
      'persona_philosopher_title': 'Filozof',
      'persona_quick_draw_title': 'Hızlı Silahşör',
      'persona_chatterbox_title': 'Çenebaz',
    };
    return tr[key] ?? key;
  }
}
