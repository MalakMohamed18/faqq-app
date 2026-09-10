import 'package:faqqa/features/inventory/data/inventory_repository.dart';
import 'package:faqqa/features/inventory/presentation/product_form_screen.dart';
import 'package:faqqa/features/inventory/widgets/bulid_header.dart';
import 'package:faqqa/features/inventory/widgets/product_image.dart';
import 'package:flutter/material.dart';
import 'package:faqqa/features/inventory/models/inventory_models.dart';

class ProductDetailsScreen extends StatelessWidget {
  final Product product;
  final InventoryRepository repository;

  const ProductDetailsScreen({
    super.key,
    required this.product,
    required this.repository,
  });

  String get _statusLabel {
    return switch (product.stockStatus) {
      ProductStockStatus.available => 'متوفر',
      ProductStockStatus.lowStock => 'مخزون منخفض',
      ProductStockStatus.outOfStock => 'نفد',
    };
  }

  Color get _statusColor {
    return switch (product.stockStatus) {
      ProductStockStatus.available => const Color(0xFF027A48),
      ProductStockStatus.lowStock => const Color(0xFFC43226),
      ProductStockStatus.outOfStock => const Color(0xFFC43226),
    };
  }

  String get _expiryDate {
    final date = product.expiryDate;

    if (date == null) {
      return 'غير محدد';
    }

    return '${date.day}-${date.month}-${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: const Color(0xFFF8F9FB),
        bottomNavigationBar: SafeArea(
          minimum: const EdgeInsets.fromLTRB(16, 10, 16, 16),
          child: SizedBox(
            height: 56,
            child: ElevatedButton(
              onPressed: () async {
                final updatedProduct = await Navigator.of(context)
                    .push<Product>(
                      MaterialPageRoute(
                        builder: (_) => ProductFormScreen(
                          product: product,
                          repository: repository,
                        ),
                      ),
                    );

                if (updatedProduct != null && context.mounted) {
                  Navigator.of(context).pop(updatedProduct);
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2E90FA),
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: const Text(
                'تعديل المنتج',
                style: TextStyle(
                  fontFamily: 'Zain',
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ),
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 18, 16, 24),
            child: Column(
              children: [
                BulidHeader(text: "تفاصيل المنتج"),
                SizedBox(height: 20),

                Container(
                  width: 171,
                  height: 171,
                  padding: EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: ProductImage(product: product, fit: BoxFit.fill),
                ),
                SizedBox(height: 12),

                Text(
                  product.name,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: Color(0xFF151D32),
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'Zain',
                  ),
                ),
                SizedBox(height: 12),

                Container(
                  padding: EdgeInsets.symmetric(horizontal: 14, vertical: 3),
                  decoration: BoxDecoration(
                    color: _statusColor.withOpacity(0.10),
                    borderRadius: BorderRadius.circular(40265300),
                    border: Border.all(color: _statusColor.withOpacity(0.28)),
                  ),
                  child: Text(
                    _statusLabel,
                    style: TextStyle(
                      color: _statusColor,
                      fontFamily: 'Zain',
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                SizedBox(height: 16),

                Row(
                  children: [
                    Expanded(
                      child: _DetailInfoCard(
                        title: 'الصنف',
                        value: product.category,
                      ),
                    ),
                    const SizedBox(width: 17),
                    Expanded(
                      child: _DetailInfoCard(title: 'الكود', value: product.id),
                    ),
                  ],
                ),
                SizedBox(height: 12),

                Row(
                  children: [
                    Expanded(
                      child: _DetailInfoCard(
                        title: 'الحد الأدنى',
                        value: '${product.minimumQuantity}',
                      ),
                    ),
                    SizedBox(width: 17),
                    Expanded(
                      child: _DetailInfoCard(
                        title: 'الكمية الحالية',
                        value: '${product.quantity}',
                        valueColor: const Color(0xFF2E90FA),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                Row(
                  children: [
                    Expanded(
                      child: _DetailInfoCard(
                        title: 'سعر الشراء',
                        value: '${product.purchasePrice} ج.م',
                      ),
                    ),
                    const SizedBox(width: 17),
                    Expanded(
                      child: _DetailInfoCard(
                        title: 'سعر البيع',
                        value: '${product.sellingPrice} ج.م',
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16),

                Align(
                  alignment: Alignment.centerRight,
                  child: Text(
                    'حركة المخزون',
                    style: TextStyle(
                      color: Color(0xFF151D32),
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      fontFamily: 'Zain',
                    ),
                  ),
                ),
                SizedBox(height: 10),

                const _MovementItem(
                  icon: Icons.receipt_long_outlined,
                  title: 'بيع',
                  quantity: '-5',
                  quantityColor: Color(0xFFD92D20),
                  balance: '150',
                  data: '20-05-2025',
                ),
                const SizedBox(height: 12),
                const _MovementItem(
                  icon: Icons.shopping_basket_outlined,
                  title: 'شراء',
                  quantity: '+10',
                  quantityColor: Color(0xFF027A48),
                  balance: '155',
                  data: '20-05-2025',
                ),
                const SizedBox(height: 12),
                const _MovementItem(
                  icon: Icons.reply_rounded,
                  title: 'مرتجع',
                  quantity: '-2',
                  quantityColor: Color(0xFFD92D20),
                  balance: '55',
                  data: '20-05-2025',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _DetailInfoCard extends StatelessWidget {
  final String title;
  final String value;
  final Color valueColor;

  const _DetailInfoCard({
    required this.title,
    required this.value,
    this.valueColor = const Color(0xFF151D32),
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 78,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFDDE3EC)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: Color(0xFF2E90FA),
              fontSize: 14,
              fontFamily: 'Zain',
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: valueColor,
              fontSize: 16,
              fontWeight: FontWeight.bold,
              fontFamily: 'Zain',
            ),
          ),
        ],
      ),
    );
  }
}

class _MovementItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String quantity;
  final Color quantityColor;
  final String balance;
  final String data;

  const _MovementItem({
    required this.icon,
    required this.title,
    required this.quantity,
    required this.quantityColor,
    required this.balance,
    required this.data,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFDDE3EC)),
      ),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF2E90FA)),
          Spacer(),
          Column(
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: Color(0xFF151D32),
                  fontFamily: 'Zain',
                  fontWeight: FontWeight.w600,
                  fontSize: 16,
                ),
              ),
              SizedBox(height: 4),
              Text(
                data,
                style: const TextStyle(
                  color: Color(0xFF667085),
                  fontFamily: 'Zain',
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                ),
              ),
            ],
          ),
          Spacer(),
          Column(
            children: [
              Text(
                'الكمية',
                style: const TextStyle(
                  color: Color(0xFF151D32),
                  fontFamily: 'Zain',
                  fontWeight: FontWeight.w600,
                  fontSize: 16,
                ),
              ),
              SizedBox(height: 4),
              Text(
                quantity,
                style: TextStyle(
                  color: quantityColor,
                  fontFamily: 'Zain',
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                ),
              ),
            ],
          ),
          Spacer(),
          Column(
            children: [
              Text(
                'الرصيد',
                style: const TextStyle(
                  color: Color(0xFF151D32),
                  fontFamily: 'Zain',
                  fontWeight: FontWeight.w600,
                  fontSize: 16,
                ),
              ),
              SizedBox(height: 4),
              Text(
                balance,
                style: TextStyle(
                  color: Color(0xFF667085),
                  fontFamily: 'Zain',
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ],
      ),
      // child: Row(
      //   children: [
      //     Icon(icon, color: const Color(0xFF2E90FA)),
      //     const SizedBox(width: 10),
      //     Text(
      //       title,
      //       style: const TextStyle(
      //         color: Color(0xFF151D32),
      //         fontFamily: 'Zain',
      //         fontWeight: FontWeight.w600,
      //       ),
      //     ),
      //     const Spacer(),
      //     Text(
      //       'الكمية $quantity',
      //       style: TextStyle(
      //         color: quantityColor,
      //         fontFamily: 'Zain',
      //         fontWeight: FontWeight.w600,
      //       ),
      //     ),
      //     const SizedBox(width: 12),
      //     Text(
      //       'الرصيد $balance',
      //       style: const TextStyle(
      //         color: Color(0xFF667085),
      //         fontFamily: 'Zain',
      //       ),
      //     ),
      //   ],
      // ),
    );
  }
}
