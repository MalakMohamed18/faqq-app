import 'package:faqqa/features/home/models/cash_flow_data.dart';

class LiquidityForecastData {
  final String warningTitle;
  final String warningSubtitle;
  final String chartTitle;
  final String dateRange;
  final List<CashChartPoint> chartPoints;
  final List<String> reasons;
  final String suggestedAction;

  const LiquidityForecastData({
    required this.warningTitle,
    required this.warningSubtitle,
    required this.chartTitle,
    required this.dateRange,
    required this.chartPoints,
    required this.reasons,
    required this.suggestedAction,
  });
}

class FakeLiquidityForecastRepository {
  static LiquidityForecastData getData(CashFlowPeriod period) {
    switch (period) {
      case CashFlowPeriod.day:
        return const LiquidityForecastData(
          warningTitle: 'السيولة المتوقعة منخفضة خلال 7 أيام',
          warningSubtitle: 'بناءً على المصروفات والالتزامات المتوقعة',
          chartTitle: 'اتجاه آخر 7 أيام',
          dateRange: 'من 1 إلى 7 سبتمبر',
          chartPoints: [
            CashChartPoint(label: '7', amount: 52, isExpense: true),
            CashChartPoint(label: '6', amount: 37, isExpense: true),
            CashChartPoint(label: '5', amount: 48, isExpense: true),
            CashChartPoint(label: '4', amount: 58, isExpense: true),
            CashChartPoint(label: '3', amount: 72),
            CashChartPoint(label: '2', amount: 86),
            CashChartPoint(label: 'اليوم', amount: 98),
          ],
          reasons: [
            'مستحقات عملاء لم تحصل بعد — 900 ج.م',
            'التزام إيجار مستحق يوم 15',
            'مخزون يحتاج إعادة طلب قريبًا',
          ],
          suggestedAction: 'تحصيل مستحقات العملاء',
        );

      case CashFlowPeriod.week:
        return const LiquidityForecastData(
          warningTitle: 'السيولة تحتاج متابعة خلال 4 أسابيع',
          warningSubtitle: 'قد تتأثر بدفعات الموردين القادمة',
          chartTitle: 'توقع السيولة خلال 4 أسابيع',
          dateRange: 'من 8 سبتمبر إلى 5 أكتوبر',
          chartPoints: [
            CashChartPoint(label: 'أسبوع 1', amount: 62, isExpense: true),
            CashChartPoint(label: 'أسبوع 2', amount: 48, isExpense: true),
            CashChartPoint(label: 'أسبوع 3', amount: 66),
            CashChartPoint(label: 'أسبوع 4', amount: 82),
          ],
          reasons: [
            'دفعة موردين مستحقة خلال الأسبوع الثاني',
            'تأخر متوقع في تحصيل فاتورتين',
            'زيادة متوقعة في تكلفة المخزون',
          ],
          suggestedAction: 'جدولة دفعات الموردين',
        );

      case CashFlowPeriod.month:
        return const LiquidityForecastData(
          warningTitle: 'السيولة مستقرة مع حاجة للمتابعة',
          warningSubtitle: 'التوقعات تشير إلى تحسن تدريجي خلال الأشهر القادمة',
          chartTitle: 'توقع السيولة خلال 6 شهور',
          dateRange: 'من أكتوبر إلى مارس',
          chartPoints: [
            CashChartPoint(label: 'أكتوبر', amount: 45, isExpense: true),
            CashChartPoint(label: 'نوفمبر', amount: 52),
            CashChartPoint(label: 'ديسمبر', amount: 60),
            CashChartPoint(label: 'يناير', amount: 68),
            CashChartPoint(label: 'فبراير', amount: 74),
            CashChartPoint(label: 'مارس', amount: 86),
          ],
          reasons: [
            'موسم مبيعات أعلى في الربع القادم',
            'التزامات شهرية ثابتة تحتاج تغطية',
            'فرصة لتحسين دورة التحصيل',
          ],
          suggestedAction: 'مراجعة خطة المصروفات الشهرية',
        );

      case CashFlowPeriod.year:
        return const LiquidityForecastData(
          warningTitle: 'توقع السيولة السنوي إيجابي',
          warningSubtitle: 'مع وجود التزامات كبيرة تحتاج تخطيطًا مبكرًا',
          chartTitle: 'توقع السيولة خلال 5 سنوات',
          dateRange: 'من 2027 إلى 2031',
          chartPoints: [
            CashChartPoint(label: '2027', amount: 48, isExpense: true),
            CashChartPoint(label: '2028', amount: 58),
            CashChartPoint(label: '2029', amount: 66),
            CashChartPoint(label: '2030', amount: 78),
            CashChartPoint(label: '2031', amount: 92),
          ],
          reasons: [
            'توسع متوقع في حجم المبيعات',
            'الالتزامات السنوية ترتفع تدريجيًا',
            'احتياج محتمل لتمويل التوسع',
          ],
          suggestedAction: 'إعداد خطة سيولة سنوية',
        );
    }
  }
}
