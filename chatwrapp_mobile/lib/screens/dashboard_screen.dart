import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:chatwrapp_mobile/providers/chat_provider.dart';
import 'package:chatwrapp_mobile/theme/app_theme.dart';
import 'package:chatwrapp_mobile/widgets/glass_card.dart';
import '../widgets/radar_chart_widget.dart';
import 'package:chatwrapp_mobile/models/chat_data.dart';
import 'package:chatwrapp_mobile/screens/story_screen.dart';
import 'package:chatwrapp_mobile/screens/user_story_screen.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter_animate/flutter_animate.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentPersonaIndex = 0;
  int _touchedPieIndex = -1;
  final PageController _personaController = PageController();

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<ChatProvider>(context);
    try {
      final stats = provider.stats!;
      final personas = stats.personas.entries.toList();

      return Scaffold(
        backgroundColor: AppTheme.background,
        body: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            SliverAppBar(
              backgroundColor: AppTheme.background,
              floating: true,
              centerTitle: false,
              leading: IconButton(
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (c) => StoryScreen(stats: stats)),
                ),
                icon: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFF97316), Color(0xFFEC4899)],
                    ),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.auto_awesome_rounded,
                    color: Colors.white,
                    size: 18,
                  ),
                ),
              ),
              title: const Text(
                'ChatWrapp',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
              ),
              actions: [
                IconButton(
                  onPressed: () => provider.reset(),
                  icon: const Icon(
                    Icons.refresh_rounded,
                    color: AppTheme.textMuted,
                  ),
                ),
                const SizedBox(width: 8),
              ],
            ),
            SliverToBoxAdapter(
              child: Container(
                height: 110,
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 5,
                ),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  child: Row(
                    children: stats.users
                        .where((u) => u.isNotEmpty)
                        .take(20)
                        .map(
                          (u) => GestureDetector(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (c) => UserStoryScreen(
                                    userName: u,
                                    stats: stats,
                                  ),
                                ),
                              );
                            },
                            child: Container(
                              margin: const EdgeInsets.only(right: 16),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(3),
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      gradient: LinearGradient(
                                        colors: [
                                          AppTheme.primary,
                                          AppTheme.secondary,
                                        ],
                                      ),
                                    ),
                                    child: CircleAvatar(
                                      radius: 28,
                                      backgroundColor: AppTheme.surface,
                                      child: Text(
                                        u.substring(0, 1).toUpperCase(),
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    u.length > 10
                                        ? '${u.substring(0, 7)}...'
                                        : u,
                                    style: const TextStyle(
                                      fontSize: 10,
                                      color: AppTheme.textDim,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        )
                        .toList(),
                  ),
                ),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  Column(
                    children: [
                      SizedBox(
                        height: 380,
                        child: PageView.builder(
                          controller: _personaController,
                          onPageChanged: (idx) =>
                              setState(() => _currentPersonaIndex = idx),
                          itemCount: personas.length,
                          itemBuilder: (context, i) => _buildPersonaCard(
                            personas[i].key,
                            personas[i].value,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                          personas.length,
                          (idx) => Container(
                            width: _currentPersonaIndex == idx ? 12 : 4,
                            height: 4,
                            margin: const EdgeInsets.symmetric(horizontal: 2),
                            decoration: BoxDecoration(
                              color: _currentPersonaIndex == idx
                                  ? AppTheme.cta
                                  : Colors.white24,
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      _buildBusiestHoursCard(stats.hourly),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: _buildMetricCard(
                          'Mesaj',
                          stats.totalMessages.toString(),
                          Icons.message_rounded,
                          AppTheme.cta,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildMetricCard(
                          'Kullanıcı',
                          stats.users.length.toString(),
                          Icons.people_rounded,
                          AppTheme.accent,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildMetricCard(
                          'Gün',
                          stats.timeline.length.toString(),
                          Icons.calendar_today_rounded,
                          const Color(0xFFA855F7),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildMessageHistoryCard(stats.timeline),
                  const SizedBox(height: 16),
                  _buildRelationshipDNACard(stats.relationshipDNA),
                  const SizedBox(height: 16),
                  Column(
                    children: [
                      _buildUserDistributionCard(stats),
                      const SizedBox(height: 16),
                      _buildTopWordsCard(stats.topWords),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildWeekdayCard(stats.weekdayStats),
                  const SizedBox(height: 16),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(child: _buildEmojiCard(stats.topEmojis)),
                      const SizedBox(width: 16),
                      Expanded(child: _buildDomainCard(stats.topDomains)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildFirstMessagesCard(stats.firstMessages),
                  const SizedBox(height: 16),
                  _buildResponseTimeCard(stats.responseTimes),
                  const SizedBox(height: 16),
                  _buildStartersCard(stats.conversationStarters),
                  const SizedBox(height: 16),
                  _buildChatUniverseCard(stats.dailyActivity),
                  const SizedBox(height: 16),
                  const SizedBox(height: 16),
                  _buildMediaStatsCard(stats.mediaStats),
                  const SizedBox(height: 80),
                ]),
              ),
            ),
          ],
        ),
      );
    } catch (e) {
      return Scaffold(
        backgroundColor: AppTheme.background,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline_rounded,
                color: Colors.redAccent,
                size: 48,
              ),
              const SizedBox(height: 16),
              const Text('Analiz ekranı yüklenirken bir sorun oluştu.'),
              TextButton(
                onPressed: () => provider.reset(),
                child: const Text('Geri Dön'),
              ),
            ],
          ),
        ),
      );
    }
  }

  Widget _buildWeekdayCard(Map<int, int> weekdayStats) {
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    final maxVal = weekdayStats.values.isEmpty
        ? 0
        : weekdayStats.values.reduce((a, b) => a > b ? a : b);

    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'HAFTALIK YOĞUNLUK',
            style: TextStyle(
              color: AppTheme.textMuted,
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 150,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: List.generate(7, (i) {
                final val = weekdayStats[i + 1] ?? 0;
                final heightFactor = maxVal == 0 ? 0.0 : val / maxVal;
                return Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        height: 100 * heightFactor,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              AppTheme.primary,
                              AppTheme.secondary.withOpacity(0.5),
                            ],
                            begin: Alignment.bottomCenter,
                            end: Alignment.topCenter,
                          ),
                          borderRadius: BorderRadius.circular(6),
                        ),
                      ).animate().scaleY(
                        begin: 0,
                        duration: 800.ms,
                        curve: Curves.easeOutBack,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        days[i],
                        style: const TextStyle(
                          color: AppTheme.textDim,
                          fontSize: 10,
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

  Widget _buildDomainCard(List<MapEntry<String, int>> domains) {
    return GlassCard(
      height: 280,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'EN ÇOK PAYLAŞILAN LİNKLER',
            style: TextStyle(
              color: AppTheme.textMuted,
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 16),
          if (domains.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 20),
                child: Text(
                  'Link bulunamadı',
                  style: TextStyle(color: AppTheme.textDim, fontSize: 12),
                ),
              ),
            )
          else
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                physics: const BouncingScrollPhysics(),
                children: domains
                    .map(
                      (e) => Padding(
                        padding: const EdgeInsets.only(bottom: 12.0),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: AppTheme.secondary.withOpacity(0.1),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.link_rounded,
                                color: AppTheme.secondary,
                                size: 16,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                e.key,
                                style: const TextStyle(
                                  color: AppTheme.textMain,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                    .toList(),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildRelationshipDNACard(List<UserDNA> dna) {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'ARKADAŞLIK DNA\'SI',
            style: TextStyle(
              color: AppTheme.textMuted,
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(height: 250, child: RadarChartWidget(dna: dna)),
        ],
      ),
    );
  }

  Widget _buildPersonaCard(String user, Persona p) {
    return GlassCard(
      useBlur: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'KARAKTER ANALİZİ',
            style: TextStyle(
              color: AppTheme.textMuted,
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.5,
            ),
          ),
          const Spacer(),
          Center(
            child: Stack(
              alignment: Alignment.center,
              children: [
                Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: AppTheme.cta.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                    )
                    .animate(onPlay: (c) => c.repeat(reverse: true))
                    .scale(
                      begin: const Offset(1, 1),
                      end: const Offset(1.1, 1.1),
                      duration: 2.seconds,
                    ),
                Text(p.icon, style: const TextStyle(fontSize: 54)),
              ],
            ),
          ),
          const Spacer(),
          Text(
            user,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: AppTheme.cta,
            ),
            overflow: TextOverflow.ellipsis,
          ),
          Text(
            _translatePersona(p.titleKey),
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              height: 1.1,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            _translatePersona(p.descKey),
            style: const TextStyle(
              fontSize: 11,
              color: AppTheme.textMuted,
              height: 1.4,
            ),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildBusiestHoursCard(List<MapEntry<int, int>> hourly) {
    if (hourly.isEmpty) return const SizedBox();

    final peak = hourly.reduce((a, b) => a.value > b.value ? a : b);

    // Determine vibe
    String vibe = "Gün Ortası";
    if (peak.key >= 0 && peak.key < 6)
      vibe = "Gece Kuşları 🌙";
    else if (peak.key >= 6 && peak.key < 12)
      vibe = "Erkenci Kuşlar 🌅";
    else if (peak.key >= 12 && peak.key < 18)
      vibe = "Günlük Tempo ☕";
    else
      vibe = "Akşam Muhabbeti ✨";

    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'GÜNÜN EN YOĞUN SAATLERİ',
                    style: TextStyle(
                      color: AppTheme.textMuted,
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    vibe,
                    style: TextStyle(
                      color: AppTheme.accent.withOpacity(0.8),
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppTheme.accent.withOpacity(0.2),
                      AppTheme.accent.withOpacity(0.05),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.accent.withOpacity(0.2)),
                ),
                child: Column(
                  children: [
                    Text(
                      '${peak.value}',
                      style: const TextStyle(
                        color: AppTheme.accent,
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const Text(
                      'Mesaj/Saat',
                      style: TextStyle(color: AppTheme.textMuted, fontSize: 8),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 32),
          SizedBox(
            height: 200,
            child: BarChart(
              BarChartData(
                alignment: BarChartAlignment.spaceBetween,
                maxY: peak.value.toDouble() * 1.2,
                barTouchData: BarTouchData(
                  enabled: true,
                  touchTooltipData: BarTouchTooltipData(
                    getTooltipColor: (_) => AppTheme.cardBg,
                    tooltipPadding: const EdgeInsets.all(8),
                    tooltipMargin: 8,
                    getTooltipItem: (group, groupIndex, rod, rodIndex) {
                      return BarTooltipItem(
                        '${group.x}:00\n',
                        const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                        children: [
                          TextSpan(
                            text: '${rod.toY.toInt()} mesaj',
                            style: const TextStyle(
                              color: AppTheme.accent,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),
                titlesData: FlTitlesData(
                  show: true,
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 30,
                      getTitlesWidget: (value, meta) {
                        if (value % 4 != 0 && value != 23)
                          return const SizedBox();
                        return SideTitleWidget(
                          meta: meta,
                          space: 10,
                          child: Text(
                            '${value.toInt()}:00',
                            style: TextStyle(
                              color: AppTheme.textMuted.withOpacity(0.5),
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  leftTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  topTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  rightTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                ),
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  horizontalInterval: peak.value / 4,
                  getDrawingHorizontalLine: (v) => FlLine(
                    color: Colors.white.withOpacity(0.03),
                    strokeWidth: 1,
                  ),
                ),
                borderData: FlBorderData(show: false),
                barGroups: hourly.map((e) {
                  final isPeak = e.key == peak.key;
                  return BarChartGroupData(
                    x: e.key,
                    barRods: [
                      BarChartRodData(
                        toY: e.value.toDouble(),
                        width: 8,
                        color: isPeak
                            ? AppTheme.accent
                            : AppTheme.accent.withOpacity(0.3),
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(4),
                        ),
                        gradient: LinearGradient(
                          colors: [
                            isPeak
                                ? AppTheme.accent
                                : AppTheme.accent.withOpacity(0.6),
                            AppTheme.accent.withOpacity(0.0),
                          ],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                      ),
                    ],
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 600.ms).scale(begin: const Offset(0.95, 0.95));
  }

  Widget _buildMetricCard(
    String title,
    String val,
    IconData icon,
    Color color,
  ) {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 12),
          Text(
            val,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
          ),
          Text(
            title,
            style: const TextStyle(
              fontSize: 10,
              color: AppTheme.textMuted,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageHistoryCard(List<MapEntry<String, int>> timeline) {
    if (timeline.isEmpty) return const SizedBox.shrink();

    // Veri noktaları çok fazlaysa (50'den fazla), görsel karmaşayı önlemek için seyreltiyoruz
    final List<MapEntry<String, int>> displayData;
    if (timeline.length > 50) {
      final step = (timeline.length / 50).ceil();
      displayData = [];
      for (int i = 0; i < timeline.length; i += step) {
        displayData.add(timeline[i]);
      }
    } else {
      displayData = timeline;
    }

    return GlassCard(
      padding: const EdgeInsets.fromLTRB(12, 24, 12, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'MESAJ GEÇMİŞİ',
                  style: TextStyle(
                    color: AppTheme.textMuted,
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 2,
                  ),
                ),
                Text(
                  '${timeline.length} Günlük Analiz',
                  style: TextStyle(
                    color: AppTheme.primary.withOpacity(0.7),
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          SizedBox(
            height: 180,
            child: LineChart(
              LineChartData(
                lineTouchData: LineTouchData(
                  touchTooltipData: LineTouchTooltipData(
                    getTooltipColor: (_) => AppTheme.cardBg.withOpacity(0.95),
                    getTooltipItems: (touchedSpots) {
                      return touchedSpots.map((spot) {
                        return LineTooltipItem(
                          '${displayData[spot.x.toInt()].key}\n',
                          const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                          children: [
                            TextSpan(
                              text: '${spot.y.toInt()} mesaj',
                              style: const TextStyle(
                                color: AppTheme.primary,
                                fontSize: 10,
                                fontWeight: FontWeight.normal,
                              ),
                            ),
                          ],
                        );
                      }).toList();
                    },
                  ),
                  getTouchedSpotIndicator: (bar, indexes) => indexes.map((i) {
                    return TouchedSpotIndicatorData(
                      const FlLine(color: Colors.white10, strokeWidth: 1),
                      FlDotData(
                        getDotPainter: (s, p, b, i) => FlDotCirclePainter(
                          radius: 5,
                          color: AppTheme.primary,
                          strokeWidth: 2,
                          strokeColor: Colors.white,
                        ),
                      ),
                    );
                  }).toList(),
                ),
                gridData: const FlGridData(show: false),
                titlesData: const FlTitlesData(show: false),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    spots: displayData
                        .asMap()
                        .entries
                        .map(
                          (e) => FlSpot(
                            e.key.toDouble(),
                            e.value.value.toDouble(),
                          ),
                        )
                        .toList(),
                    isCurved: true,
                    curveSmoothness: 0.4,
                    color: AppTheme.primary,
                    gradient: const LinearGradient(
                      colors: [AppTheme.secondary, AppTheme.primary],
                    ),
                    barWidth: 4,
                    isStrokeCapRound: true,
                    dotData: const FlDotData(show: false),
                    belowBarData: BarAreaData(
                      show: true,
                      gradient: LinearGradient(
                        colors: [
                          AppTheme.primary.withOpacity(0.2),
                          AppTheme.primary.withOpacity(0.0),
                        ],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                    shadow: Shadow(
                      color: AppTheme.primary.withOpacity(0.5),
                      blurRadius: 15,
                      offset: const Offset(0, 5),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  timeline.first.key,
                  style: const TextStyle(color: AppTheme.textDim, fontSize: 9),
                ),
                Text(
                  timeline.last.key,
                  style: const TextStyle(color: AppTheme.textDim, fontSize: 9),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUserDistributionCard(ChatStats stats) {
    const List<Color> eliteColors = [
      Color(0xFF10B981),
      Color(0xFF3B82F6),
      Color(0xFFF59E0B),
      Color(0xFFEC4899),
      Color(0xFF8B5CF6),
      Color(0xFF06B6D4),
      Color(0xFFF43F5E),
      Color(0xFF14B8A6),
      Color(0xFFF97316),
      Color(0xFF84CC16),
      Color(0xFF0EA5E9),
      Color(0xFFD946EF),
      Color(0xFF6366F1),
      Color(0xFF22C55E),
      Color(0xFFFACC15),
      Color(0xFF38BDF8),
      Color(0xFFF472B6),
      Color(0xFFFB923C),
      Color(0xFF4ADE80),
      Color(0xFF818CF8),
      Color(0xFF2DD4BF),
    ];

    return GlassCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'PAYLAŞIM',
                style: TextStyle(
                  color: AppTheme.textMuted,
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.2,
                ),
              ),
              Text(
                '${stats.users.length} Katılımcı',
                style: TextStyle(
                  color: AppTheme.primary.withOpacity(0.8),
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Center(
            child: SizedBox(
              height: 180,
              width: 180,
              child: PieChart(
                PieChartData(
                  pieTouchData: PieTouchData(
                    touchCallback: (FlTouchEvent event, pieTouchResponse) {
                      setState(() {
                        if (!event.isInterestedForInteractions ||
                            pieTouchResponse == null ||
                            pieTouchResponse.touchedSection == null) {
                          _touchedPieIndex = -1;
                          return;
                        }
                        _touchedPieIndex = pieTouchResponse
                            .touchedSection!
                            .touchedSectionIndex;
                      });
                    },
                  ),
                  sectionsSpace: 4,
                  centerSpaceRadius: 40,
                  sections: stats.userStats.entries.map((e) {
                    final idx = stats.users.indexOf(e.key);
                    final isTouched = idx == _touchedPieIndex;
                    final color = eliteColors[idx % eliteColors.length];

                    return PieChartSectionData(
                      value: e.value.count.toDouble(),
                      color: color,
                      radius: isTouched ? 35.0 : 25.0,
                      showTitle: isTouched,
                      title:
                          '${(e.value.count / stats.totalMessages * 100).toStringAsFixed(0)}%',
                      titleStyle: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),
          ),
          const SizedBox(height: 32),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: stats.userStats.entries.map((e) {
              final idx = stats.users.indexOf(e.key);
              final isTouched = idx == _touchedPieIndex;
              final color = eliteColors[idx % eliteColors.length];
              final percent = (e.value.count / stats.totalMessages * 100)
                  .toStringAsFixed(0);

              return AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: isTouched
                      ? color.withOpacity(0.15)
                      : Colors.white.withOpacity(0.03),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: isTouched
                        ? color.withOpacity(0.4)
                        : Colors.white.withOpacity(0.05),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: color,
                        boxShadow: [
                          BoxShadow(
                            color: color.withOpacity(0.4),
                            blurRadius: 4,
                            spreadRadius: 1,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      e.key,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: isTouched
                            ? FontWeight.bold
                            : FontWeight.w500,
                        color: isTouched ? Colors.white : AppTheme.textMuted,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '$percent%',
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w900,
                        color: isTouched ? color : AppTheme.textDim,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildTopWordsCard(List<MapEntry<String, int>> words) {
    return GlassCard(
      height: 350,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'KELİMELER',
            style: TextStyle(
              color: AppTheme.textMuted,
              fontSize: 10,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: words
                    .take(50)
                    .map(
                      (e) => Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.04),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.08),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              e.key,
                              style: const TextStyle(
                                fontSize: 12,
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(width: 6),
                            Text(
                              e.value.toString(),
                              style: TextStyle(
                                fontSize: 9,
                                color: AppTheme.accent.withOpacity(0.7),
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                    .toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmojiCard(List<MapEntry<String, int>> emojis) {
    if (emojis.isEmpty) return const SizedBox.shrink();
    final maxCount = emojis[0].value;
    return GlassCard(
      height: 280,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'EMOJİLER',
            style: TextStyle(
              color: AppTheme.textMuted,
              fontSize: 10,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              physics: const BouncingScrollPhysics(),
              children: emojis
                  .map(
                    (e) => Padding(
                      padding: const EdgeInsets.only(bottom: 12.0),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(e.key, style: const TextStyle(fontSize: 16)),
                              Text(
                                e.value.toString(),
                                style: const TextStyle(
                                  fontSize: 10,
                                  color: AppTheme.textMuted,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          LinearProgressIndicator(
                            value: e.value / maxCount,
                            backgroundColor: Colors.white.withOpacity(0.05),
                            color: Colors.pinkAccent,
                            minHeight: 4,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ],
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFirstMessagesCard(List<ChatMessage> msgs) {
    // Filter out system messages that survived initial parsing
    final displayMsgs = msgs
        .where(
          (m) =>
              !m.content.toLowerCase().contains('medya dahil edilmedi') &&
              !m.content.toLowerCase().contains('mesaj silindi'),
        )
        .toList();

    return GlassCard(
      height: 400,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text(
                'NASIL BAŞLADI?',
                style: TextStyle(
                  color: AppTheme.textMuted,
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1,
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.accent.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'İLK MESAJLAR',
                  style: TextStyle(
                    color: AppTheme.accent,
                    fontSize: 8,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.zero,
              physics: const BouncingScrollPhysics(),
              itemCount: displayMsgs.length,
              itemBuilder: (context, i) {
                final m = displayMsgs[i];
                final isFirst = i == 0;

                return Padding(
                  padding: const EdgeInsets.only(bottom: 16.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: [
                              Colors.white.withOpacity(0.1),
                              Colors.white.withOpacity(0.05),
                            ],
                          ),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          m.author.substring(0, 1).toUpperCase(),
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.white70,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  m.author,
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: isFirst
                                        ? AppTheme.cta
                                        : AppTheme.textDim,
                                  ),
                                ),
                                if (isFirst) ...[
                                  const SizedBox(width: 6),
                                  const Icon(
                                    Icons.auto_awesome,
                                    size: 10,
                                    color: AppTheme.cta,
                                  ),
                                ],
                              ],
                            ),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: isFirst
                                    ? AppTheme.cta.withOpacity(0.1)
                                    : Colors.white.withOpacity(0.03),
                                borderRadius: BorderRadius.only(
                                  topRight: const Radius.circular(16),
                                  bottomLeft: const Radius.circular(16),
                                  bottomRight: const Radius.circular(16),
                                  topLeft: i % 2 == 0
                                      ? Radius.zero
                                      : const Radius.circular(16),
                                ),
                                border: Border.all(
                                  color: isFirst
                                      ? AppTheme.cta.withOpacity(0.2)
                                      : Colors.white.withOpacity(0.05),
                                ),
                              ),
                              child: Text(
                                m.content.trim().isEmpty
                                    ? '(boş mesaj)'
                                    : m.content.trim(),
                                style: TextStyle(
                                  fontSize: 12,
                                  color: isFirst
                                      ? Colors.white
                                      : Colors.white.withOpacity(0.8),
                                  height: 1.4,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResponseTimeCard(List<ResponseTimeStat> stats) {
    if (stats.isEmpty) return const SizedBox.shrink();
    final maxTime = stats
        .map((e) => e.avgTimeMinutes)
        .reduce((a, b) => a > b ? a : b);

    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'CEVAP HIZLARI (DAKİKA)',
            style: TextStyle(
              color: AppTheme.textMuted,
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 24),
          ...stats.map(
            (e) => Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          e.user,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      Text(
                        e.avgTimeMinutes < 0
                            ? '-'
                            : '${e.avgTimeMinutes.toInt()} dk',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.accent.withOpacity(0.9),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: e.avgTimeMinutes < 0
                          ? 0
                          : e.avgTimeMinutes / (maxTime == 0 ? 1 : maxTime),
                      backgroundColor: Colors.white.withOpacity(0.05),
                      color: AppTheme.accent,
                      minHeight: 6,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStartersCard(List<ConversationStarterStat> stats) {
    if (stats.isEmpty) return const SizedBox.shrink();
    final maxCount = stats.map((e) => e.count).reduce((a, b) => a > b ? a : b);

    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'SOHBET BAŞLATANLAR',
            style: TextStyle(
              color: AppTheme.textMuted,
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 24),
          ...stats.map(
            (e) => Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          e.user,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      Text(
                        '${e.count} kez',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.secondary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: e.count / maxCount,
                      backgroundColor: Colors.white.withOpacity(0.05),
                      color: AppTheme.secondary,
                      minHeight: 6,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChatUniverseCard(List<DailyActivityStat> daily) {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'SOHBET EVRENİ',
            style: TextStyle(
              color: AppTheme.textMuted,
              fontSize: 10,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 200,
            child: BarChart(
              BarChartData(
                barTouchData: BarTouchData(
                  enabled: true,
                  touchTooltipData: BarTouchTooltipData(
                    getTooltipColor: (_) => AppTheme.cardBg,
                    tooltipPadding: const EdgeInsets.all(8),
                    tooltipMargin: 8,
                    getTooltipItem: (group, groupIndex, rod, rodIndex) {
                      final day = daily[groupIndex];
                      return BarTooltipItem(
                        '${day.date}\n',
                        const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                        children: [
                          TextSpan(
                            text: '${day.count} mesaj',
                            style: const TextStyle(
                              color: AppTheme.accent,
                              fontSize: 10,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),
                gridData: FlGridData(show: false),
                titlesData: FlTitlesData(show: false),
                borderData: FlBorderData(show: false),
                barGroups: daily
                    .asMap()
                    .entries
                    .map(
                      (e) => BarChartGroupData(
                        x: e.key,
                        barRods: [
                          BarChartRodData(
                            toY: e.value.count.toDouble(),
                            color: AppTheme.accent,
                            width: 2,
                            borderRadius: BorderRadius.circular(0),
                            backDrawRodData: BackgroundBarChartRodData(
                              show: true,
                              toY: 0,
                              color: AppTheme.accent.withOpacity(0.1),
                            ),
                          ),
                        ],
                      ),
                    )
                    .toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMediaStatsCard(List<MapEntry<String, int>> stats) {
    if (stats.isEmpty) return const SizedBox.shrink();
    final maxCount = stats.map((e) => e.value).reduce((a, b) => a > b ? a : b);

    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'PAYLAŞILAN MEDYALAR',
            style: TextStyle(
              color: AppTheme.textMuted,
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 24),
          ...stats.map(
            (e) => Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          e.key,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      Text(
                        '${e.value} medya',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: e.value / (maxCount == 0 ? 1 : maxCount),
                      backgroundColor: Colors.white.withOpacity(0.05),
                      color: AppTheme.primary,
                      minHeight: 6,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _translatePersona(String key) {
    final Map<String, String> tr = {
      'persona_night_owl_title': 'Gece Kuşu',
      'persona_night_owl_desc':
          'Geceleri daha aktifsin, derin sohbetlerin kahramanısın.',
      'persona_early_bird_title': 'Erkenci Kuş',
      'persona_early_bird_desc':
          'Güne sohbetle başlamayı seviyorsun, sabahın enerjisi sensin.',
      'persona_emoji_lover_title': 'Emoji Aşığı',
      'persona_emoji_lover_desc':
          'Duygularını kelimeler yerine emojilerle anlatmayı tercih ediyorsun.',
      'persona_philosopher_title': 'Filozof',
      'persona_philosopher_desc':
          'Uzun ve anlamlı cümleler kuruyorsun, sohbetlerin derinliği senden sorulur.',
      'persona_quick_draw_title': 'Hızlı Silahşör',
      'persona_quick_draw_desc':
          'Kısa ve öz cevaplarla hızına kimse yetişemiyor.',
      'persona_chatterbox_title': 'Çenebaz',
      'persona_chatterbox_desc':
          'Sohbetin kalbi sensin, anlatacak çok şeyin var!',
    };
    return tr[key] ?? key;
  }
}
