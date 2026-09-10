import '../models/cash_flow_data.dart';

class FakeCashFlowRepository {
  static CashFlowData getData(CashFlowPeriod period) {
    switch (period) {
      case CashFlowPeriod.day:
        return const CashFlowData(
          total: '1,850 ج.م',
          incoming: '+2,500 ج.م',
          outgoing: '-650 ج.م',
          net: '1,850 ج.م',
          changeText: '↓ 8% عن أمس',
          isDecrease: true,
          chartTitle: 'اتجاه آخر 7 أيام',
          dateRange: 'من 1 إلى 7 سبتمبر',
          chartPoints: [
            CashChartPoint(label: 'ح', amount: 60),
            CashChartPoint(label: 'س', amount: 25, isExpense: true),
            CashChartPoint(label: 'ج', amount: 45),
            CashChartPoint(label: 'خ', amount: 75),
            CashChartPoint(label: 'ر', amount: 32),
            CashChartPoint(label: 'ث', amount: 55),
            CashChartPoint(label: 'ن', amount: 20, isExpense: true),
          ],
        );

      case CashFlowPeriod.week:
        return const CashFlowData(
          total: '12,300 ج.م',
          incoming: '+16,000 ج.م',
          outgoing: '-3,700 ج.م',
          net: '12,300 ج.م',
          changeText: '↑ 12% عن الأسبوع السابق',
          isDecrease: false,
          chartTitle: 'اتجاه آخر 4 أسابيع',
          dateRange: 'من 1 إلى 28 سبتمبر',
          chartPoints: [
            CashChartPoint(label: 'أ1', amount: 45),
            CashChartPoint(label: 'أ2', amount: 65),
            CashChartPoint(label: 'أ3', amount: 40, isExpense: true),
            CashChartPoint(label: 'أ4', amount: 80),
          ],
        );

      case CashFlowPeriod.month:
        return const CashFlowData(
          total: '45,200 ج.م',
          incoming: '+60,000 ج.م',
          outgoing: '-14,800 ج.م',
          net: '45,200 ج.م',
          changeText: '↑ 18% عن الشهر السابق',
          isDecrease: false,
          chartTitle: 'اتجاه آخر 6 شهور',
          dateRange: 'من أبريل إلى سبتمبر',
          chartPoints: [
            CashChartPoint(label: 'أبريل', amount: 35),
            CashChartPoint(label: 'مايو', amount: 55),
            CashChartPoint(label: 'يونيو', amount: 42, isExpense: true),
            CashChartPoint(label: 'يوليو', amount: 70),
            CashChartPoint(label: 'أغسطس', amount: 62),
            CashChartPoint(label: 'سبتمبر', amount: 85),
          ],
        );

      case CashFlowPeriod.year:
        return const CashFlowData(
          total: '520,000 ج.م',
          incoming: '+680,000 ج.م',
          outgoing: '-160,000 ج.م',
          net: '520,000 ج.م',
          changeText: '↑ 25% عن السنة السابقة',
          isDecrease: false,
          chartTitle: 'اتجاه آخر 5 سنوات',
          dateRange: 'من 2022 إلى 2026',
          chartPoints: [
            CashChartPoint(label: '2022', amount: 30),
            CashChartPoint(label: '2023', amount: 45),
            CashChartPoint(label: '2024', amount: 52),
            CashChartPoint(label: '2025', amount: 70),
            CashChartPoint(label: '2026', amount: 90),
          ],
        );
    }
  }
}
