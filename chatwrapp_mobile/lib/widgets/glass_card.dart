import 'package:flutter/material.dart';
import 'dart:ui';

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double? width;
  final double? height;
  final Color? color;
  final BorderRadius? borderRadius;
  final bool useBlur; // Performance switch

  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.width,
    this.height,
    this.color,
    this.borderRadius,
    this.useBlur = false, // Default to false for better performance
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      margin: margin,
      decoration: BoxDecoration(
        color: (color ?? Colors.white).withOpacity(0.04),
        borderRadius: borderRadius ?? BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: ClipRRect(
        borderRadius: borderRadius ?? BorderRadius.circular(24),
        child: useBlur
            ? BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
                child: Padding(
                  padding: padding ?? const EdgeInsets.all(20),
                  child: child,
                ),
              )
            : Padding(
                padding: padding ?? const EdgeInsets.all(20),
                child: child,
              ),
      ),
    );
  }
}
