import 'package:faqqa/app/theme/app_colors.dart';
import 'package:faqqa/core/widgets/app_bottom_bar.dart';
import 'package:faqqa/core/widgets/top_header.dart';
import 'package:faqqa/cubit/home/home_cubit.dart';
import 'package:faqqa/cubit/home/home_state.dart';
import 'package:faqqa/features/home/data/fake_home_repository.dart';
import 'package:faqqa/features/home/data/onboarding_local_storage.dart';
import 'package:faqqa/features/home/models/home_dashboard_data.dart';
import 'package:faqqa/features/home/presentation/widgets/voice_search_field.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hugeicons/hugeicons.dart';

import 'onboarding_overlay.dart';

class HomeDashboardPage extends StatelessWidget {
  const HomeDashboardPage({super.key, this.forceShowOnboarding = false});

  final bool forceShowOnboarding;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => HomeCubit(
        FakeHomeRepository(showDemoData: false),
        OnboardingLocalStorage(),
      )..loadHome(forceShowOnboarding: forceShowOnboarding),
      child: const _HomeDashboardView(),
    );
  }
}

class _HomeDashboardView extends StatelessWidget {
  const _HomeDashboardView();

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: BlocListener<HomeCubit, HomeState>(
        listenWhen: (previous, current) {
          return !previous.showOnboarding && current.showOnboarding;
        },
        listener: (context, state) {
          showGeneralDialog(
            context: context,
            barrierDismissible: false,
            barrierColor: Colors.black.withValues(alpha: 0.58),
            pageBuilder: (dialogContext, _, __) {
              return OnboardingOverlay(
                onFinish: () async {
                  Navigator.of(dialogContext).pop();
                  await context.read<HomeCubit>().completeOnboarding();
                },
              );
            },
          );
        },
        child: BlocBuilder<HomeCubit, HomeState>(
          builder: (context, state) {
            if (state.status == HomeStatus.failure) {
              return Scaffold(
                backgroundColor: const Color(0xFFF9FAFB),
                body: Center(
                  child: ElevatedButton(
                    onPressed: () {
                      context.read<HomeCubit>().loadHome();
                    },
                    child: const Text('إعادة المحاولة'),
                  ),
                ),
              );
            }

            // مهم: أول ما الصفحة تفتح data تكون null مؤقتًا.
            // لا نستخدم state.data! قبل هذا الشرط.
            final data = state.data;

            if (data == null) {
              return const Scaffold(
                backgroundColor: Color(0xFFFAFBFC),
                body: Center(
                  child: CircularProgressIndicator(color: AppColors.primary),
                ),
              );
            }
            ////mmmmmmmmm//
            return Scaffold(
              backgroundColor: const Color(0xFFF9FAFB),

              body: SafeArea(
                child: Column(
                  children: [
                    // الـHeader منفصل ويأخذ الاسم من الداتا.
                    Padding(
                      padding: EdgeInsets.all(16),
                      child: TopHeader(
                        businessName: data.businessName,
                        onProfileTap: () {
                          // لاحقًا: صفحة الحساب.
                        },
                        onNotificationTap: () {
                          // لاحقًا: صفحة الإشعارات.
                        },
                      ),
                    ),

                    Divider(height: 1, thickness: 1, color: Color(0xff9CA3AF)),

                    Expanded(
                      child: RefreshIndicator(
                        onRefresh: () {
                          return context.read<HomeCubit>().loadHome();
                        },
                        child: ListView(
                          physics: AlwaysScrollableScrollPhysics(),
                          padding: EdgeInsets.only(left: 16, right: 16),
                          children: [
                            SizedBox(height: 20),
                            Text(
                              'سجل أول عملية بيع النهاردة',

                              textAlign: TextAlign.start,
                              style: TextStyle(
                                fontFamily: "zain",
                                color: AppColors.textPrimary,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),

                            VoiceSearchField(
                              onTextChanged: (text) {
                                //  debugPrint('النص المسجل: $text');
                              },
                            ),
                            SizedBox(height: 5),

                            Row(
                              children: [
                                HugeIcon(
                                  icon: HugeIcons.strokeRoundedChat01,
                                  color: Color(0xff7B5FFF),
                                ),
                                SizedBox(width: 4),
                                Text(
                                  'جرّب قول: عندي شاي بسعر 25 جنيه وكمية 50',
                                  textAlign: TextAlign.start,
                                  style: TextStyle(
                                    fontFamily: "Zain",
                                    fontStyle: FontStyle.italic,
                                    color: AppColors.textSecondary,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 24),

                            Text(
                              'نظرة سريعة على أداء محلك اليوم',
                              textAlign: TextAlign.start,
                              style: TextStyle(
                                color: AppColors.textPrimary,
                                fontSize: 14,
                                fontFamily: "Zain",
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            SizedBox(height: 16),

                            _MetricsGrid(data: data),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class _MetricsGrid extends StatelessWidget {
  const _MetricsGrid({required this.data});

  final HomeDashboardData data;

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 14,
      crossAxisSpacing: 14,
      childAspectRatio: 1.18,
      children: [
        _MetricCard(
          title: 'مبيعات اليوم',
          value: '${data.todaySales.toStringAsFixed(0)} ',
          hint: data.salesChangeText ?? 'لا توجد مبيعات بعد',
          hintColor: data.todaySales > 0
              ? const Color(0xFF16A34A)
              : AppColors.textSecondary,
        ),
        _MetricCard(
          title: 'صافي الحركة النقدية',
          value: '${data.netCash.toStringAsFixed(0)} ',
          hint: data.cashChangeText ?? 'لا توجد حركة بعد',
          hintColor: data.netCash > 0
              ? const Color(0xFFDC2626)
              : AppColors.textSecondary,
        ),
        _MetricCard(
          title: 'المخزون الحرج',
          value: '${data.lowStockCount} ',
          hint: data.lowStockHint,
          hintColor: data.lowStockCount > 0
              ? const Color(0xFFDC2626)
              : AppColors.textSecondary,
        ),
        _MetricCard(
          title: 'مستحقات العملاء',
          value: '${data.receivables.toStringAsFixed(0)} ',
          hint: data.receivablesHint,
          hintColor: data.receivables > 0
              ? const Color(0xFFDC2626)
              : AppColors.textSecondary,
        ),
      ],
    );
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.title,
    required this.value,
    required this.hint,
    required this.hintColor,
  });

  final String title;
  final String value;
  final String hint;
  final Color hintColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Color(0xffE5E7EB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            textAlign: TextAlign.start,
            value,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 24,
              fontWeight: FontWeight.bold,
              fontFamily: "Zain",
            ),
          ),
          // Spacer(),
          SizedBox(height: 15),
          Text(
            textAlign: TextAlign.start,
            title,
            style: const TextStyle(
              color: AppColors.textSecondary,
              fontSize: 16,
              fontWeight: FontWeight.w600,
              fontFamily: "Zain",
            ),
          ),

          Text(
            textAlign: TextAlign.start,
            hint,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: hintColor,
              fontSize: 12,
              fontWeight: FontWeight.w600,
              fontFamily: "Zain",
            ),
          ),
        ],
      ),
    );
  }
}
