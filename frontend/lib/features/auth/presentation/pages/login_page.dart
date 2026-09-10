import 'package:faqqa/cubit/Login/login_cubit.dart';
import 'package:faqqa/cubit/Login/login_state.dart';
import 'package:faqqa/features/auth/presentation/widgets/input_filed.dart';
import 'package:faqqa/features/auth/presentation/widgets/submit_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hugeicons/hugeicons.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(create: (_) => LoginCubit(), child: const _LoginView());
  }
}

class _LoginView extends StatelessWidget {
  const _LoginView();

  @override
  Widget build(BuildContext context) {
    return BlocListener<LoginCubit, LoginState>(
      listenWhen: (previous, current) {
        return previous.status != current.status;
      },
      listener: (context, state) {
        if (state.status == AuthStatus.success) {
          // انتقلي للـHome لاحقًا.
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('تم تسجيل الدخول بنجاح')),
          );
        }

        if (state.status == AuthStatus.failure) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.failureMessage ?? 'حدث خطأ')),
          );
        }
      },
      child: Scaffold(
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: BlocBuilder<LoginCubit, LoginState>(
              builder: (context, state) {
                final cubit = context.read<LoginCubit>();

                return Column(
                  children: [
                    Image.asset(
                      'assets/images/faq.png',
                      width: 120,
                      height: 120,
                    ),
                    Text(
                      'تسجيل الدخول',
                      style: TextStyle(
                        fontSize: 30,
                        fontFamily: "Zain",
                        fontWeight: FontWeight.bold,
                        color: Color(0xff111827),
                      ),
                    ),
                    Text(
                      "أدخل بياناتك للمتابعة",
                      style: TextStyle(
                        fontSize: 18,
                        fontFamily: "Zain",
                        fontWeight: FontWeight.w400,
                        color: Color(0xff667085),
                      ),
                    ),
                    SizedBox(height: 16),
                    Expanded(
                      child: ListView(
                        children: [
                          SizedBox(
                            height: 55,
                            child: OutlinedButton.icon(
                              style: OutlinedButton.styleFrom(
                                side: BorderSide(color: Color(0xffD0D5DD)),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              onPressed: cubit.signInWithGoogle,
                              icon: HugeIcon(
                                icon: HugeIcons.strokeRoundedGoogle,
                                size: 16,
                                color: Colors.red,
                              ),
                              label: Text(
                                textDirection: TextDirection.rtl,
                                'المتابعة باستخدام Google',
                                style: TextStyle(
                                  color: Color(0xff0A0A0A),
                                  fontSize: 16,
                                  fontFamily: "Zain",
                                  fontWeight: FontWeight.w400,
                                ),
                              ),
                            ),
                          ),
                          SizedBox(height: 16),

                          SizedBox(
                            height: 55,
                            child: OutlinedButton.icon(
                              onPressed: cubit.signInWithApple,
                              icon: HugeIcon(
                                icon: HugeIcons.strokeRoundedApple,
                                size: 16,
                                color: Colors.white,
                              ),
                              label: Text(
                                textDirection: TextDirection.rtl,
                                'المتابعة باستخدام Apple',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontFamily: "Zain",
                                  fontWeight: FontWeight.w400,
                                ),
                              ),
                              style: OutlinedButton.styleFrom(
                                backgroundColor: Color(0xff000000),
                                side: BorderSide(color: Color(0xffD0D5DD)),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                            ),
                          ),
                          SizedBox(height: 24),
                          Row(
                            children: [
                              Expanded(child: Divider()),
                              Padding(
                                padding: EdgeInsets.symmetric(horizontal: 12),
                                child: Text(
                                  'أو المتابعة باستخدام البريد الإلكتروني',
                                  style: TextStyle(
                                    color: Color(0xff8A95A3),
                                    fontSize: 12,
                                    fontFamily: "Zain",
                                    fontWeight: FontWeight.w400,
                                  ),
                                ),
                              ),
                              Expanded(child: Divider()),
                            ],
                          ),
                          SizedBox(height: 28),

                          InputFiled(
                            hint: "ادخل بريدك الإلكتروني",
                            label: "البريد الإلكتروني",
                          ),
                          SizedBox(height: 16),

                          InputFiled(
                            hint: "ادخل كلمة المرور",
                            label: "كلمة المرور",
                          ),
                          SizedBox(height: 24),

                          SubmitButton(
                            text: 'تسجيل الدخول',
                            isEnabled: state.canSubmit,
                            isLoading: state.status == AuthStatus.submitting,
                            onPressed: cubit.submit,
                          ),
                        ],
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      textDirection: TextDirection.rtl,
                      children: [
                        Text(
                          'ليس لديك حساب؟',
                          style: TextStyle(
                            color: Color(0xff667085),
                            fontSize: 14,
                            fontFamily: "Zain",
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            // انتقلي لصفحة التسجيل لاحقًا.
                          },
                          child: Text(
                            "انشاء حساب",
                            style: TextStyle(
                              color: Color(0xff2E90FA),
                              fontSize: 16,
                              fontFamily: "Zain",
                              fontWeight: FontWeight.w400,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}
