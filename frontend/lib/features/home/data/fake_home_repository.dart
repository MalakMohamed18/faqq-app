import '../models/home_dashboard_data.dart';
import 'home_repository.dart';

class FakeHomeRepository implements HomeRepository {
  FakeHomeRepository({this.showDemoData = true});

  // اجعليها false لاختبار أول حالة: أصفار ولا توجد عمليات بيع.
  final bool showDemoData;

  @override
  Future<HomeDashboardData> getDashboard() async {
    await Future.delayed(const Duration(milliseconds: 700));

    if (!showDemoData) {
      return const HomeDashboardData(
        businessName: 'سوبر ماركت النور',
        todaySales: 0,
        netCash: 0,
        lowStockCount: 0,
        receivables: 0,
        salesChangeText: null,
        cashChangeText: null,
        lowStockHint: 'لا يوجد منتجات بعد',
        receivablesHint: 'لا يوجد عملاء بعد',
      );
    }

    return const HomeDashboardData(
      businessName: 'سوبر ماركت النور',
      todaySales: 2500,
      netCash: 1850,
      lowStockCount: 3,
      receivables: 900,
      salesChangeText: '↑ 12% عن أمس',
      cashChangeText: '↓ 8% عن أمس',
      lowStockHint: 'شاي، سكر وزيت',
      receivablesHint: '3 عملاء متأخرين في السداد',
    );
  }
}
