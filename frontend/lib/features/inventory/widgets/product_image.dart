import 'dart:io';

import 'package:flutter/material.dart';
import 'package:faqqa/features/inventory/models/inventory_models.dart';

class ProductImage extends StatelessWidget {
  final Product product;
  final BoxFit fit;

  const ProductImage({
    super.key,
    required this.product,
    this.fit = BoxFit.contain,
  });

  @override
  Widget build(BuildContext context) {
    if (product.localImagePath != null) {
      return Image.file(
        File(product.localImagePath!),
        fit: fit,
        errorBuilder: (_, __, ___) => _assetImage(),
      );
    }

    return _assetImage();
  }

  Widget _assetImage() {
    return Image.asset(
      product.imagePath,
      fit: fit,
      errorBuilder: (_, __, ___) {
        return const Icon(
          Icons.inventory_2_outlined,
          color: Color(0xFF667085),
          size: 44,
        );
      },
    );
  }
}
