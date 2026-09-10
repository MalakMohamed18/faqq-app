import 'package:faqqa/core/widgets/app_bottom_bar.dart';
import 'package:faqqa/features/auth/presentation/pages/login_page.dart';
import 'package:faqqa/features/auth/presentation/pages/phone_verification_page.dart';
import 'package:faqqa/features/auth/presentation/pages/sign_up_page.dart';
import 'package:faqqa/features/home/presentation/pages/cash_flow_screen.dart';
import 'package:faqqa/features/inventory/data/fake_inventory_repository.dart';
import 'package:faqqa/features/inventory/presentation/inventory_dashboard_page.dart';
import 'package:faqqa/features/inventory/presentation/low_stock_screen.dart';
import 'package:faqqa/features/inventory/presentation/out_of_stock_screen.dart';
import 'package:faqqa/features/inventory/presentation/product_form_screen.dart';
import 'package:faqqa/features/inventory/presentation/products_list_screen.dart';

import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(home: InventoryDashboardPage());
  }
}
