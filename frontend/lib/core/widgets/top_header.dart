import 'package:faqqa/app/theme/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';

class TopHeader extends StatelessWidget {
  const TopHeader({
    super.key,
    required this.businessName,
    this.onProfileTap,
    this.onNotificationTap,
  });

  final String businessName;
  final VoidCallback? onProfileTap;
  final VoidCallback? onNotificationTap;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        InkWell(
          onTap: onProfileTap,
          borderRadius: BorderRadius.circular(30),
          child: CircleAvatar(
            radius: 22,
            backgroundColor: Color(0xFFF2F4F7),
            child: HugeIcon(
              color: AppColors.textSecondary,
              size: 14,
              icon: HugeIcons.strokeRoundedUser,
            ),
          ),
        ),
        SizedBox(width: 16),

        Expanded(
          child: Text(
            businessName,
            textAlign: TextAlign.start,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 16,
              fontFamily: "Zain",
              fontWeight: FontWeight.w400,
            ),
          ),
        ),

        CircleAvatar(
          radius: 22,
          backgroundColor: Color(0xFFF2F4F7),
          child: IconButton(
            onPressed: onNotificationTap,
            icon: HugeIcon(
              icon: HugeIcons.strokeRoundedNotification01,
              color: AppColors.textPrimary,
            ),
          ),
        ),
      ],
    );
  }
}
