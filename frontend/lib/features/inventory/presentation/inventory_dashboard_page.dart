import 'package:faqqa/app/theme/app_colors.dart';
import 'package:faqqa/core/widgets/top_header.dart';
import 'package:faqqa/cubit/inventory/inventory_cubit.dart';
import 'package:faqqa/cubit/inventory/inventory_state.dart';
import 'package:faqqa/features/inventory/presentation/products_list_screen.dart';
import 'package:faqqa/features/inventory/widgets/activeProduct.dart';
import 'package:faqqa/features/inventory/widgets/suggestion_card.dart';
import 'package:faqqa/features/inventory/widgets/summary_grid.dart';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../data/fake_inventory_repository.dart';

class InventoryDashboardPage extends StatelessWidget {
  const InventoryDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => InventoryCubit(FakeInventoryRepository())..loadDashboard(),
      child: const _InventoryDashboardView(),
    );
  }
}

class _InventoryDashboardView extends StatelessWidget {
  const _InventoryDashboardView();

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: const Color(0xFFFAFBFC),
        body: SafeArea(
          child: BlocBuilder<InventoryCubit, InventoryState>(
            builder: (context, state) {
              if (state.status == InventoryStatus.loading &&
                  state.data == null) {
                return const Center(
                  child: CircularProgressIndicator(color: AppColors.primary),
                );
              }

              if (state.status == InventoryStatus.failure) {
                return Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(state.errorMessage ?? 'حدث خطأ'),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: () {
                          context.read<InventoryCubit>().loadDashboard();
                        },
                        child: const Text('إعادة المحاولة'),
                      ),
                    ],
                  ),
                );
              }

              final data = state.data!;

              return RefreshIndicator(
                onRefresh: () {
                  return context.read<InventoryCubit>().loadDashboard();
                },
                child: ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(16, 18, 16, 26),
                  children: [
                    TopHeader(businessName: "سوبر ماركت النور"),
                    SizedBox(height: 24),

                    Text(
                      'المخزون',
                      textAlign: TextAlign.right,
                      style: TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        fontFamily: "Zain",
                      ),
                    ),
                    SizedBox(height: 3),
                    Text(
                      'تابع مخزونك واعرف إيه اللي محتاج إعادة طلب',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        fontFamily: "Zain",
                      ),
                    ),

                    SizedBox(height: 16),

                    SummaryGrid(summary: data.summary),

                    const SizedBox(height: 22),

                    SuggestionCard(
                      lowStockCount: data.summary.lowStockCount,
                      onShowProducts: () {
                        // سنربطها لاحقًا بصفحة المنتجات منخفضة المخزون.
                      },
                    ),

                    const SizedBox(height: 24),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'أكثر المنتجات حركة',
                          style: TextStyle(
                            color: AppColors.textPrimary,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            fontFamily: "Zain",
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => ProductsListScreen(
                                  repository: FakeInventoryRepository(),
                                ),
                              ),
                            );
                          },
                          child: const Text(
                            'عرض الكل',
                            style: TextStyle(
                              fontFamily: "Zain",
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 8),

                    SizedBox(
                      height: 190,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: data.mostActiveProducts.length,
                        separatorBuilder: (_, _) {
                          return const SizedBox(width: 12);
                        },
                        itemBuilder: (_, index) {
                          return ActiveProductCard(
                            product: data.mostActiveProducts[index],
                          );
                        },
                      ),
                    ),

                    const SizedBox(height: 18),
                    //bottom button
                    SizedBox(
                      height: 54,
                      child: ElevatedButton.icon(
                        onPressed: () {
                          // سنعمل صفحة إضافة منتج لاحقًا.
                        },
                        icon: const Icon(Icons.add),
                        label: const Text(
                          'إضافة منتجات',
                          style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

//////Top headire
