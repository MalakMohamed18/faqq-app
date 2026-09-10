import 'package:faqqa/features/auth/phone_verification/verification_cubit.dart';
import 'package:faqqa/features/auth/phone_verification/verification_state.dart';
import 'package:faqqa/features/auth/presentation/widgets/submit_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../widgets/otp_code_fields.dart';
import '../widgets/verification_success_dialog.dart';

class PhoneVerificationPage extends StatelessWidget {
  const PhoneVerificationPage({super.key, required this.phone});

  final String phone;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => VerificationCubit(),
      child: _PhoneVerificationView(phone: phone),
    );
  }
}

class _PhoneVerificationView extends StatelessWidget {
  const _PhoneVerificationView({required this.phone});

  final String phone;

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: BlocListener<VerificationCubit, VerificationState>(
        listenWhen: (previous, current) {
          return previous.status != current.status;
        },
        listener: (context, state) {
          if (state.status == VerificationStatus.verified) {
            showDialog(
              context: context,
              barrierDismissible: true,
              builder: (_) {
                return VerificationSuccessDialog(
                  onContinue: () {
                    Navigator.pop(context);

                    // لاحقًا: الانتقال للصفحة الرئيسية.
                    // Navigator.pushReplacementNamed(context, '/home');
                  },
                );
              },
            );
          }

          if (state.status == VerificationStatus.failure) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.errorMessage ?? 'حدث خطأ')),
            );
          }
        },
        child: Scaffold(
          backgroundColor: const Color(0xFFFAFBFC),
          body: SafeArea(
            child: BlocBuilder<VerificationCubit, VerificationState>(
              builder: (context, state) {
                final cubit = context.read<VerificationCubit>();

                return Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Spacer(flex: 2),

                      Text(
                        textDirection: TextDirection.rtl,
                        'تأكيد رقم الهاتف',
                        style: TextStyle(
                          fontFamily: "Zain",
                          color: Color(0xFF101828),
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 6),

                      Text(
                        'بعتنالك كود تحقق مكون من 6 أرقام على',

                        style: TextStyle(
                          color: Color(0xFF667085),
                          fontSize: 16,
                          fontFamily: "Zain",
                          fontWeight: FontWeight.w500,
                        ),
                      ),

                      Row(
                        children: [
                          Directionality(
                            textDirection: TextDirection.ltr,
                            child: Text(
                              phone,
                              style: const TextStyle(
                                color: Color(0xFF101828),
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          SizedBox(width: 4),
                          GestureDetector(
                            onTap: () => Navigator.pop(context),
                            child: const Text(
                              'تعديل الرقم',
                              style: TextStyle(
                                color: Color(0xFF2F8CF3),
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                decoration: TextDecoration.underline,
                                decorationColor: Color(0xFF2F8CF3),
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 32),

                      OtpCodeFields(
                        resetVersion: state.resendVersion,
                        onChanged: cubit.codeChanged,
                      ),

                      if (!state.canResend)
                        Center(
                          child: Text(
                            textAlign: TextAlign.start,
                            'إعادة الإرسال بعد ${state.formattedSeconds}',
                            style: const TextStyle(
                              color: Color(0xFF7B879D),
                              fontSize: 15,
                              fontFamily: "Zain",
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        )
                      else
                        TextButton(
                          onPressed: cubit.resendCode,
                          child: Center(
                            child: Text(
                              'إعادة إرسال الكود',
                              style: TextStyle(
                                color: Color(0xFF2F8CF3),
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                                fontFamily: "Zain",
                              ),
                            ),
                          ),
                        ),

                      Spacer(flex: 4),

                      SubmitButton(
                        text: 'التالي',
                        isEnabled: state.isCodeComplete,
                        isLoading: state.status == VerificationStatus.verifying,
                        onPressed: cubit.verify,
                      ),

                      Padding(
                        padding: const EdgeInsets.only(left: 16, right: 16),
                        child: Text.rich(
                          TextSpan(
                            text: 'لم يصلك الكود؟ ',
                            style: TextStyle(
                              color: Color(0xFF7B879D),
                              fontSize: 17,
                              fontWeight: FontWeight.w600,
                              fontFamily: "Zain",
                            ),
                            children: [
                              TextSpan(
                                text: 'تواصل معنا عبر واتساب',
                                style: TextStyle(
                                  color: Color(0xFF2F8CF3),
                                  fontWeight: FontWeight.w700,
                                  fontFamily: "Zain",
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}
