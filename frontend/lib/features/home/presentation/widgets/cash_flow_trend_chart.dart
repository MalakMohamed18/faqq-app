import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:faqqa/features/home/models/cash_flow_data.dart';

class CashFlowTrendChart extends StatelessWidget {
  const CashFlowTrendChart({
    super.key,
    required this.points,
    required this.title,
    required this.dateRange,
  });
  final List<CashChartPoint> points;
  final String title;
  final String dateRange;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          title,
          textAlign: TextAlign.right,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w400,
            color: Color(0xFF151D32),
            fontFamily: "Zain",
          ),
        ),
        // SizedBox(height: 4),
        Text(
          dateRange,
          textAlign: TextAlign.right,
          style: TextStyle(
            fontSize: 12,
            color: Color(0xFF667085),

            fontFamily: "Zain",
          ),
        ),
        SizedBox(height: 10),
        SizedBox(
          height: 220,
          child: LineChart(
            LineChartData(
              minX: 0,
              maxX: (points.length - 1).toDouble(),
              minY: 0,
              maxY: 100,

              gridData: FlGridData(
                show: true,
                drawVerticalLine: false,
                horizontalInterval: 30,
                getDrawingHorizontalLine: (_) {
                  return const FlLine(
                    color: Color(0xFFE4E7EC),
                    strokeWidth: 1,
                    dashArray: [5, 5],
                  );
                },
              ),

              borderData: FlBorderData(show: false),

              titlesData: FlTitlesData(
                topTitles: const AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
                rightTitles: const AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
                leftTitles: const AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
                bottomTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    interval: 1,
                    reservedSize: 38,
                    getTitlesWidget: (value, meta) {
                      final index = value.toInt();

                      if (index < 0 || index >= points.length) {
                        return const SizedBox();
                      }

                      return Padding(
                        padding: const EdgeInsets.only(top: 12),
                        child: SizedBox(
                          width: 50,
                          child: Text(
                            points[index].label,
                            textAlign: TextAlign.center,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontFamily: "Zain",
                              color: Color(0xFF69758D),
                              fontSize: 10,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),

              lineTouchData: LineTouchData(
                enabled: true,
                handleBuiltInTouches: true,
                touchTooltipData: LineTouchTooltipData(
                  getTooltipColor: (_) => Colors.white,
                  getTooltipItems: (touchedSpots) {
                    return touchedSpots.map((spot) {
                      final point = points[spot.x.toInt()];
                      final pointColor = point.isExpense
                          ? const Color(0xFFF04438)
                          : const Color(0xFF2E90FA);
                      return LineTooltipItem(
                        '${point.label}\n',
                        TextStyle(
                          color: Colors.black54,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                        children: [
                          TextSpan(
                            text: '${point.amount.toStringAsFixed(0)} ج.م',
                            style: TextStyle(
                              color: pointColor,
                              fontWeight: FontWeight.w600,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      );
                    }).toList();
                  },
                ),
              ),

              lineBarsData: [
                LineChartBarData(
                  isCurved: true,
                  color: const Color(0xFF2E90FA),
                  barWidth: 4,
                  isStrokeCapRound: true,
                  belowBarData: BarAreaData(
                    show: true,
                    color: const Color(0xFF2E90FA).withOpacity(0.08),
                  ),
                  dotData: FlDotData(
                    show: true,
                    getDotPainter: (spot, percent, barData, index) {
                      return FlDotCirclePainter(
                        radius: 7,
                        color: points[index].isExpense
                            ? const Color(0xFFF04438)
                            : const Color(0xFF2E90FA),
                        strokeWidth: 0,
                      );
                    },
                  ),
                  spots: List.generate(
                    points.length,
                    (index) => FlSpot(index.toDouble(), points[index].amount),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
