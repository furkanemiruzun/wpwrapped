import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:chatwrapp_mobile/providers/chat_provider.dart';
import 'package:chatwrapp_mobile/theme/app_theme.dart';
import 'package:chatwrapp_mobile/screens/dashboard_screen.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:url_launcher/url_launcher.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentStep = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (mounted) {
        setState(() {
          _currentStep = (_currentStep + 1) % 4;
        });
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Deep Background with subtle Glow
          Container(color: AppTheme.background),
          Positioned(
            top: -100,
            right: -100,
            child:
                Container(
                  width: 400,
                  height: 400,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppTheme.cta.withOpacity(0.05),
                  ),
                ).animate().blur(
                  begin: const Offset(80, 80),
                  end: const Offset(100, 100),
                ),
          ),

          Consumer<ChatProvider>(
            builder: (context, provider, child) {
              if (provider.stats != null) {
                return const DashboardScreen();
              }

              return SafeArea(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                  child: Column(
                    children: [
                      const SizedBox(height: 60),

                      // --- HERO SECTION ---
                      Text(
                        '✨ WhatsApp Analizi Yeniden Tasarlandı',
                        style: TextStyle(
                          color: AppTheme.cta,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                          letterSpacing: 1.2,
                        ),
                      ).animate().fadeIn().slideY(begin: 0.1),

                      const SizedBox(height: 16),

                      Text(
                        'Sohbetlerinizdeki\ngizli detayları keşfedin.',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.displayLarge,
                      ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.1),

                      const SizedBox(height: 20),

                      Text(
                        'Konuşma alışkanlıklarınızı, en çok konuşulan konuları,\nuyku düzeninizi ve favori emojilerinizi görselleştirin.',
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.bodyLarge,
                      ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1),

                      const SizedBox(height: 50),

                      // --- UPLOAD ZONE ---
                      _buildUploadZone(context, provider),

                      if (provider.error != null) ...[
                        const SizedBox(height: 16),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.red.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: Colors.redAccent.withOpacity(0.5),
                            ),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                Icons.error_outline_rounded,
                                color: Colors.redAccent,
                                size: 20,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  provider.error!,
                                  style: const TextStyle(
                                    color: Colors.redAccent,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ).animate().shake(),
                      ],

                      const SizedBox(height: 60),

                      // --- FEATURE CARDS (Bento Style) ---
                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        mainAxisSpacing: 16,
                        crossAxisSpacing: 16,
                        childAspectRatio: 1.2,
                        children: [
                          _buildFeatureCard(
                            Icons.lock_outline_rounded,
                            '%100 Gizli',
                            'Analiz tamamen cihazınızda yapılır.',
                            Colors.tealAccent,
                          ),
                          _buildFeatureCard(
                            Icons.bar_chart_rounded,
                            'Derin Analiz',
                            'Kimin en çok konuştuğunu keşfedin.',
                            Colors.blueAccent,
                          ),
                          _buildFeatureCard(
                            Icons.login_rounded,
                            'Giriş Yok',
                            'Üyelik yok, anında sonuç.',
                            Colors.purpleAccent,
                          ),
                          _buildFeatureCard(
                            Icons.offline_bolt_rounded,
                            'Çevrimdışı',
                            'İnternet bağlantısı olmadan çalışır.',
                            Colors.orangeAccent,
                          ),
                        ],
                      ).animate().fadeIn(delay: 800.ms),

                      const SizedBox(height: 60),

                      // --- EXPORT GUIDE ---
                      _buildExportGuide(context),

                      const SizedBox(height: 60),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildUploadZone(BuildContext context, ChatProvider provider) {
    return GestureDetector(
      onTap: provider.isLoading ? null : () => provider.pickAndParseFile(),
      child: Container(
        width: double.infinity,
        height: 180,
        decoration: BoxDecoration(
          color: AppTheme.cardBg.withOpacity(0.5),
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: AppTheme.cta.withOpacity(0.3), width: 1.5),
          boxShadow: [
            BoxShadow(
              color: AppTheme.cta.withOpacity(0.05),
              blurRadius: 40,
              spreadRadius: 10,
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(32),
          child: Stack(
            alignment: Alignment.center,
            children: [
              if (provider.isLoading)
                const CircularProgressIndicator(color: AppTheme.cta)
              else
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.cta.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.file_upload_outlined,
                        color: AppTheme.cta,
                        size: 32,
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      '_chat.txt veya .zip dosyasını bırakın',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Maks dosya boyutu: 10MB - .txt veya .zip',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 12),
                    ),
                  ],
                ),
            ],
          ),
        ),
      ).animate().scale(delay: 600.ms, curve: Curves.easeOutBack),
    );
  }

  Widget _buildExportGuide(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'NASIL DIŞA AKTARILIR?',
          style: TextStyle(
            color: AppTheme.textMuted,
            fontSize: 10,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.5,
          ),
        ),
        const SizedBox(height: 32),
        // --- PHONE MOCKUP ANIMATION ---
        Center(
          child: Container(
            width: 260,
            height: 480,
            decoration: BoxDecoration(
              color: const Color(0xFF1F2937),
              borderRadius: BorderRadius.circular(40),
              border: Border.all(
                color: Colors.white.withOpacity(0.1),
                width: 8,
              ),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.cta.withOpacity(0.1),
                  blurRadius: 40,
                  spreadRadius: 2,
                ),
              ],
            ),
            padding: const EdgeInsets.all(12),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(28),
              child: Container(
                color: const Color(0xFF111827),
                child: Column(
                  children: [
                    Container(
                      height: 24,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            '12:45',
                            style: TextStyle(color: Colors.white, fontSize: 10),
                          ),
                          Row(
                            children: const [
                              Icon(Icons.wifi, size: 10, color: Colors.white),
                              SizedBox(width: 4),
                              Icon(
                                Icons.battery_full,
                                size: 10,
                                color: Colors.white,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      height: 44,
                      color: const Color(0xFF075E54),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Row(
                        children: [
                          const CircleAvatar(
                            radius: 12,
                            backgroundColor: Colors.white24,
                            child: Icon(
                              Icons.group,
                              size: 14,
                              color: Colors.white70,
                            ),
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'Bizim Grup',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                          const Spacer(),
                          const Icon(
                            Icons.more_vert,
                            color: Colors.white,
                            size: 18,
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Stack(
                        children: [
                          _buildMockupContent(_currentStep),
                          _buildStepOverlay(
                                _currentStep + 1,
                                [
                                  'Sohbeti Aç',
                                  'Ayarlar / Diğer',
                                  'Dışa Aktar',
                                  'Medya Olmadan',
                                ][_currentStep],
                                [
                                  Icons.touch_app,
                                  Icons.settings,
                                  Icons.ios_share,
                                  Icons.perm_media,
                                ][_currentStep],
                              )
                              .animate(key: ValueKey(_currentStep))
                              .fadeIn()
                              .scale()
                              .shimmer(),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 40),
        _buildGuideStep(
          '1',
          'Sohbete girip sağ üstteki menüye dokunun.',
          Icons.more_vert,
          isActive: _currentStep == 0,
        ),
        _buildGuideStep(
          '2',
          '"Diğer" -> "Sohbeti dışa aktar" seçeneğini seçin.',
          Icons.ios_share_rounded,
          isActive: _currentStep == 1,
        ),
        _buildGuideStep(
          '3',
          '"MEDYA OLMADAN" seçeneğini işaretleyin.',
          Icons.perm_media_outlined,
          isWarning: true,
          isActive: _currentStep == 2,
        ),
        _buildGuideStep(
          '4',
          'Dosyayı kaydedip yukarıya yükleyin.',
          Icons.file_upload_outlined,
          isActive: _currentStep == 3,
        ),
        const SizedBox(height: 32),
        SizedBox(
              width: double.infinity,
              height: 60,
              child: ElevatedButton.icon(
                onPressed: () async {
                  try {
                    final whatsappUri = Uri.parse("whatsapp://chat");
                    if (await canLaunchUrl(whatsappUri)) {
                      await launchUrl(
                        whatsappUri,
                        mode: LaunchMode.externalApplication,
                      );
                    } else {
                      final webUri = Uri.parse("https://wa.me/");
                      await launchUrl(
                        webUri,
                        mode: LaunchMode.externalApplication,
                      );
                    }
                  } catch (e) {
                    if (context.mounted) {
                      ScaffoldMessenger.of(
                        context,
                      ).showSnackBar(SnackBar(content: Text('Hata: $e')));
                    }
                  }
                },
                icon: const Icon(Icons.chat_bubble_rounded, size: 24),
                label: const Text(
                  'WhatsApp Uygulamasını Aç',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF25D366),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  elevation: 8,
                  shadowColor: const Color(0xFF25D366).withOpacity(0.4),
                ),
              ),
            )
            .animate(onPlay: (c) => c.repeat(reverse: true))
            .shimmer(duration: 3.seconds, color: Colors.white24),
      ],
    );
  }

  Widget _buildMockupContent(int step) {
    return Stack(
      children: [
        ListView(
          padding: const EdgeInsets.all(12),
          children: [
            _mockBubble(false, 'Hafta sonu ne yapıyoruz?'),
            _mockBubble(true, 'Bilmem, Wrapp analizine bakalım mı?'),
            _mockBubble(false, 'Harika fikir! 😍'),
          ],
        ),
        if (step == 0)
          Positioned(
            top: 20,
            right: 10,
            child: Icon(
              Icons.touch_app,
              color: AppTheme.cta,
              size: 28,
            ).animate(onPlay: (c) => c.repeat()).scale(duration: 500.ms),
          ),
        if (step == 1 || step == 2)
          Positioned(
            top: 40,
            right: 12,
            child: Container(
              width: 140,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _mockMenuItem('Grup Bilgisi', false),
                  _mockMenuItem('Grup Medyası', false),
                  _mockMenuItem('Sessize Al', false),
                  _mockMenuItem('Diğer...', step == 1),
                  if (step == 2) _mockMenuItem('Sohbeti Aktar', true),
                ],
              ),
            ),
          ),
        if (step == 3)
          Container(
            color: Colors.black.withOpacity(0.4),
            child: Center(
              child: Container(
                width: 180,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'Sohbeti Aktar?',
                      style: TextStyle(
                        color: Colors.black,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 12),
                    _mockPopupButton('MEDYA EKLE', false),
                    const Divider(height: 1),
                    _mockPopupButton('MEDYA OLMADAN', true),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _mockMenuItem(String text, bool highlight) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: highlight ? AppTheme.cta.withOpacity(0.2) : Colors.transparent,
        border: highlight ? Border.all(color: AppTheme.cta, width: 0.5) : null,
      ),
      child: Text(
        text,
        style: TextStyle(
          color: highlight ? AppTheme.cta : Colors.black87,
          fontSize: 10,
          fontWeight: highlight ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }

  Widget _mockPopupButton(String text, bool highlight) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: TextStyle(
          color: highlight ? Colors.blue : Colors.black87,
          fontSize: 10,
          fontWeight: highlight ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }

  Widget _mockBubble(bool isMe, String text) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isMe ? const Color(0xFFDCF8C6) : Colors.white,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          text,
          style: const TextStyle(color: Colors.black, fontSize: 10),
        ),
      ),
    );
  }

  Widget _buildStepOverlay(int step, String title, IconData icon) {
    return Center(
      child: Container(
        padding: const EdgeInsets.all(20),
        margin: const EdgeInsets.symmetric(horizontal: 30),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.85),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: AppTheme.cta.withOpacity(0.5)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.cta.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: AppTheme.cta, size: 28),
            ),
            const SizedBox(height: 12),
            Text(
              'ADIM $step',
              style: const TextStyle(
                color: AppTheme.cta,
                fontWeight: FontWeight.w900,
                fontSize: 10,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGuideStep(
    String num,
    String text,
    IconData icon, {
    bool isWarning = false,
    bool isActive = false,
  }) {
    return AnimatedOpacity(
      duration: const Duration(milliseconds: 500),
      opacity: isActive ? 1.0 : 0.4,
      child: Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: Row(
          children: [
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: isWarning
                    ? Colors.orange.withOpacity(isActive ? 0.3 : 0.1)
                    : AppTheme.cta.withOpacity(isActive ? 0.3 : 0.1),
                shape: BoxShape.circle,
                border: isActive
                    ? Border.all(
                        color: isWarning ? Colors.orange : AppTheme.cta,
                        width: 2,
                      )
                    : null,
              ),
              child: Center(
                child: Text(
                  num,
                  style: TextStyle(
                    color: isWarning ? Colors.orange : AppTheme.cta,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                text,
                style: TextStyle(
                  color: isWarning ? Colors.orangeAccent : Colors.white,
                  fontSize: 12,
                  fontWeight: isActive || isWarning
                      ? FontWeight.bold
                      : FontWeight.normal,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureCard(
    IconData icon,
    String title,
    String desc,
    Color accent,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.cardBg,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: accent.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: accent, size: 20),
          ),
          const Spacer(),
          Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
          const SizedBox(height: 4),
          Text(
            desc,
            style: const TextStyle(
              color: AppTheme.textMuted,
              fontSize: 10,
              height: 1.3,
            ),
          ),
        ],
      ),
    );
  }
}
