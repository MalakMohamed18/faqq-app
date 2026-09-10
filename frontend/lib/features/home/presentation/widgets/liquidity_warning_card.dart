import 'package:faqqa/features/home/data/fake_liquidity_forecast_repository.dart';
import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';

class LiquidityWarningCard extends StatelessWidget {
  final LiquidityForecastData data;

  const LiquidityWarningCard({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFFF8E8), Color(0xFFFFFCF5)],
          begin: Alignment.topRight,
          end: Alignment.bottomLeft,
        ),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: const Color(0xFFF79009), width: 1.1),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          HugeIcon(
            icon: HugeIcons.strokeRoundedSecurityWarning,
            size: 24,
            color: Color(0xffB54708),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  data.warningTitle,
                  style: const TextStyle(
                    color: Color(0xFFB54708),
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    fontFamily: "Zain",
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  data.warningSubtitle,
                  style: const TextStyle(
                    color: Color(0xFF667085),
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    fontFamily: "Zain",
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
