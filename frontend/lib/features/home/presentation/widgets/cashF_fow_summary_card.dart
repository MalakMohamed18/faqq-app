import 'package:faqqa/features/home/models/cash_flow_data.dart';
import 'package:faqqa/features/home/presentation/widgets/time.dart';
import 'package:flutter/material.dart';

class CashFlowSummaryCard extends StatelessWidget {
  final CashFlowPeriod selectedPeriod;
  final CashFlowData cashFlowData;
  final ValueChanged<CashFlowPeriod> onPeriodChanged;

  const CashFlowSummaryCard({
    super.key,
    required this.selectedPeriod,
    required this.cashFlowData,
    required this.onPeriodChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: const Color(0xFFD0D5DD)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Time(selectedPeriod: selectedPeriod, onChanged: onPeriodChanged),
          SizedBox(height: 24),
          Text(
            textAlign: TextAlign.end,
            cashFlowData.total,
            style: const TextStyle(
              fontSize: 30,
              fontWeight: FontWeight.bold,
              color: Color(0xFF101828),
              fontFamily: "Zain",
            ),
          ),
          SizedBox(height: 8),
          Wrap(
            alignment: WrapAlignment.center,
            spacing: 8,
            children: [
              Text(
                cashFlowData.changeText,
                style: TextStyle(
                  color: cashFlowData.isDecrease
                      ? const Color(0xFFF04438)
                      : const Color(0xFF12B76A),
                  fontSize: 14,
                  fontFamily: "Zain",
                  fontWeight: FontWeight(400),
                ),
              ),
              Text(
                'صافي الحركة النقدية ${selectedPeriod.label}',
                style: const TextStyle(
                  color: Color(0xFF667085),
                  fontSize: 16,
                  fontFamily: "Zain",
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
