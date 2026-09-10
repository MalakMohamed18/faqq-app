import 'package:faqqa/app/theme/app_colors.dart';
import 'package:faqqa/features/inventory/models/inventory_models.dart';
import 'package:flutter/material.dart';

class SummaryGrid extends StatelessWidget {
  const SummaryGrid({super.key, required this.summary});

  final InventorySummary summary;

  @override
  Widget build(BuildContext context) {
    final cards = [
      _SummaryData(
        title: 'قيمة المخزون',
        value: '${summary.totalValue.toStringAsFixed(0)} ج.م',
        color: AppColors.textPrimary,
      ),
      _SummaryData(
        title: 'إجمالي المنتج',
        value: '${summary.totalProducts} منتج',
        color: AppColors.textPrimary,
      ),
      _SummaryData(
        title: 'منتجات نفذت',
        value: '${summary.outOfStockCount} منتجات',
        color: AppColors.textDanger,
      ),
      _SummaryData(
        title: 'مخزون منخفض',
        value: '${summary.lowStockCount} منتج',
        color: AppColors.textDanger,
      ),
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: cards.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 1.45,
      ),
      itemBuilder: (_, index) {
        final item = cards[index];

        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                item.title,
                style: TextStyle(
                  color: item.color,
                  fontSize: 14,
                  fontFamily: "Zain",
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                item.value,
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 16,
                  fontFamily: "Zain",
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _SummaryData {
  const _SummaryData({
    required this.title,
    required this.value,
    required this.color,
  });

  final String title;
  final String value;
  final Color color;
}
