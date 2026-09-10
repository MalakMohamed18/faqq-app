import 'package:faqqa/features/home/data/home_repository.dart';
import 'package:faqqa/features/home/data/onboarding_local_storage.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'home_state.dart';

class HomeCubit extends Cubit<HomeState> {
  HomeCubit(this._homeRepository, this._onboardingStorage)
    : super(const HomeState());

  final HomeRepository _homeRepository;
  final OnboardingLocalStorage _onboardingStorage;

  Future<void> loadHome({bool forceShowOnboarding = false}) async {
    try {
      final dashboard = await _homeRepository.getDashboard();
      final hasSeenOnboarding = await _onboardingStorage.hasSeenOnboarding();

      emit(
        state.copyWith(
          status: HomeStatus.success,
          data: dashboard,
          showOnboarding: forceShowOnboarding || !hasSeenOnboarding,
        ),
      );
    } catch (_) {
      emit(
        state.copyWith(
          status: HomeStatus.failure,
          errorMessage: 'تعذر تحميل بيانات الصفحة الرئيسية.',
        ),
      );
    }
  }

  Future<void> completeOnboarding() async {
    await _onboardingStorage.markOnboardingAsSeen();

    emit(state.copyWith(showOnboarding: false));
  }
}
