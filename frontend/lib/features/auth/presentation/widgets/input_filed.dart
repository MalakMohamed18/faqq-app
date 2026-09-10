import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';

class InputFiled extends StatefulWidget {
  const InputFiled({super.key, required this.hint, required this.label});

  final String hint;
  final String label;

  @override
  State<InputFiled> createState() => _InputFiledState();
}

class _InputFiledState extends State<InputFiled> {
  bool isPasswordHidden = true;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text(
          textDirection: TextDirection.rtl,
          widget.label,
          style: TextStyle(
            color: Color(0xff667085),
            fontSize: 14,
            fontFamily: "Zain",
            fontWeight: FontWeight.w400,
          ),
        ),

        SizedBox(height: 8),

        TextFormField(
          obscureText: isPasswordHidden,
          textDirection: TextDirection.rtl,
          keyboardType: TextInputType.emailAddress,
          decoration: InputDecoration(
            hintText: widget.hint,
            hintStyle: TextStyle(
              color: Color(0xff101828),
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
            hintTextDirection: TextDirection.rtl,
            prefixIcon: IconButton(
              onPressed: () {
                setState(() {
                  isPasswordHidden = !isPasswordHidden;
                });
              },
              icon: HugeIcon(
                icon: isPasswordHidden
                    ? HugeIcons.strokeRoundedViewOffSlash
                    : HugeIcons.strokeRoundedView,
                size: 16,
                color: Color(0xff9CA3AF),
              ),
            ),

            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(width: 1, color: Color(0xffD0D5DD)),
            ),

            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(width: 1, color: Color(0xff2E90FA)),
            ),
          ),
        ),
      ],
    );
  }
}
