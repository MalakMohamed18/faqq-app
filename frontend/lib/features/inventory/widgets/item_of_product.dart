import 'package:faqqa/features/inventory/widgets/product_image.dart';
import 'package:flutter/material.dart';
import 'package:faqqa/features/inventory/models/inventory_models.dart';

class ItemOfProduct extends StatelessWidget {
  final Product product;
  final VoidCallback? onTap;

  const ItemOfProduct({super.key, required this.product, this.onTap});

  @override
  Widget build(BuildContext context) {
    final status = product.stockStatus;

    final statusLabel = switch (status) {
      ProductStockStatus.available => 'متوفر',
      ProductStockStatus.lowStock => 'منخفض',
      ProductStockStatus.outOfStock => 'غير متوفر',
    };

    final statusColor = switch (status) {
      ProductStockStatus.available => const Color(0xFF027A48),
      ProductStockStatus.lowStock => const Color(0xFFD92D20),
      ProductStockStatus.outOfStock => const Color(0xFFD92D20),
    };

    final statusBackground = switch (status) {
      ProductStockStatus.available => const Color(0xFFECFDF3),
      ProductStockStatus.lowStock => const Color(0xFFFFF3F0),
      ProductStockStatus.outOfStock => const Color(0xFFFFF3F0),
    };

    final statusBorder = switch (status) {
      ProductStockStatus.available => const Color(0xFFB5EBD0),
      ProductStockStatus.lowStock => const Color(0xFFF9B9A9),
      ProductStockStatus.outOfStock => const Color(0xFFF9B9A9),
    };

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            width: double.infinity,
            height: 100,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF9FAFB),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFD0D5DD)),
            ),
            child: Row(
              children: [
                SizedBox(width: 90, child: ProductImage(product: product)),
                SizedBox(width: 6),

                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        product.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Color(0xFF151D32),
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          fontFamily: 'Zain',
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        product.id,
                        style: const TextStyle(
                          color: Color(0xFF667085),
                          fontSize: 14,
                          fontFamily: 'Zain',
                        ),
                      ),
                      SizedBox(height: 3),
                      Text(
                        'الكمية: ${product.quantity} ${product.unit}',
                        style: const TextStyle(
                          color: Color(0xFF667085),
                          fontSize: 14,
                          fontFamily: 'Zain',
                        ),
                      ),
                    ],
                  ),
                ),

                SizedBox(width: 12),

                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      ' الكمية: ${product.minimumQuantity}',
                      style: const TextStyle(
                        color: Color(0xFF667085),
                        fontSize: 13,
                        fontFamily: 'Zain',
                      ),
                    ),
                    SizedBox(height: 16),
                    Container(
                      width: 80,
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      decoration: BoxDecoration(
                        color: statusBackground,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: statusBorder, width: 1.2),
                      ),
                      child: Text(
                        statusLabel,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: statusColor,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Zain',
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
