import 'package:faqqa/features/home/data/fake_cash_flow_repository.dart';
import 'package:faqqa/features/home/models/cash_flow_data.dart';
import 'package:faqqa/features/home/presentation/pages/liquidity_forecast_screen.dart';
import 'package:faqqa/features/home/presentation/widgets/CashFlowDetailsCard.dart';
import 'package:faqqa/features/home/presentation/widgets/cashF_fow_summary_card.dart';
import 'package:faqqa/features/home/presentation/widgets/cash_flow_trend_chart.dart';

import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';

class CashFlowScreen extends StatefulWidget {
  const CashFlowScreen({super.key});

  @override
  State<CashFlowScreen> createState() => _CashFlowScreenState();
}

class _CashFlowScreenState extends State<CashFlowScreen> {
  CashFlowPeriod selectedPeriod = CashFlowPeriod.day;
  late CashFlowData cashFlowData;

  @override
  void initState() {
    super.initState();
    cashFlowData = FakeCashFlowRepository.getData(selectedPeriod);
  }

  void changePeriod(CashFlowPeriod period) {
    setState(() {
      selectedPeriod = period;
      cashFlowData = FakeCashFlowRepository.getData(period);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FB),
      body: SafeArea(
        child: Directionality(
          textDirection: TextDirection.rtl,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    HugeIcon(
                      icon: HugeIcons.strokeRoundedArrowRight01,
                      size: 40,
                    ),
                    SizedBox(width: 16),
                    Text(
                      'الحركة النقدية',
                      textAlign: TextAlign.right,
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF101828),
                        fontFamily: "Zain",
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                CashFlowSummaryCard(
                  selectedPeriod: selectedPeriod,
                  cashFlowData: cashFlowData,
                  onPeriodChanged: changePeriod,
                ),
                SizedBox(height: 10),
                CashFlowDetailsCard(data: cashFlowData),
                SizedBox(height: 24),
                CashFlowTrendChart(
                  points: cashFlowData.chartPoints,
                  title: cashFlowData.chartTitle,
                  dateRange: cashFlowData.dateRange,
                ),
                SizedBox(height: 20),

                InkWell(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => LiquidityForecastScreen(
                          selectedPeriod: selectedPeriod,
                        ),
                      ),
                    );
                  },
                  borderRadius: BorderRadius.circular(24),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      vertical: 22,
                      horizontal: 16,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF7F5FF),
                      border: Border.all(
                        color: const Color(0xFF7F56D9),
                        width: 2,
                      ),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.arrow_back_ios_new_rounded,
                          color: Color(0xFF7F56D9),
                          size: 25,
                        ),
                        Spacer(),
                        Text(
                          'توقع السيولة القادمة (Beta)',
                          style: TextStyle(
                            color: Color(0xFF101828),
                            fontFamily: "Zain",
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 5,
                            vertical: 5,
                          ),
                          decoration: BoxDecoration(
                            color: Color(0xFF7F56D9),
                            borderRadius: BorderRadius.circular(10),
                          ),

                          child: const Text(
                            'AI',
                            textDirection: TextDirection.ltr,
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        Spacer(),
                      ],
                    ),
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
