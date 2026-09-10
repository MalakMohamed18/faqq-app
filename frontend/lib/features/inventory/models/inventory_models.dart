class Product {
  const Product({
    required this.id,
    required this.name,
    required this.imagePath,
    required this.quantity,
    required this.unit,
    required this.minimumQuantity,
    this.purchasePrice = 0,
    this.sellingPrice = 0,
    this.category = 'مواد غذائية',
    this.productType = '',
    this.expiryDate,
    this.localImagePath,
  });

  final String id;
  final String name;
  final String imagePath;
  final int quantity;
  final String unit;
  final int minimumQuantity;

  final double purchasePrice;
  final double sellingPrice;
  final String category;
  final String productType;
  final DateTime? expiryDate;

  final String? localImagePath;

  bool get isLowStock {
    return quantity > 0 && quantity <= minimumQuantity;
  }

  bool get isOutOfStock {
    return quantity == 0;
  }

  Product copyWith({
    String? id,
    String? name,
    String? imagePath,
    int? quantity,
    String? unit,
    int? minimumQuantity,
    double? purchasePrice,
    double? sellingPrice,
    String? category,
    String? productType,
    DateTime? expiryDate,
    String? localImagePath,
  }) {
    return Product(
      localImagePath: localImagePath ?? this.localImagePath,
      id: id ?? this.id,
      name: name ?? this.name,
      imagePath: imagePath ?? this.imagePath,
      quantity: quantity ?? this.quantity,
      unit: unit ?? this.unit,
      minimumQuantity: minimumQuantity ?? this.minimumQuantity,
      purchasePrice: purchasePrice ?? this.purchasePrice,
      sellingPrice: sellingPrice ?? this.sellingPrice,
      category: category ?? this.category,
      productType: productType ?? this.productType,
      expiryDate: expiryDate ?? this.expiryDate,
    );
  }
}

class InventorySummary {
  const InventorySummary({
    required this.totalProducts,
    required this.totalValue,
    required this.lowStockCount,
    required this.outOfStockCount,
  });

  final int totalProducts;
  final double totalValue;
  final int lowStockCount;
  final int outOfStockCount;
}

class InventoryDashboardData {
  const InventoryDashboardData({
    required this.summary,
    required this.mostActiveProducts,
  });

  final InventorySummary summary;
  final List<Product> mostActiveProducts;
}

enum ProductStockStatus { available, lowStock, outOfStock }

extension ProductStockStatusX on Product {
  ProductStockStatus get stockStatus {
    if (quantity == 0) {
      return ProductStockStatus.outOfStock;
    }

    if (quantity <= minimumQuantity) {
      return ProductStockStatus.lowStock;
    }

    return ProductStockStatus.available;
  }
}
