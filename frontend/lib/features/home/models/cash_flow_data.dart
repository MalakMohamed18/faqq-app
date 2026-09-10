enum CashFlowPeriod { day, week, month, year }

extension CashFlowPeriodX on CashFlowPeriod {
  String get label {
    switch (this) {
      case CashFlowPeriod.day:
        return 'اليوم';
      case CashFlowPeriod.week:
        return 'الأسبوع';
      case CashFlowPeriod.month:
        return 'الشهر';
      case CashFlowPeriod.year:
        return 'السنة';
    }
  }

  String get apiValue {
    switch (this) {
      case CashFlowPeriod.day:
        return 'day';
      case CashFlowPeriod.week:
        return 'week';
      case CashFlowPeriod.month:
        return 'month';
      case CashFlowPeriod.year:
        return 'year';
    }
  }
}

class CashChartPoint {
  final String label;
  final double amount;
  final bool isExpense;

  const CashChartPoint({
    required this.label,
    required this.amount,
    this.isExpense = false,
  });
}

class CashFlowData {
  final String total;
  final String incoming;
  final String outgoing;
  final String net;
  final String changeText;
  final bool isDecrease;
  final String chartTitle;
  final String dateRange;
  final List<CashChartPoint> chartPoints;

  const CashFlowData({
    required this.total,
    required this.incoming,
    required this.outgoing,
    required this.net,
    required this.changeText,
    required this.isDecrease,
    required this.chartTitle,
    required this.dateRange,
    required this.chartPoints,
  });
}
