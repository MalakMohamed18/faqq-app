import 'package:faqqa/features/inventory/widgets/product_image.dart';
import 'package:flutter/material.dart';
import 'package:faqqa/features/inventory/models/inventory_models.dart';
import 'package:hugeicons/hugeicons.dart';

class LowStockProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback? onCreatePurchaseOrder;

  const LowStockProductCard({
    super.key,
    required this.product,
    this.onCreatePurchaseOrder,
  });

  @override
  Widget build(BuildContext context) {
    final isOutOfStock = product.stockStatus == ProductStockStatus.outOfStock;

    final statusText = isOutOfStock ? 'نفد' : 'مخزون منخفض';
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFD0D5DD)),
        ),
        child: Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(width: 14),
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
                          fontSize: 21,
                          fontWeight: FontWeight.w700,
                          fontFamily: 'Zain',
                        ),
                      ),
                      const SizedBox(height: 5),
                      Text(
                        product.id,
                        style: const TextStyle(
                          color: Color(0xFF667085),
                          fontSize: 15,
                          fontFamily: 'Zain',
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFFD0D5DD)),
                  ),
                  child: ProductImage(product: product),
                ),
              ],
            ),
            const SizedBox(height: 16),

            Row(
              children: [
                Expanded(
                  child: _InfoBox(
                    title: 'المتاح',
                    value: '${product.quantity}',
                    valueColor: const Color(0xFF027A48),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  flex: 2,
                  child: _InfoBox(
                    title: 'الحد الأدنى',
                    value: '${product.minimumQuantity}',
                    valueColor: const Color(0xFFC44B08),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  flex: 3,
                  child: _InfoBox(
                    title: 'الحالة',
                    value: statusText,
                    valueColor: const Color(0xFFD92D20),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            Row(
              children: [
                const HugeIcon(
                  icon: HugeIcons.strokeRoundedPin,
                  size: 24,
                  color: Color(0xff2E90FA),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'اقتراح: إعادة طلب ${product.name}',
                    style: const TextStyle(
                      color: Color(0xFF667085),
                      fontSize: 16,
                      fontFamily: 'Zain',
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 14),

            SizedBox(
              width: double.infinity,
              height: 58,
              child: ElevatedButton(
                onPressed: onCreatePurchaseOrder,
                style: ElevatedButton.styleFrom(
                  elevation: 0,
                  backgroundColor: const Color(0xFF2E90FA),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: const Text(
                  'إنشاء طلب شراء',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    fontFamily: 'Zain',
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoBox extends StatelessWidget {
  final String title;
  final String value;
  final Color valueColor;

  const _InfoBox({
    required this.title,
    required this.value,
    required this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      // height: 76,
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFEFF8FF),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFD1E9FF)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: Color(0xFF151D32),
              fontSize: 14,
              fontFamily: 'Zain',
            ),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: valueColor,
              fontSize: 16,
              fontWeight: FontWeight.w700,
              fontFamily: 'Zain',
            ),
          ),
        ],
      ),
    );
  }
}
