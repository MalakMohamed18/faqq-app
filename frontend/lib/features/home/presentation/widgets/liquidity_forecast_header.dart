import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';

class LiquidityForecastHeader extends StatelessWidget {
  const LiquidityForecastHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          InkWell(
            customBorder: const CircleBorder(),
            onTap: () => Navigator.of(context).pop(),
            child: HugeIcon(
              icon: HugeIcons.strokeRoundedArrowRight01,
              size: 40,
            ),
          ),
          SizedBox(width: 16),
          Text(
            'توقع السيولة',
            style: TextStyle(
              color: Color(0xFF121A2D),
              fontFamily: "Zain",
              fontSize: 24,
              fontWeight: FontWeight.bold,
              height: 1,
            ),
          ),
          Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            decoration: BoxDecoration(
              color: const Color(0xFFF4F3FF),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              'Beta',
              textDirection: TextDirection.ltr,
              style: TextStyle(
                fontFamily: "Zain",
                color: Color(0xFF7B5FFF),
                fontSize: 12,
                fontWeight: FontWeight.w400,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
