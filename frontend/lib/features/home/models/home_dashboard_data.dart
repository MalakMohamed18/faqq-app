class HomeDashboardData {
  const HomeDashboardData({
    required this.businessName,
    required this.todaySales,
    required this.netCash,
    required this.lowStockCount,
    required this.receivables,
    required this.salesChangeText,
    required this.cashChangeText,
    required this.lowStockHint,
    required this.receivablesHint,
  });

  final String businessName;
  final double todaySales;
  final double netCash;
  final int lowStockCount;
  final double receivables;

  final String? salesChangeText;
  final String? cashChangeText;
  final String lowStockHint;
  final String receivablesHint;
}
