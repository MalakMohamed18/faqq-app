import '../models/inventory_models.dart';

abstract class InventoryRepository {
  Future<InventoryDashboardData> getDashboardData();

  Future<List<Product>> getProducts();

  Future<Product> addProduct(Product product);

  Future<Product> updateProduct(Product product);
}
