import 'package:faqqa/app/theme/app_colors.dart';
import 'package:faqqa/features/inventory/models/inventory_models.dart';
import 'package:faqqa/features/inventory/widgets/product_image.dart';
import 'package:flutter/material.dart';

class ActiveProductCard extends StatelessWidget {
  const ActiveProductCard({super.key, required this.product});

  final Product product;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 127,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Expanded(child: ProductImage(product: product)),
          const SizedBox(height: 6),
          Text(
            product.name,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 13,
              fontWeight: FontWeight.w700,
              fontFamily: "Zain",
            ),
          ),
          const SizedBox(height: 3),
          Text(
            '${product.quantity} ${product.unit}',
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: AppColors.textSecondary,
              fontSize: 11,
              fontWeight: FontWeight.w500,
              fontFamily: "Zain",
            ),
          ),
        ],
      ),
    );
  }
}
