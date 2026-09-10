import 'package:faqqa/features/inventory/presentation/product_details_screen.dart';
import 'package:faqqa/features/inventory/widgets/bulid_header.dart';
import 'package:flutter/material.dart';
import 'package:faqqa/features/inventory/data/inventory_repository.dart';
import 'package:faqqa/features/inventory/models/inventory_models.dart';
import 'package:faqqa/features/inventory/widgets/item_of_product.dart';

class ProductsListScreen extends StatefulWidget {
  final InventoryRepository repository;

  const ProductsListScreen({super.key, required this.repository});

  @override
  State<ProductsListScreen> createState() => _ProductsListScreenState();
}

class _ProductsListScreenState extends State<ProductsListScreen> {
  final TextEditingController _searchController = TextEditingController();

  late Future<List<Product>> _productsFuture;
  ProductStockStatus? _selectedStatus;
  String _searchText = '';

  @override
  void initState() {
    super.initState();
    _productsFuture = widget.repository.getProducts();

    _searchController.addListener(() {
      setState(() {
        _searchText = _searchController.text.trim().toLowerCase();
      });
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<Product> _filterProducts(List<Product> products) {
    return products.where((product) {
      final matchesStatus =
          _selectedStatus == null || product.stockStatus == _selectedStatus;

      final matchesSearch =
          product.name.toLowerCase().contains(_searchText) ||
          product.id.toLowerCase().contains(_searchText);

      return matchesStatus && matchesSearch;
    }).toList();
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
                BulidHeader(text: 'قائمة المنتجات'),
                const SizedBox(height: 24),
                _buildSearchField(),
                const SizedBox(height: 16),
                _buildFilters(),
                const SizedBox(height: 16),

                Expanded(
                  child: FutureBuilder<List<Product>>(
                    future: _productsFuture,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState != ConnectionState.done) {
                        return const Center(child: CircularProgressIndicator());
                      }

                      if (snapshot.hasError) {
                        return const Center(
                          child: Text('حدث خطأ أثناء تحميل المنتجات'),
                        );
                      }

                      final products = _filterProducts(snapshot.data ?? []);

                      if (products.isEmpty) {
                        return const Center(
                          child: Text(
                            'لا توجد منتجات مطابقة',
                            style: TextStyle(
                              color: Color(0xFF667085),
                              fontSize: 18,
                              fontFamily: 'Zain',
                            ),
                          ),
                        );
                      }

                      return ListView.separated(
                        itemCount: products.length,
                        padding: const EdgeInsets.only(bottom: 20),
                        separatorBuilder: (_, __) => const SizedBox(height: 14),
                        itemBuilder: (_, index) {
                          return ItemOfProduct(
                            product: products[index],
                            onTap: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (_) => ProductDetailsScreen(
                                    product: products[index],
                                    repository: widget.repository,
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

  Widget _buildSearchField() {
    return TextField(
      controller: _searchController,
      style: const TextStyle(color: Color(0xFF151D32), fontFamily: 'Zain'),
      decoration: InputDecoration(
        hintText: 'ابحث عن منتج...',
        hintStyle: const TextStyle(
          color: Color(0xFF98A2B3),
          fontFamily: 'Zain',
          fontSize: 16,
        ),
        prefixIcon: const Icon(
          Icons.search_rounded,
          color: Color(0xFF667085),
          size: 30,
        ),
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 20,
          vertical: 16,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(18),
          borderSide: const BorderSide(color: Color(0xFFD0D5DD)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(18),
          borderSide: const BorderSide(color: Color(0xFF2E90FA), width: 1.5),
        ),
      ),
    );
  }

  Widget _buildFilters() {
    const filters = [
      _FilterOption(label: 'الكل'),
      _FilterOption(label: 'متوفر', status: ProductStockStatus.available),
      _FilterOption(
        label: 'على وشك النفاد',
        status: ProductStockStatus.lowStock,
      ),
      _FilterOption(label: 'غير متوفر', status: ProductStockStatus.outOfStock),
    ];

    return SizedBox(
      height: 45,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: filters.length,
        separatorBuilder: (_, __) => const SizedBox(width: 10),
        itemBuilder: (_, index) {
          final filter = filters[index];
          final isSelected = _selectedStatus == filter.status;

          return InkWell(
            onTap: () {
              setState(() {
                _selectedStatus = filter.status;
              });
            },
            borderRadius: BorderRadius.circular(14),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              padding: const EdgeInsets.symmetric(horizontal: 22),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFF2E90FA) : Colors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: isSelected
                      ? const Color(0xFF2E90FA)
                      : const Color(0xFFD0D5DD),
                ),
              ),
              child: Text(
                filter.label,
                style: TextStyle(
                  color: isSelected ? Colors.white : const Color(0xFF344054),
                  fontSize: 16,
                  fontWeight: FontWeight.w400,
                  fontFamily: 'Zain',
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _FilterOption {
  final String label;
  final ProductStockStatus? status;

  const _FilterOption({required this.label, this.status});
}
