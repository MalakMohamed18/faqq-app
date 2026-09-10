import 'package:equatable/equatable.dart';
import 'package:faqqa/core/widgets/validators.dart';

enum SignUpStatus { initial, submitting, success, failure }

class SignUpState extends Equatable {
  const SignUpState({
    this.activityType,
    this.activityName = '',
    this.email = '',
    this.phone = '',
    this.password = '',
    this.governorate,
    this.address = '',
    this.activityTypeTouched = false,
    this.activityNameTouched = false,
    this.emailTouched = false,
    this.phoneTouched = false,
    this.passwordTouched = false,
    this.governorateTouched = false,
    this.addressTouched = false,
    this.status = SignUpStatus.initial,
    this.failureMessage,
  });

  final String? activityType;
  final String activityName;
  final String email;
  final String phone;
  final String password;
  final String? governorate;
  final String address;

  final bool activityTypeTouched;
  final bool activityNameTouched;
  final bool emailTouched;
  final bool phoneTouched;
  final bool passwordTouched;
  final bool governorateTouched;
  final bool addressTouched;

  final SignUpStatus status;
  final String? failureMessage;

  String? get activityTypeError {
    if (activityType == null) return 'من فضلك اختاري نوع النشاط';
    return null;
  }

  String? get activityNameError => Validators.activityName(activityName);
  String? get emailError => Validators.email(email);
  String? get phoneError => Validators.phone(phone);
  String? get passwordError => Validators.password(password);

  String? get governorateError {
    if (governorate == null) return 'من فضلك اختاري المحافظة';
    return null;
  }

  String? get addressError => Validators.address(address);

  bool get isFormValid {
    return activityTypeError == null &&
        activityNameError == null &&
        emailError == null &&
        phoneError == null &&
        passwordError == null &&
        governorateError == null &&
        addressError == null;
  }

  bool get canSubmit {
    return isFormValid && status != SignUpStatus.submitting;
  }

  SignUpState copyWith({
    String? activityType,
    String? activityName,
    String? email,
    String? phone,
    String? password,
    String? governorate,
    String? address,
    bool? activityTypeTouched,
    bool? activityNameTouched,
    bool? emailTouched,
    bool? phoneTouched,
    bool? passwordTouched,
    bool? governorateTouched,
    bool? addressTouched,
    SignUpStatus? status,
    String? failureMessage,
    bool clearFailureMessage = false,
  }) {
    return SignUpState(
      activityType: activityType ?? this.activityType,
      activityName: activityName ?? this.activityName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      password: password ?? this.password,
      governorate: governorate ?? this.governorate,
      address: address ?? this.address,
      activityTypeTouched: activityTypeTouched ?? this.activityTypeTouched,
      activityNameTouched: activityNameTouched ?? this.activityNameTouched,
      emailTouched: emailTouched ?? this.emailTouched,
      phoneTouched: phoneTouched ?? this.phoneTouched,
      passwordTouched: passwordTouched ?? this.passwordTouched,
      governorateTouched: governorateTouched ?? this.governorateTouched,
      addressTouched: addressTouched ?? this.addressTouched,
      status: status ?? this.status,
      failureMessage: clearFailureMessage
          ? null
          : failureMessage ?? this.failureMessage,
    );
  }

  @override
  List<Object?> get props {
    return [
      activityType,
      activityName,
      email,
      phone,
      password,
      governorate,
      address,
      activityTypeTouched,
      activityNameTouched,
      emailTouched,
      phoneTouched,
      passwordTouched,
      governorateTouched,
      addressTouched,
      status,
      failureMessage,
    ];
  }
}
