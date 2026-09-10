import 'package:faqqa/app/theme/app_colors.dart';
import 'package:flutter/material.dart';

class OtpCodeFields extends StatefulWidget {
  const OtpCodeFields({
    super.key,
    required this.onChanged,
    this.resetVersion = 0,
  });

  final ValueChanged<String> onChanged;
  final int resetVersion;

  @override
  State<OtpCodeFields> createState() => _OtpCodeFieldsState();
}

class _OtpCodeFieldsState extends State<OtpCodeFields> {
  final _controllers = List.generate(6, (_) => TextEditingController());
  final _focusNodes = List.generate(6, (_) => FocusNode());

  @override
  void didUpdateWidget(covariant OtpCodeFields oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.resetVersion != widget.resetVersion) {
      for (final controller in _controllers) {
        controller.clear();
      }

      _focusNodes.first.requestFocus();
    }
  }

  void _onChanged(String value, int index) {
    if (value.isNotEmpty && index < 5) {
      _focusNodes[index + 1].requestFocus();
    }

    if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }

    final code = _controllers.map((controller) => controller.text).join();
    widget.onChanged(code);
  }

  @override
  void dispose() {
    for (final controller in _controllers) {
      controller.dispose();
    }

    for (final focusNode in _focusNodes) {
      focusNode.dispose();
    }

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.ltr,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: List.generate(6, (index) {
          return SizedBox(
            width: 48,
            height: 90,
            child: TextField(
              controller: _controllers[index],
              focusNode: _focusNodes[index],
              autofocus: index == 0,
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              maxLength: 1,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
              onChanged: (value) => _onChanged(value, index),
              decoration: InputDecoration(
                counterText: '',
                contentPadding: EdgeInsets.zero,
                filled: true,
                fillColor: const Color(0xFFFFFFFF),
                border: _border(),
                enabledBorder: _border(),
                focusedBorder: _border(color: AppColors.primary, width: 2),
              ),
            ),
          );
        }),
      ),
    );
  }

  OutlineInputBorder _border({
    Color color = AppColors.border,
    double width = 1.5,
  }) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: BorderSide(color: color, width: width),
    );
  }
}
