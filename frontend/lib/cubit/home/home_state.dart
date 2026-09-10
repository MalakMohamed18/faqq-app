import 'package:equatable/equatable.dart';
import 'package:faqqa/features/home/models/home_dashboard_data.dart';

enum HomeStatus { initial, loading, success, failure }

class HomeState extends Equatable {
  const HomeState({
    this.status = HomeStatus.initial,
    this.data,
    this.showOnboarding = false,
    this.errorMessage,
  });

  final HomeStatus status;
  final HomeDashboardData? data;
  final bool showOnboarding;
  final String? errorMessage;

  HomeState copyWith({
    HomeStatus? status,
    HomeDashboardData? data,
    bool? showOnboarding,
    String? errorMessage,
    bool clearError = false,
  }) {
    return HomeState(
      status: status ?? this.status,
      data: data ?? this.data,
      showOnboarding: showOnboarding ?? this.showOnboarding,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, data, showOnboarding, errorMessage];
}
