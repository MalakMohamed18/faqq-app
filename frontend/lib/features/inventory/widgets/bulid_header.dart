import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';

class BulidHeader extends StatelessWidget {
  final String text;

  const BulidHeader({super.key, required this.text});
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        InkWell(
          customBorder: const CircleBorder(),
          onTap: () => Navigator.of(context).pop(),
          child: const SizedBox(
            width: 40,
            height: 40,
            child: HugeIcon(
              icon: HugeIcons.strokeRoundedArrowRight01,
              size: 22,
            ),
          ),
        ),
        SizedBox(width: 60),
        Text(
          textAlign: TextAlign.center,
          text,
          style: TextStyle(
            color: Color(0xFF151D32),
            fontSize: 24,
            fontWeight: FontWeight.w700,
            fontFamily: 'Zain',
          ),
        ),
      ],
    );
  }
}
