import 'package:equatable/equatable.dart';
import "package:faqqa/core/widgets/validators.dart";

enum AuthStatus { initial, submitting, success, failure }

class LoginState extends Equatable {
  const LoginState({
    this.email = '',
    this.password = '',
    this.emailTouched = false,
    this.passwordTouched = false,
    this.status = AuthStatus.initial,
    this.failureMessage,
  });

  final String email;
  final String password;

  final bool emailTouched;
  final bool passwordTouched;

  final AuthStatus status;
  final String? failureMessage;

  String? get emailError => Validators.email(email);
  String? get passwordError => Validators.password(password);

  bool get isFormValid {
    return emailError == null && passwordError == null;
  }

  bool get canSubmit {
    return isFormValid && status != AuthStatus.submitting;
  }

  LoginState copyWith({
    String? email,
    String? password,
    bool? emailTouched,
    bool? passwordTouched,
    AuthStatus? status,
    String? failureMessage,
    bool clearFailureMessage = false,
  }) {
    return LoginState(
      email: email ?? this.email,
      password: password ?? this.password,
      emailTouched: emailTouched ?? this.emailTouched,
      passwordTouched: passwordTouched ?? this.passwordTouched,
      status: status ?? this.status,
      failureMessage: clearFailureMessage
          ? null
          : failureMessage ?? this.failureMessage,
    );
  }

  @override
  List<Object?> get props {
    return [
      email,
      password,
      emailTouched,
      passwordTouched,
      status,
      failureMessage,
    ];
  }
}
