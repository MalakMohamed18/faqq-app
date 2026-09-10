import 'package:faqqa/features/home/models/cash_flow_data.dart';
import 'package:flutter/material.dart';

class CashFlowDetailsCard extends StatelessWidget {
  final CashFlowData data;

  const CashFlowDetailsCard({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: const Color(0xFFD0D5DD)),
        borderRadius: BorderRadius.circular(28),
      ),
      child: Column(
        children: [
          _CashRow(
            title: 'الكاش الداخل (مبيعات نقدية)',
            amount: data.incoming,
            amountColor: const Color(0xFF12B76A),
          ),
          const Divider(height: 34, color: Color(0xFFD0D5DD)),
          _CashRow(
            title: 'الكاش الخارج (مصروفات ومشتريات)',
            amount: data.outgoing,
            amountColor: const Color(0xFF69758D),
          ),
          const Divider(height: 34, color: Color(0xFFD0D5DD)),
          _CashRow(
            title: 'الصافي',
            amount: data.net,
            amountColor: const Color(0xFF151D32),
            isBold: true,
          ),
        ],
      ),
    );
  }
}

class _CashRow extends StatelessWidget {
  final String title;
  final String amount;
  final Color amountColor;
  final bool isBold;

  const _CashRow({
    required this.title,
    required this.amount,
    required this.amountColor,
    this.isBold = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(
            title,
            textAlign: TextAlign.right,
            style: TextStyle(
              color: Color(0xFF667085),
              fontSize: 14,
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
              fontFamily: "Zain",
            ),
          ),
        ),
        SizedBox(width: 16),
        Text(
          amount,
          textDirection: TextDirection.rtl,
          style: TextStyle(
            color: amountColor,
            fontSize: 16,
            fontWeight: FontWeight.bold,
            fontFamily: "Zain",
          ),
        ),
      ],
    );
  }
}
