import 'package:faqqa/app/theme/app_colors.dart';
import 'package:flutter/material.dart';

class OnboardingOverlay extends StatefulWidget {
  const OnboardingOverlay({super.key, required this.onFinish});

  final Future<void> Function() onFinish;

  @override
  State<OnboardingOverlay> createState() => _OnboardingOverlayState();
}

class _OnboardingOverlayState extends State<OnboardingOverlay> {
  int _currentStep = 0;

  final _steps = const [
    _OnboardingStep(
      title: 'ابدأ من هنا',
      description:
          'اكتب أو اتكلم بأي حاجة - بيع، سؤال، أو أي حاجة عايز تعرفها عن محلك.',
    ),
    _OnboardingStep(
      title: 'سجل بيعك من هنا',
      description: 'دوس على زر الإضافة السريعة لتسجيل أي عملية بيع في ثواني.',
    ),
    _OnboardingStep(
      title: 'هنا هتلاقي ملخص شغلك',
      description:
          'أول ما تبدأ تبيع، هتلاقي هنا مبيعاتك وحركتك المالية بالكامل.',
    ),
  ];

  Future<void> _next() async {
    if (_currentStep == _steps.length - 1) {
      await widget.onFinish();
      return;
    }

    setState(() => _currentStep++);
  }

  @override
  Widget build(BuildContext context) {
    final step = _steps[_currentStep];

    return Material(
      color: Colors.transparent,
      child: SafeArea(
        child: Stack(
          children: [
            Positioned(
              top: 8,
              left: 14,
              child: TextButton(
                onPressed: widget.onFinish,
                child: const Text(
                  'تخطي',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
            AnimatedAlign(
              duration: const Duration(milliseconds: 250),
              curve: Curves.easeOut,
              alignment: _currentStep == 0
                  ? const Alignment(0, -0.05)
                  : _currentStep == 1
                  ? const Alignment(0, 0.30)
                  : Alignment.bottomCenter,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 22),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Directionality(
                    textDirection: TextDirection.rtl,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 9,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF1F5F9),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                '${_currentStep + 1}/3',
                                style: const TextStyle(
                                  color: AppColors.textSecondary,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                            const Spacer(),
                            TextButton(
                              onPressed: widget.onFinish,
                              child: const Text(
                                'تخطي',
                                style: TextStyle(
                                  color: AppColors.textSecondary,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          step.title,
                          style: const TextStyle(
                            color: AppColors.textPrimary,
                            fontSize: 19,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          step.description,
                          style: const TextStyle(
                            color: AppColors.textSecondary,
                            fontSize: 15,
                            height: 1.5,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 20),
                        Row(
                          children: [
                            Expanded(
                              child: Row(
                                children: List.generate(3, (index) {
                                  return AnimatedContainer(
                                    duration: const Duration(milliseconds: 200),
                                    width: index == _currentStep ? 18 : 7,
                                    height: 7,
                                    margin: const EdgeInsets.only(left: 5),
                                    decoration: BoxDecoration(
                                      color: index == _currentStep
                                          ? AppColors.primary
                                          : const Color(0xFFE3E8EF),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                  );
                                }),
                              ),
                            ),
                            ElevatedButton(
                              onPressed: _next,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                foregroundColor: Colors.white,
                                elevation: 0,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 22,
                                  vertical: 12,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(11),
                                ),
                              ),
                              child: Text(
                                _currentStep == 2 ? 'ابدأ' : 'التالي',
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OnboardingStep {
  const _OnboardingStep({required this.title, required this.description});

  final String title;
  final String description;
}
