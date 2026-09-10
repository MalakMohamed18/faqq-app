import 'package:faqqa/cubit/SignUp/sign_up_cubit.dart';
import 'package:faqqa/cubit/SignUp/sign_up_state.dart';
import 'package:faqqa/features/auth/presentation/pages/login_page.dart';
import 'package:faqqa/features/auth/presentation/pages/phone_verification_page.dart';
import 'package:faqqa/features/auth/presentation/widgets/auth_dropdown_field.dart';
import 'package:faqqa/features/auth/presentation/widgets/auth_text_field.dart';
import 'package:faqqa/features/auth/presentation/widgets/submit_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../data/fake_auth_repository.dart';

class SignUpPage extends StatelessWidget {
  const SignUpPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => SignUpCubit(FakeAuthRepository()),
      child: const _SignUpView(),
    );
  }
}

class _SignUpView extends StatelessWidget {
  const _SignUpView();

  static const activityTypes = [
    'المواد الغذائية والاستهلاكية اليومية',
    'مطعم وكافيه',
    'ملابس وأزياء',
    'صيدلية',
    'تجميل وعناية شخصية',
    'إلكترونيات',
  ];

  static const governorates = [
    'القاهرة',
    'الجيزة',
    'الإسكندرية',
    'القليوبية',
    'الشرقية',
    'الدقهلية',
    'المنوفية',
  ];

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,

      child: BlocListener<SignUpCubit, SignUpState>(
        listenWhen: (previous, current) {
          return previous.status != current.status;
        },
        listener: (context, state) {
          if (state.status == SignUpStatus.success) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => PhoneVerificationPage(phone: state.phone),
              ),
            );
          }

          if (state.status == SignUpStatus.failure) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.failureMessage ?? 'حدث خطأ')),
            );
          }
        },
        child: Scaffold(
          backgroundColor: const Color(0xFFFAFBFC),
          body: SafeArea(
            child: BlocBuilder<SignUpCubit, SignUpState>(
              builder: (context, state) {
                final cubit = context.read<SignUpCubit>();

                return Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    textDirection: TextDirection.rtl,
                    children: [
                      Center(
                        child: Image.asset(
                          'assets/images/faq.png',
                          height: 120,
                          width: 120,
                        ),
                      ),

                      Text(
                        'إنشاء حساب',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Color(0xff111827),
                          fontFamily: "Zain",
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                        ),
                      ),

                      Text(
                        'أدخل بياناتك للمتابعة',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontFamily: "Zain",
                          color: Color(0xFF7B879D),
                          fontSize: 18,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      SizedBox(height: 16),

                      Expanded(
                        child: ListView(
                          children: [
                            AuthDropdownField(
                              label: 'نوع النشاط',
                              hint: 'اختاري نوع النشاط',
                              items: activityTypes,
                              value: state.activityType,
                              onChanged: cubit.activityTypeChanged,
                              errorText: state.activityTypeTouched
                                  ? state.activityTypeError
                                  : null,
                            ),
                            SizedBox(height: 16),

                            AuthTextField(
                              label: 'اسم النشاط',
                              hint: 'أدخل اسم نشاطك',
                              textInputAction: TextInputAction.next,
                              onChanged: cubit.activityNameChanged,
                              errorText: state.activityNameTouched
                                  ? state.activityNameError
                                  : null,
                            ),
                            SizedBox(height: 16),

                            AuthTextField(
                              label: 'البريد الإلكتروني',
                              hint: 'أدخل بريدك الإلكتروني',
                              keyboardType: TextInputType.emailAddress,
                              textInputAction: TextInputAction.next,
                              onChanged: cubit.emailChanged,
                              errorText: state.emailTouched
                                  ? state.emailError
                                  : null,
                            ),
                            SizedBox(height: 16),

                            AuthTextField(
                              label: 'رقم الهاتف',
                              hint: 'أدخل رقم الهاتف',
                              keyboardType: TextInputType.phone,
                              textInputAction: TextInputAction.next,
                              onChanged: cubit.phoneChanged,
                              errorText: state.phoneTouched
                                  ? state.phoneError
                                  : null,
                            ),
                            SizedBox(height: 16),

                            AuthTextField(
                              label: 'كلمة المرور',
                              hint: 'أدخل كلمة المرور',
                              isPassword: true,
                              textInputAction: TextInputAction.next,
                              onChanged: cubit.passwordChanged,
                              errorText: state.passwordTouched
                                  ? state.passwordError
                                  : null,
                            ),
                            SizedBox(height: 16),

                            AuthDropdownField(
                              label: 'المحافظة',
                              hint: 'اختاري المحافظة',
                              items: governorates,
                              value: state.governorate,
                              onChanged: cubit.governorateChanged,
                              prefixIcon: Icons.location_on_outlined,
                              errorText: state.governorateTouched
                                  ? state.governorateError
                                  : null,
                            ),
                            SizedBox(height: 16),

                            AuthTextField(
                              label: 'العنوان بالتفصيل',
                              hint: 'أدخل عنوانك',
                              textInputAction: TextInputAction.done,
                              onChanged: cubit.addressChanged,
                              errorText: state.addressTouched
                                  ? state.addressError
                                  : null,
                            ),
                            SizedBox(height: 16),

                            SubmitButton(
                              text: 'إنشاء حساب',
                              isEnabled: state.canSubmit,
                              isLoading:
                                  state.status == SignUpStatus.submitting,
                              onPressed: cubit.submit,
                            ),
                            SizedBox(height: 22),

                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Text(
                                  'لديك حساب بالفعل؟ ',
                                  style: TextStyle(fontSize: 17),
                                ),
                                GestureDetector(
                                  onTap: () {
                                    Navigator.pushReplacement(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) => const LoginPage(),
                                      ),
                                    );
                                  },
                                  child: const Text(
                                    'تسجيل الدخول',
                                    style: TextStyle(
                                      color: Color(0xFF2F8CF3),
                                      fontSize: 17,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
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
