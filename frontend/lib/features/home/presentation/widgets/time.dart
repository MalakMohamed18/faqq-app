import 'package:faqqa/features/home/models/cash_flow_data.dart';
import 'package:flutter/material.dart';

class Time extends StatelessWidget {
  final CashFlowPeriod selectedPeriod;
  final ValueChanged<CashFlowPeriod> onChanged;

  const Time({
    super.key,
    required this.selectedPeriod,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 60,
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: const Color(0xFFF2F4F7),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: CashFlowPeriod.values.map((period) {
          final isSelected = selectedPeriod == period;

          return Expanded(
            child: GestureDetector(
              onTap: () => onChanged(period),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(vertical: 4),
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: isSelected
                      ? const Color(0xFF2E90FA)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Text(
                  period.label,
                  style: TextStyle(
                    fontSize: 14,
                    fontFamily: "Zain",
                    fontWeight: FontWeight.w600,
                    color: isSelected ? Colors.white : const Color(0xFF667085),
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
