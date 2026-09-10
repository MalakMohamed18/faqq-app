import 'package:faqqa/features/home/data/fake_cash_flow_repository.dart';
import 'package:faqqa/features/home/data/fake_liquidity_forecast_repository.dart';
import 'package:faqqa/features/home/models/cash_flow_data.dart';
import 'package:faqqa/features/home/presentation/widgets/cash_flow_trend_chart.dart';
import 'package:faqqa/features/home/presentation/widgets/liquidity_reasons_card.dart';
import 'package:faqqa/features/home/presentation/widgets/liquidity_suggested_actions.dart';
import 'package:faqqa/features/home/presentation/widgets/liquidity_warning_card.dart';
import 'package:flutter/material.dart';
import '../widgets/liquidity_forecast_header.dart';

class LiquidityForecastScreen extends StatelessWidget {
  final CashFlowPeriod selectedPeriod;
  LiquidityForecastScreen({super.key, required this.selectedPeriod});
  final cashFlowData = FakeCashFlowRepository.getData(CashFlowPeriod.day);
  @override
  Widget build(BuildContext context) {
    final forecastData = FakeLiquidityForecastRepository.getData(
      selectedPeriod,
    );
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: const Color(0xFFF8F9FB),
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                const LiquidityForecastHeader(),

                const SizedBox(height: 24),
                LiquidityWarningCard(data: forecastData),
                const SizedBox(height: 24),

                CashFlowTrendChart(
                  points: forecastData.chartPoints,
                  title: forecastData.chartTitle,
                  dateRange: forecastData.dateRange,
                ),
                SizedBox(height: 24),

                LiquidityReasonsCard(reasons: forecastData.reasons),
                SizedBox(height: 24),

                LiquiditySuggestedActions(
                  actionTitle: forecastData.suggestedAction,
                  onActionTap: () {
                    // لاحقًا: نفتح شاشة تحصيل مستحقات العملاء.
                  },
                ),
                SizedBox(height: 14),
                Text(
                  'هذه توصية وليست استشارة مالية ملزمة',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Color(0xFF68758B),
                    fontSize: 12,
                    fontWeight: FontWeight.w400,
                    fontFamily: "Zain",
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
