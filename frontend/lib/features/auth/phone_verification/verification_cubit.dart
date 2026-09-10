import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';

import 'verification_state.dart';

class VerificationCubit extends Cubit<VerificationState> {
  VerificationCubit() : super(const VerificationState()) {
    _startTimer();
  }

  Timer? _timer;

  void _startTimer() {
    _timer?.cancel();

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      final seconds = state.secondsRemaining - 1;

      if (seconds <= 0) {
        timer.cancel();
        emit(state.copyWith(secondsRemaining: 0));
        return;
      }

      emit(state.copyWith(secondsRemaining: seconds));
    });
  }

  void codeChanged(String code) {
    emit(
      state.copyWith(
        code: code,
        status: VerificationStatus.initial,
        clearError: true,
      ),
    );
  }

  Future<void> verify() async {
    if (!state.isCodeComplete) return;

    emit(
      state.copyWith(status: VerificationStatus.verifying, clearError: true),
    );

    try {
      // مؤقتًا: أي 6 أرقام تعتبر صحيحة.
      // لاحقًا: استدعي API التحقق من الـOTP هنا.
      await Future.delayed(const Duration(seconds: 1));

      emit(state.copyWith(status: VerificationStatus.verified));
    } catch (_) {
      emit(
        state.copyWith(
          status: VerificationStatus.failure,
          errorMessage: 'كود التحقق غير صحيح، حاولي مرة أخرى.',
        ),
      );
    }
  }

  void resendCode() {
    if (!state.canResend) return;

    // لاحقًا: API لإعادة إرسال الكود.
    emit(
      state.copyWith(
        code: '',
        secondsRemaining: 47,
        status: VerificationStatus.initial,
        clearError: true,
        resendVersion: state.resendVersion + 1,
      ),
    );

    _startTimer();
  }

  @override
  Future<void> close() {
    _timer?.cancel();
    return super.close();
  }
}
