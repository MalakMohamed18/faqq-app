import 'package:equatable/equatable.dart';

enum VerificationStatus { initial, verifying, verified, failure }

class VerificationState extends Equatable {
  const VerificationState({
    this.code = '',
    this.secondsRemaining = 47,
    this.status = VerificationStatus.initial,
    this.errorMessage,
    this.resendVersion = 0,
  });

  final String code;
  final int secondsRemaining;
  final VerificationStatus status;
  final String? errorMessage;
  final int resendVersion;

  bool get isCodeComplete => code.length == 6;
  bool get canResend => secondsRemaining == 0;

  String get formattedSeconds {
    return '00:${secondsRemaining.toString().padLeft(2, '0')}';
  }

  VerificationState copyWith({
    String? code,
    int? secondsRemaining,
    VerificationStatus? status,
    String? errorMessage,
    bool clearError = false,
    int? resendVersion,
  }) {
    return VerificationState(
      code: code ?? this.code,
      secondsRemaining: secondsRemaining ?? this.secondsRemaining,
      status: status ?? this.status,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
      resendVersion: resendVersion ?? this.resendVersion,
    );
  }

  @override
  List<Object?> get props => [
    code,
    secondsRemaining,
    status,
    errorMessage,
    resendVersion,
  ];
}
