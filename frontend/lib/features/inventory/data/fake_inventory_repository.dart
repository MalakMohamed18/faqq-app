import '../models/inventory_models.dart';
import 'inventory_repository.dart';

class FakeInventoryRepository implements InventoryRepository {
  static final List<Product> _products = [
    const Product(
      id: 'SKU-1001',
      name: 'سكر أبيض ناعم',
      imagePath: 'assets/images/sugar.png',
      quantity: 150,
      unit: 'عبوة',
      minimumQuantity: 20,
      purchasePrice: 30,
      sellingPrice: 35,
      category: 'مواد غذائية',
    ),
    Product(
      id: 'SKU-1002',
      name: 'حليب المراعي 1 لتر',
      imagePath: 'assets/images/milk.png',
      quantity: 15,
      unit: 'عبوة',
      minimumQuantity: 20,
      purchasePrice: 30,
      sellingPrice: 35,
      category: 'ألبان',
      productType: 'منتجات ألبان',
      expiryDate: DateTime(2029, 8, 4),
    ),
    const Product(
      id: 'SKU-1003',
      name: 'أرز فاخر 1 كجم',
      imagePath: 'assets/images/rice.png',
      quantity: 0,
      unit: 'عبوة',
      minimumQuantity: 10,
      purchasePrice: 40,
      sellingPrice: 48,
      category: 'مواد غذائية',
    ),
    const Product(
      id: 'SKU-1005',
      name: 'مكرونة 400 جم',
      imagePath: 'assets/images/macarona.png',
      quantity: 200,
      unit: 'عبوة',
      minimumQuantity: 20,
      purchasePrice: 15,
      sellingPrice: 20,
      category: 'مواد غذائية',
    ),
    const Product(
      id: 'SKU-1006',
      name: 'زيت عباد 1 لتر',
      imagePath: 'assets/images/sugar.png',
      quantity: 0,
      unit: 'عبوة',
      minimumQuantity: 8,
      purchasePrice: 50,
      sellingPrice: 60,
      category: 'مواد غذائية',
    ),
  ];

  @override
  Future<List<Product>> getProducts() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return List.unmodifiable(_products);
  }

  @override
  Future<Product> addProduct(Product product) async {
    await Future.delayed(const Duration(milliseconds: 400));
    _products.add(product);
    return product;
  }

  @override
  Future<Product> updateProduct(Product product) async {
    await Future.delayed(const Duration(milliseconds: 400));

    final index = _products.indexWhere((item) => item.id == product.id);

    if (index == -1) {
      throw StateError('المنتج غير موجود');
    }

    _products[index] = product;
    return product;
  }

  @override
  Future<InventoryDashboardData> getDashboardData() async {
    await Future.delayed(const Duration(milliseconds: 300));

    return InventoryDashboardData(
      summary: InventorySummary(
        totalProducts: _products.length,
        totalValue: _products.fold(
          0,
          (total, product) => total + (product.sellingPrice * product.quantity),
        ),
        lowStockCount: _products.where((product) => product.isLowStock).length,
        outOfStockCount: _products
            .where((product) => product.isOutOfStock)
            .length,
      ),
      mostActiveProducts: _products.take(5).toList(),
    );
  }
}
