import 'package:flutter/material.dart';

class LiquidityReasonsCard extends StatelessWidget {
  final List<String> reasons;

  const LiquidityReasonsCard({super.key, required this.reasons});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: const Color(0xFFD0D5DD), width: 1.1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,

        children: [
          Text(
            'الأسباب الرئيسية',
            textAlign: TextAlign.right,
            style: TextStyle(
              color: Color(0xFF101828),
              fontSize: 15,
              fontWeight: FontWeight.bold,
              fontFamily: "Zain",
            ),
          ),
          const SizedBox(height: 18),

          ...List.generate(reasons.length, (index) {
            final isLastItem = index == reasons.length - 1;

            return Column(
              children: [
                Text(
                  reasons[index],
                  textAlign: TextAlign.right,
                  style: const TextStyle(
                    fontFamily: "Zain",
                    color: Color(0xFF101828),
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    height: 1,
                  ),
                ),
                if (!isLastItem)
                  Container(
                    margin: const EdgeInsets.symmetric(vertical: 18),
                    height: 1,
                    color: const Color(0xFFF0F2F5),
                  ),
              ],
            );
          }),
        ],
      ),
    );
  }
}
