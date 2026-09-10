import 'package:flutter/material.dart';

class ProductSavedDialog extends StatelessWidget {
  final bool isEditing;
  final VoidCallback onBackToList;

  const ProductSavedDialog({
    super.key,
    required this.isEditing,
    required this.onBackToList,
  });

  @override
  Widget build(BuildContext context) {
    final title = isEditing
        ? 'تم حفظ التعديلات بنجاح'
        : 'تم حفظ بيانات المنتج بنجاح';

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Dialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 30, 24, 26),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 94,
                height: 94,
                decoration: const BoxDecoration(
                  color: Color(0xFFD1FADF),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check_rounded,
                  size: 55,
                  color: Color(0xFF12B76A),
                ),
              ),
              const SizedBox(height: 22),
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Color(0xFF151D32),
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  fontFamily: 'Zain',
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'ننصحك بتفعيل إشعارات المورد للتنبيهات',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Color(0xFF667085),
                  fontSize: 15,
                  fontFamily: 'Zain',
                ),
              ),
              const SizedBox(height: 20),
              TextButton(
                onPressed: onBackToList,
                child: const Text(
                  'الرجوع للقائمة الرئيسية',
                  style: TextStyle(
                    color: Color(0xFF2E90FA),
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    fontFamily: 'Zain',
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
