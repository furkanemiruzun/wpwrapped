import 'dart:math';
import 'package:flutter/material.dart';
import '../models/chat_data.dart';

class RadarChartWidget extends StatelessWidget {
  final List<UserDNA> dna;
  final List<Color> colors = [
    Colors.greenAccent,
    Colors.blueAccent,
    Colors.orangeAccent,
    Colors.pinkAccent,
  ];

  RadarChartWidget({super.key, required this.dna});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: CustomPaint(
            size: Size.infinite,
            painter: RadarPainter(
              dna: dna,
              colors: colors,
              labels: [
                'Mizah Geni',
                'Görsel Hafıza',
                'Gece Mesaisi',
                'Samimiyet Bağı',
                'Sadakat Sarmalı',
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          alignment: WrapAlignment.center,
          children: dna.asMap().entries.map((entry) {
            int idx = entry.key;
            UserDNA userDna = entry.value;
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: colors[idx % colors.length].withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: colors[idx % colors.length].withOpacity(0.3),
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    decoration: BoxDecoration(
                      color: colors[idx % colors.length],
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: colors[idx % colors.length].withOpacity(0.5),
                          blurRadius: 4,
                          spreadRadius: 1,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${userDna.user}: ${userDna.vibe}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}

class RadarPainter extends CustomPainter {
  final List<UserDNA> dna;
  final List<Color> colors;
  final List<String> labels;

  RadarPainter({required this.dna, required this.colors, required this.labels});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = min(size.width, size.height) / 2 * 0.7;
    final angleStep = 2 * pi / labels.length;

    // Build Grid
    final gridPaint = Paint()
      ..color = Colors.white.withOpacity(0.1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;

    for (var i = 1; i <= 4; i++) {
      final r = radius * i / 4;
      final path = Path();
      for (var j = 0; j < labels.length; j++) {
        final angle = j * angleStep - pi / 2;
        final x = center.dx + r * cos(angle);
        final y = center.dy + r * sin(angle);
        if (j == 0)
          path.moveTo(x, y);
        else
          path.lineTo(x, y);
      }
      path.close();
      canvas.drawPath(path, gridPaint);
    }

    // Draw Axes
    for (var i = 0; i < labels.length; i++) {
      final angle = i * angleStep - pi / 2;
      canvas.drawLine(
        center,
        Offset(
          center.dx + radius * cos(angle),
          center.dy + radius * sin(angle),
        ),
        gridPaint,
      );

      // Labels
      final textPainter = TextPainter(
        text: TextSpan(
          text: labels[i],
          style: TextStyle(
            color: Colors.white.withOpacity(0.8),
            fontSize: 9,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();

      final labelRadius = radius + 20;
      final x = center.dx + labelRadius * cos(angle) - textPainter.width / 2;
      final y = center.dy + labelRadius * sin(angle) - textPainter.height / 2;
      textPainter.paint(canvas, Offset(x, y));
    }

    // Draw DNA Paths
    for (var i = 0; i < dna.length; i++) {
      final userDna = dna[i];
      final color = colors[i % colors.length];
      final path = Path();

      final values = [
        userDna.laughter,
        userDna.media,
        userDna.night,
        userDna.empathy,
        userDna.consistency,
      ];

      for (var j = 0; j < values.length; j++) {
        final angle = j * angleStep - pi / 2;
        final valRadius = radius * (values[j] / 100);
        final x = center.dx + valRadius * cos(angle);
        final y = center.dy + valRadius * sin(angle);
        if (j == 0)
          path.moveTo(x, y);
        else
          path.lineTo(x, y);
      }
      path.close();

      final fillPaint = Paint()
        ..color = color.withOpacity(0.3)
        ..style = PaintingStyle.fill;
      final strokePaint = Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;

      canvas.drawPath(path, fillPaint);
      canvas.drawPath(path, strokePaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
