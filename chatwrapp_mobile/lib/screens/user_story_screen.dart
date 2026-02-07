import 'package:flutter/material.dart';
import 'package:chatwrapp_mobile/models/chat_data.dart';
import 'package:chatwrapp_mobile/theme/app_theme.dart';
import 'package:chatwrapp_mobile/widgets/radar_chart_widget.dart';
import 'package:flutter_animate/flutter_animate.dart';

class UserStoryScreen extends StatefulWidget {
  final String userName;
  final ChatStats stats;

  const UserStoryScreen({
    super.key,
    required this.userName,
    required this.stats,
  });

  @override
  State<UserStoryScreen> createState() => _UserStoryScreenState();
}

class _UserStoryScreenState extends State<UserStoryScreen> {
  int _currentIndex = 0;
  final PageController _pageController = PageController();
  late List<Widget> _pages;
  late UserStat _userStat;
  late Persona? _userPersona;
  late UserDNA? _userDNA;

  @override
  void initState() {
    super.initState();
    _userStat = widget.stats.userStats[widget.userName] ?? UserStat();
    _userPersona = widget.stats.personas[widget.userName];
    _userDNA = widget.stats.relationshipDNA.firstWhere(
      (d) => d.user == widget.userName,
      orElse: () => UserDNA(
        user: widget.userName,
        laughter: 0,
        media: 0,
        night: 0,
        empathy: 0,
        consistency: 0,
        vibe: "Gizemli",
      ),
    );

    _pages = [
      _buildWelcomePage(),
      _buildMessageCountPage(),
      _buildVocabularyPage(),
      _buildEmojiPage(),
      _buildHourlyPage(),
      _buildPersonaPage(),
      _buildDNAPage(),
      _buildEndPage(),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: Stack(
        children: [
          // Background
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

          // Progress
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

          // Navigation
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

          // Close
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
      [const Color(0xFF1E293B), const Color(0xFF0F172A)], // Welcome
      [const Color(0xFF0EA5E9), const Color(0xFF0369A1)], // Msg Count
      [const Color(0xFF8B5CF6), const Color(0xFF6D28D9)], // Vocab
      [const Color(0xFFEC4899), const Color(0xFFBE123C)], // Emoji
      [const Color(0xFFF59E0B), const Color(0xFFD97706)], // Hourly
      [const Color(0xFF10B981), const Color(0xFF047857)], // Persona
      [const Color(0xFF6366F1), const Color(0xFF4338CA)], // DNA
      [const Color(0xFF1E293B), const Color(0xFF0F172A)], // End
    ];
    return grads[idx % grads.length];
  }

  Widget _buildWelcomePage() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          'Bir efsanenin hikayesi...',
          style: TextStyle(fontSize: 20, color: Colors.white70),
        ).animate().fadeIn(delay: 400.ms),
        const SizedBox(height: 16),
        Text(
          widget.userName,
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 42,
            fontWeight: FontWeight.w900,
            color: Colors.white,
            letterSpacing: -1,
          ),
        ).animate().scale(duration: 600.ms, curve: Curves.easeOutBack),
        const SizedBox(height: 24),
        const Text(
          'Senin 2024 özetin yayında! ✨',
          style: TextStyle(fontSize: 18, color: AppTheme.cta),
        ).animate().fadeIn(delay: 800.ms),
      ],
    );
  }

  Widget _buildMessageCountPage() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          'Bu yıl grupta tam',
          style: TextStyle(fontSize: 22, color: Colors.white70),
        ),
        const SizedBox(height: 20),
        Text(
          '${_userStat.count}',
          style: const TextStyle(
            fontSize: 96,
            fontWeight: FontWeight.w900,
            color: Colors.white,
          ),
        ).animate().scale(duration: 800.ms, curve: Curves.elasticOut),
        const SizedBox(height: 20),
        const Text(
          'mesajınla tozu dumana kattın! 🔥',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ).animate().slideY(begin: 0.5, end: 0, curve: Curves.easeOutBack),
      ],
    );
  }

  Widget _buildVocabularyPage() {
    final topWords = _userStat.topWords.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    return Padding(
      padding: const EdgeInsets.all(32.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            'Kelimelerin efendisi! 📚',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 40),
          if (topWords.isEmpty)
            const Text(
              'Henüz yeterince kelime yok...',
              style: TextStyle(color: Colors.white60),
            )
          else
            ...topWords
                .take(5)
                .map(
                  (e) => Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 16,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      children: [
                        Text(
                          e.key,
                          style: const TextStyle(
                            fontSize: 20,
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          '${e.value} kez',
                          style: const TextStyle(color: Colors.white70),
                        ),
                      ],
                    ),
                  ).animate().slideX(begin: 1, delay: 200.ms),
                ),
        ],
      ),
    );
  }

  Widget _buildEmojiPage() {
    final topEmojis = _userStat.topEmojis.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          'En sevdiğin emojin 😎',
          style: TextStyle(fontSize: 24, color: Colors.white70),
        ),
        const SizedBox(height: 40),
        if (topEmojis.isEmpty)
          const Text(
            'Emojisiz bir hayat...',
            style: TextStyle(color: Colors.white60),
          )
        else
          Container(
            padding: const EdgeInsets.all(40),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Text(
              topEmojis.first.key,
              style: const TextStyle(fontSize: 100),
            ),
          ).animate().scale(duration: 1.seconds, curve: Curves.elasticOut),
        const SizedBox(height: 30),
        Text(
          'Tam ${topEmojis.isNotEmpty ? topEmojis.first.value : 0} kez kullandın!',
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ],
    );
  }

  Widget _buildHourlyPage() {
    final hours = _userStat.hourlyMessages.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));
    final bestHour = hours.isEmpty ? 0 : hours.first.key;

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(
          Icons.access_time_filled_rounded,
          color: Colors.white,
          size: 64,
        ),
        const SizedBox(height: 24),
        const Text(
          'Senin en aktif saatin',
          style: TextStyle(fontSize: 22, color: Colors.white70),
        ),
        const SizedBox(height: 16),
        Text(
          '${bestHour.toString().padLeft(2, '0')}:00',
          style: const TextStyle(
            fontSize: 84,
            fontWeight: FontWeight.w900,
            color: Colors.white,
          ),
        ).animate().blur(begin: const Offset(10, 10), end: const Offset(0, 0)),
        const SizedBox(height: 24),
        const Text(
          'Sohbetin parlayan yıldızısın! ✨',
          style: TextStyle(fontSize: 18, color: Colors.white),
        ),
      ],
    );
  }

  Widget _buildPersonaPage() {
    return Padding(
      padding: const EdgeInsets.all(40.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            'Senin karakterin...',
            style: TextStyle(fontSize: 22, color: Colors.white70),
          ),
          const SizedBox(height: 40),
          if (_userPersona != null) ...[
            Container(
              padding: const EdgeInsets.all(30),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Text(
                _userPersona!.icon,
                style: const TextStyle(fontSize: 84),
              ),
            ).animate().scale(duration: 1.seconds, curve: Curves.elasticOut),
            const SizedBox(height: 30),
            Text(
              _translateTitle(_userPersona!.titleKey),
              style: const TextStyle(
                fontSize: 42,
                fontWeight: FontWeight.w900,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              _translateDesc(_userPersona!.descKey),
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16, color: Colors.white70),
            ),
          ],
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
            'Senin DNA\'n 🧬',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ).animate().fadeIn(),
          const SizedBox(height: 40),
          if (_userDNA != null)
            SizedBox(
              height: 400,
              child: RadarChartWidget(dna: [_userDNA!]),
            ).animate().fadeIn(delay: 500.ms),
        ],
      ),
    );
  }

  Widget _buildEndPage() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        CircleAvatar(
          radius: 60,
          backgroundColor: Colors.white.withOpacity(0.1),
          child: Text(
            widget.userName.substring(0, 1).toUpperCase(),
            style: const TextStyle(
              fontSize: 48,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ).animate().scale(),
        const SizedBox(height: 32),
        const Text(
          'İyi ki varsın!',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          widget.userName,
          style: const TextStyle(fontSize: 20, color: Colors.white70),
        ),
        const SizedBox(height: 48),
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
            'Geri Dön',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
      ],
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

  String _translateDesc(String key) {
    final Map<String, String> tr = {
      'persona_night_owl_desc':
          'Geceleri daha aktifsin, derin sohbetlerin kahramanısın.',
      'persona_early_bird_desc':
          'Güne sohbetle başlamayı seviyorsun, sabahın enerjisi sensin.',
      'persona_emoji_lover_desc':
          'Duygularını kelimeler yerine emojilerle anlatmayı tercih ediyorsun.',
      'persona_philosopher_desc':
          'Uzun ve anlamlı cümleler kuruyorsun, sohbetlerin derinliği senden sorulur.',
      'persona_quick_draw_desc':
          'Kısa ve öz cevaplarla hızına kimse yetişemiyor.',
      'persona_chatterbox_desc':
          'Sohbetin kalbi sensin, anlatacak çok şeyin var!',
    };
    return tr[key] ?? key;
  }
}
