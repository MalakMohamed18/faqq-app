import 'package:flutter/material.dart';

class LiquiditySuggestedActions extends StatelessWidget {
  final String actionTitle;
  final VoidCallback? onActionTap;

  const LiquiditySuggestedActions({
    super.key,
    required this.actionTitle,
    this.onActionTap,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
          'إجراءات مقترحة',
          textAlign: TextAlign.right,
          style: TextStyle(
            color: Color(0xFF101828),
            fontSize: 16,
            fontWeight: FontWeight.bold,
            fontFamily: "Zain",
          ),
        ),
        SizedBox(height: 16),

        // InkWell(
        //   onTap: onActionTap,
        //   borderRadius: BorderRadius.circular(25),
        //   child: Container(
        //     height: 94,
        //     padding: const EdgeInsets.symmetric(horizontal: 28),
        //     decoration: BoxDecoration(
        //       borderRadius: BorderRadius.circular(16),
        //       border: Border.all(color: const Color(0xFFD0D5DD), width: 1.1),
        //     ),
        //     child: Stack(
        //       alignment: Alignment.center,
        //       children: [
        //         Text(
        //           actionTitle,
        //           textAlign: TextAlign.center,
        //           style: const TextStyle(
        //             color: Color(0xFF172033),
        //             fontSize: 25,
        //             fontWeight: FontWeight.w500,
        //           ),
        //         ),
        //         Align(
        //           alignment: Alignment.centerLeft,
        //           child: Icon(
        //             Icons.arrow_back_ios_new_rounded,
        //             size: 27,
        //             color: Color(0xFF050505),
        //           ),
        //         ),
        //       ],
        //     ),
        //   ),
        // ),
        ElevatedButton(
          onPressed: onActionTap ?? () {},
          style: ElevatedButton.styleFrom(
            fixedSize: Size(double.infinity, 50),
            backgroundColor: const Color(0xffFFFFFF),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: const BorderSide(color: Color(0xFFD0D5DD), width: 1.1),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                actionTitle,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Color(0xFF172033),
                  fontSize: 25,
                  fontWeight: FontWeight.w500,
                ),
              ),
              Spacer(),
              Icon(
                Icons.arrow_back_ios_new_rounded,
                size: 20,
                color: Color(0xFF050505),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
