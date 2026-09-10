import 'package:flutter/material.dart';

import 'theme/app_theme.dart';

class FaqqaApp extends StatelessWidget {
  const FaqqaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'فكّة',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: Scaffold(body: Center(child: Text('فكّة'))),
    );
  }
}
