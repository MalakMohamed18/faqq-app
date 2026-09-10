import 'package:faqqa/app/theme/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';

class SuggestionCard extends StatelessWidget {
  const SuggestionCard({
    super.key,
    required this.lowStockCount,
    required this.onShowProducts,
  });

  final int lowStockCount;
  final VoidCallback onShowProducts;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        HugeIcon(
                          color: AppColors.primary,
                          size: 24,
                          icon: HugeIcons.strokeRoundedLamp01,
                        ),
                        Text(
                          'اقتراح من فكّة',
                          style: TextStyle(
                            color: AppColors.textPrimary,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            fontFamily: "Zain",
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'عندك $lowStockCount منتج بمخزون منخفض، ننصحك تراجعهم وتعمل طلب شراء.',
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                        height: 1.3,
                        fontFamily: "Zain",
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: Image.asset(
                  alignment: Alignment.centerLeft,
                  'assets/images/suggestion.png',
                  width: 60,
                  height: 100,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 44,
            child: ElevatedButton(
              onPressed: onShowProducts,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text(
                'عرض المنتجات',
                style: TextStyle(fontFamily: "Zain"),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
