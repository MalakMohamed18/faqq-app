import 'package:flutter_bloc/flutter_bloc.dart';
import 'login_state.dart';

class LoginCubit extends Cubit<LoginState> {
  LoginCubit() : super(const LoginState());

  void emailChanged(String value) {
    emit(
      state.copyWith(
        email: value,
        emailTouched: true,
        status: AuthStatus.initial,
        clearFailureMessage: true,
      ),
    );
  }

  void passwordChanged(String value) {
    emit(
      state.copyWith(
        password: value,
        passwordTouched: true,
        status: AuthStatus.initial,
        clearFailureMessage: true,
      ),
    );
  }

  Future<void> submit() async {
    emit(state.copyWith(emailTouched: true, passwordTouched: true));

    if (!state.isFormValid) return;

    emit(
      state.copyWith(status: AuthStatus.submitting, clearFailureMessage: true),
    );

    try {
      // لاحقًا: استبدلي هذا باستدعاء الـrepository والـbackend.
      await Future.delayed(const Duration(seconds: 1));

      emit(state.copyWith(status: AuthStatus.success));
    } catch (_) {
      emit(
        state.copyWith(
          status: AuthStatus.failure,
          failureMessage: 'حدث خطأ، حاولي مرة أخرى.',
        ),
      );
    }
  }

  void signInWithGoogle() {
    // لاحقًا: هنا سيكون استدعاء Google Sign In.
  }

  void signInWithApple() {
    // لاحقًا: هنا سيكون استدعاء Apple Sign In.
  }
}
