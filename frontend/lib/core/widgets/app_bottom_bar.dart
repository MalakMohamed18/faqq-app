import 'dart:ui';
import 'package:faqqa/features/home/presentation/pages/cash_flow_screen.dart';
import 'package:faqqa/features/home/presentation/pages/home_dashboard_page.dart';
import 'package:faqqa/features/inventory/presentation/inventory_dashboard_page.dart';
import 'package:faqqa/features/order/presentation/pages/order_screen.dart';
import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';

class AppBottomBar extends StatefulWidget {
  const AppBottomBar({super.key});

  @override
  State<AppBottomBar> createState() => _NavbarState();
}

class _NavbarState extends State<AppBottomBar> {
  int currentIndex = 0;

  // ترتيب الشاشات مطابق لترتيب الأيقونات (من اليمين لليسار زي الصورة)
  List<Widget> Screens = [
    HomeDashboardPage(), // الرئيسية
    OrderScreen(), // المبيعات
    // زرار الـ + (تقدر تغيّرها لأي شاشة تانية)
    InventoryDashboardPage(), // المخزون
    CashFlowScreen(), // المزيد
  ];

  // بيانات كل عنصر في النافبار (ما عدا زرار الـ +)
  final List<_NavItem> _items = [
    _NavItem(icon: HugeIcons.strokeRoundedHome03, label: 'الرئيسية'),
    _NavItem(icon: HugeIcons.strokeRoundedInvoice01, label: 'المبيعات'),
    _NavItem(icon: HugeIcons.strokeRoundedPackage01, label: 'المخزون'),
    _NavItem(icon: HugeIcons.strokeRoundedLayoutGrid, label: 'المزيد'),
  ];

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        extendBody: true,
        body: Screens[currentIndex],
        bottomNavigationBar: _buildNavBar(),
      ),
    );
  }

  Widget _buildNavBar() {
    // فهرس الشاشات الحقيقي: 0 الرئيسية, 1 المبيعات, 2 (+) وسط, 3 المخزون, 4 المزيد
    // بنبني القايمة دي بترتيب العرض على الشاشة (من اليمين لليسار زي الصورة):
    // الرئيسية - المبيعات - (+) - المخزون - المزيد
    // ارتفاع جسم الباص بار نفسه
    const double barHeight = 64;
    const double barBottomMargin = 14;
    // حجم زرار الـ +
    const double buttonSize = 58;

    // Y بتاعة سطح الباص بار العلوي (بالنسبة لقاع الـ SizedBox)
    const double barTopEdge = barBottomMargin + barHeight;
    // بنخلي نص الزرار (مركزه) يقع تقريبًا عند سطح الباص بار
    // عشان يبان وكأنه "نص دايرة" طالع منها، مش عايم فوقها
    const double buttonBottom = barTopEdge - (buttonSize * 0.55);

    return SizedBox(
      height: 88,
      child: Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.bottomCenter,
        children: [
          // الخلفية البيضاء المستديرة مع الظل
          Positioned(
            bottom: barBottomMargin,
            left: 16,
            right: 16,
            child: Container(
              height: barHeight,
              padding: EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 16,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildItem(0, _items[0]), // الرئيسية
                  _buildItem(1, _items[1]), // المبيعات
                  SizedBox(width: 52), // فراغ مكان زرار الـ +
                  _buildItem(2, _items[2]), // المخزون
                  _buildItem(3, _items[3]), // المزيد
                ],
              ),
            ),
          ),

          // الزرار الدائري نص طالع من الباص بار
          Positioned(
            bottom: buttonBottom,
            child: GestureDetector(
              onTap: () {
                _showAddMenu(context);
              },
              child: Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xff2E90FA),
                  border: Border.all(color: Colors.white, width: 8),
                ),
                child: Icon(Icons.add, color: Colors.white, size: 26),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildItem(int index, _NavItem item) {
    final bool isSelected = currentIndex == index;
    final Color color = isSelected
        ? const Color(0xff2E90FA)
        : const Color(0xff667085);

    return InkWell(
      onTap: () {
        setState(() {
          currentIndex = index;
        });
      },
      borderRadius: BorderRadius.circular(20),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            HugeIcon(icon: item.icon, color: color, size: 24),
            SizedBox(height: 4),
            Text(
              item.label,
              style: TextStyle(
                color: color,
                fontSize: 12,
                fontFamily: "Zain",
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

void _showAddMenu(BuildContext context) {
  showGeneralDialog(
    context: context,
    barrierDismissible: true, // يقفل لو ضغط برا
    barrierColor: Colors.transparent, // إحنا هنعمل البلور يدوي
    barrierLabel: 'Add Menu',
    transitionDuration: const Duration(milliseconds: 250),
    pageBuilder: (context, animation, secondaryAnimation) {
      return const SizedBox();
    },
    transitionBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(
        opacity: animation,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 3, sigmaY: 3),
          child: Material(
            color: Colors.transparent,
            child: Directionality(
              textDirection: TextDirection.rtl,
              child: Stack(
                children: [
                  Positioned(
                    bottom: 130, // فوق الباص بار
                    right: 60,
                    left: 60,
                    child: ScaleTransition(
                      scale: CurvedAnimation(
                        parent: animation,
                        curve: Curves.easeOutBack,
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          _menuItem(
                            icon: HugeIcons.strokeRoundedPackage01,
                            label: 'اضافة منتج',

                            onTap: () {
                              Navigator.pop(context);
                              // Navigator.push(context, MaterialPageRoute(builder: (_) => AddProductScreen()));
                            },
                          ),
                          SizedBox(height: 16),
                          _menuItem(
                            icon: HugeIcons.strokeRoundedWallet01,
                            label: 'مصروف',
                            onTap: () {
                              Navigator.pop(context);
                              // Navigator.push(context, MaterialPageRoute(builder: (_) => ExpenseScreen()));
                            },
                          ),
                          SizedBox(height: 16),
                          _menuItem(
                            icon: HugeIcons.strokeRoundedInvoice01,
                            label: 'فاتورة مشتريات',
                            onTap: () {
                              Navigator.pop(context);
                              // Navigator.push(context, MaterialPageRoute(builder: (_) => PurchaseInvoiceScreen()));
                            },
                          ),
                          const SizedBox(height: 16),
                          _menuItem(
                            icon: HugeIcons.strokeRoundedInvoice03,
                            label: 'بيع جديد',
                            onTap: () {
                              Navigator.pop(context);
                              // Navigator.push(context, MaterialPageRoute(builder: (_) => NewSaleScreen()));
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    },
  );
}

Widget _menuItem({
  required List<List<dynamic>> icon,
  required String label,
  required VoidCallback onTap,
}) {
  return Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.06),
                blurRadius: 10,
                offset: Offset(0, 3),
              ),
            ],
          ),
          child: Text(
            label,
            style: const TextStyle(
              fontFamily: "Zain",
              fontWeight: FontWeight.bold,
              fontSize: 14,
              color: Color(0xff101828),
            ),
          ),
        ),
      ),
      SizedBox(width: 12),
      GestureDetector(
        onTap: onTap,
        child: Container(
          width: 58,
          height: 58,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.06),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: HugeIcon(icon: icon, color: const Color(0xff2F8CF4), size: 14),
        ),
      ),
    ],
  );
}

class _NavItem {
  final List<List<dynamic>> icon;
  final String label;
  _NavItem({required this.icon, required this.label});
}
