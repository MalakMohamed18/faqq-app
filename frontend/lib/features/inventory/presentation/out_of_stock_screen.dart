import 'package:faqqa/features/inventory/widgets/bulid_header.dart';
import 'package:flutter/material.dart';
import 'package:faqqa/features/inventory/data/inventory_repository.dart';
import 'package:faqqa/features/inventory/models/inventory_models.dart';
import 'package:faqqa/features/inventory/widgets/low_stock_product_card.dart';

class OutOfStockScreen extends StatefulWidget {
  final InventoryRepository repository;

  const OutOfStockScreen({super.key, required this.repository});

  @override
  State<OutOfStockScreen> createState() => _OutOfStockScreenState();
}

class _OutOfStockScreenState extends State<OutOfStockScreen> {
  late Future<List<Product>> _productsFuture;

  @override
  void initState() {
    super.initState();
    _productsFuture = widget.repository.getProducts();
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: const Color(0xFFF8F9FB),
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                BulidHeader(text: "مخزون نفد"),

                const SizedBox(height: 28),

                Expanded(
                  child: FutureBuilder<List<Product>>(
                    future: _productsFuture,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState != ConnectionState.done) {
                        return const Center(child: CircularProgressIndicator());
                      }

                      if (snapshot.hasError) {
                        return const Center(
                          child: Text('حدث خطأ أثناء تحميل المخزون'),
                        );
                      }

                      final outOfStockProducts = (snapshot.data ?? [])
                          .where(
                            (product) =>
                                product.stockStatus ==
                                ProductStockStatus.outOfStock,
                          )
                          .toList();

                      if (outOfStockProducts.isEmpty) {
                        return const Center(
                          child: Text(
                            'لا توجد منتجات نفذت المخزون',
                            style: TextStyle(
                              color: Color(0xFF667085),
                              fontSize: 18,
                              fontFamily: 'Zain',
                            ),
                          ),
                        );
                      }

                      return ListView.separated(
                        padding: const EdgeInsets.only(bottom: 20),
                        itemCount: outOfStockProducts.length + 1,
                        separatorBuilder: (_, __) => const SizedBox(height: 18),
                        itemBuilder: (context, index) {
                          if (index == 0) {
                            return _OutOfStockWarning(
                              productCount: outOfStockProducts.length,
                            );
                          }

                          final product = outOfStockProducts[index - 1];

                          return LowStockProductCard(
                            product: product,
                            onCreatePurchaseOrder: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    'سيتم إنشاء طلب شراء لـ ${product.name}',
                                    style: const TextStyle(fontFamily: 'Zain'),
                                  ),
                                ),
                              );
                            },
                          );
                        },
                      );
                    },
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

class _OutOfStockWarning extends StatelessWidget {
  final int productCount;

  const _OutOfStockWarning({required this.productCount});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF3F2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE8B6B1)),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.warning_amber_rounded,
            color: Color(0xFFB42318),
            size: 34,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              "هذه المنتجات نفدت، قم بطلب منتجات جديدة الآن.",
              style: const TextStyle(
                color: Color(0xFF000000),
                fontSize: 18,
                fontWeight: FontWeight.w500,
                height: 1.4,
                fontFamily: 'Zain',
              ),
            ),
          ),
        ],
      ),
    );
  }
}
