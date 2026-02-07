import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // --- Elite Color Palette (Dark Mode First) ---
  static const Color background = Color(0xFF030712); // Deep Space Black
  static const Color surface = Color(0xFF111827); // Rich Navy Surface
  static const Color cardBg = Color(0xFF1F2937); // Elevated Card
  static const Color cardBorder = Color(0xFF374151); // Subtle Border

  static const Color primary = Color(0xFF10B981); // Emerald Green
  static const Color secondary = Color(0xFF3B82F6); // Cool Blue
  static const Color accent = Color(0xFFF59E0B); // Warm Amber
  static const Color error = Color(0xFFEF4444); // Rose Red
  static const Color success = Color(0xFF22C55E); // Vibrant Green

  static const Color textMain = Color(0xFFF9FAFB); // Pure White/Gray
  static const Color textMuted = Color(0xFF9CA3AF); // Soft Gray
  static const Color textDim = Color(0xFF6B7280); // Dim Gray/UI

  // --- Semantic Aliases ---
  static const Color cta = primary;

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: primary,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primary,
        brightness: Brightness.dark,
        surface: surface,
        onSurface: textMain,
        error: error,
      ),

      // Card Theme
      cardTheme: CardThemeData(
        color: cardBg,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: cardBorder, width: 1),
        ),
      ),

      // Text Theme
      textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme)
          .copyWith(
            displayLarge: GoogleFonts.outfit(
              fontSize: 48,
              fontWeight: FontWeight.w900,
              color: textMain,
              letterSpacing: -1.5,
              height: 1.1,
            ),
            displayMedium: GoogleFonts.outfit(
              fontSize: 32,
              fontWeight: FontWeight.w800,
              color: textMain,
              letterSpacing: -0.5,
            ),
            titleLarge: GoogleFonts.outfit(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: textMain,
            ),
            bodyLarge: GoogleFonts.outfit(
              fontSize: 16,
              color: textMuted,
              height: 1.5,
            ),
            bodyMedium: GoogleFonts.outfit(fontSize: 14, color: textMuted),
          ),

      // Button Theme
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 60),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          elevation: 0,
          textStyle: GoogleFonts.outfit(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}

class AppGradients {
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [AppTheme.primary, Color(0xFF34D399)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient surfaceGradient = LinearGradient(
    colors: [AppTheme.surface, AppTheme.cardBg],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static final BoxDecoration radialGlow = BoxDecoration(
    gradient: RadialGradient(
      colors: [AppTheme.primary.withOpacity(0.15), Colors.transparent],
      center: const Alignment(0.8, -0.6),
      radius: 1.2,
    ),
  );
}
