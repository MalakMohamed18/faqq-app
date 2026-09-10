import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';

class VerificationSuccessDialog extends StatelessWidget {
  const VerificationSuccessDialog({super.key, required this.onContinue});

  final VoidCallback onContinue;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: onContinue,

      child: Dialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(28, 48, 28, 30),
          child: Directionality(
            textDirection: TextDirection.rtl,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 128,
                  height: 128,
                  decoration: const BoxDecoration(
                    color: Color(0xFFDCFCE7),
                    shape: BoxShape.circle,
                  ),
                  child: HugeIcon(
                    color: const Color(0xFF22C55E),
                    size: 24,
                    icon: HugeIcons.strokeRoundedCheckmarkCircle03,
                  ),
                ),
                const SizedBox(height: 36),
                Text(
                  'تم التحقق من الحساب!',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontFamily: "Zain",
                    color: Color(0xFF101828),
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 18),
                const Text(
                  'تم التحقق من حسابك بنجاح، يمكنك الآن الوصول إلى جميع الميزات.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontFamily: "Zain",
                    color: Color(0xFF52525B),
                    fontSize: 24,
                    height: 1,
                    fontWeight: FontWeight.w500,
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
