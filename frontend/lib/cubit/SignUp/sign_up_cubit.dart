import 'package:faqqa/features/auth/data/auth_repository.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'sign_up_state.dart';

class SignUpCubit extends Cubit<SignUpState> {
  SignUpCubit(this._authRepository) : super(const SignUpState());

  final AuthRepository _authRepository;

  void activityTypeChanged(String? value) {
    if (value == null) return;

    emit(
      state.copyWith(
        activityType: value,
        activityTypeTouched: true,
        status: SignUpStatus.initial,
        clearFailureMessage: true,
      ),
    );
  }

  void activityNameChanged(String value) {
    emit(
      state.copyWith(
        activityName: value,
        activityNameTouched: true,
        status: SignUpStatus.initial,
        clearFailureMessage: true,
      ),
    );
  }

  void emailChanged(String value) {
    emit(
      state.copyWith(
        email: value,
        emailTouched: true,
        status: SignUpStatus.initial,
        clearFailureMessage: true,
      ),
    );
  }

  void phoneChanged(String value) {
    emit(
      state.copyWith(
        phone: value,
        phoneTouched: true,
        status: SignUpStatus.initial,
        clearFailureMessage: true,
      ),
    );
  }

  void passwordChanged(String value) {
    emit(
      state.copyWith(
        password: value,
        passwordTouched: true,
        status: SignUpStatus.initial,
        clearFailureMessage: true,
      ),
    );
  }

  void governorateChanged(String? value) {
    if (value == null) return;

    emit(
      state.copyWith(
        governorate: value,
        governorateTouched: true,
        status: SignUpStatus.initial,
        clearFailureMessage: true,
      ),
    );
  }

  void addressChanged(String value) {
    emit(
      state.copyWith(
        address: value,
        addressTouched: true,
        status: SignUpStatus.initial,
        clearFailureMessage: true,
      ),
    );
  }

  Future<void> submit() async {
    emit(
      state.copyWith(
        activityTypeTouched: true,
        activityNameTouched: true,
        emailTouched: true,
        phoneTouched: true,
        passwordTouched: true,
        governorateTouched: true,
        addressTouched: true,
      ),
    );

    if (!state.isFormValid) return;

    emit(
      state.copyWith(
        status: SignUpStatus.submitting,
        clearFailureMessage: true,
      ),
    );

    try {
      await _authRepository.signUp(
        activityType: state.activityType!,
        activityName: state.activityName.trim(),
        email: state.email.trim(),
        phone: state.phone.trim(),
        password: state.password,
        governorate: state.governorate!,
        address: state.address.trim(),
      );

      emit(state.copyWith(status: SignUpStatus.success));
    } catch (_) {
      emit(
        state.copyWith(
          status: SignUpStatus.failure,
          failureMessage: 'حدث خطأ أثناء إنشاء الحساب، حاولي مرة أخرى.',
        ),
      );
    }
  }
}
