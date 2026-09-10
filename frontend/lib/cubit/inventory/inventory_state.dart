import 'package:equatable/equatable.dart';
import 'package:faqqa/features/inventory/models/inventory_models.dart';

enum InventoryStatus { initial, loading, success, failure }

class InventoryState extends Equatable {
  const InventoryState({
    this.status = InventoryStatus.initial,
    this.data,
    this.errorMessage,
  });

  final InventoryStatus status;
  final InventoryDashboardData? data;
  final String? errorMessage;

  InventoryState copyWith({
    InventoryStatus? status,
    InventoryDashboardData? data,
    String? errorMessage,
    bool clearError = false,
  }) {
    return InventoryState(
      status: status ?? this.status,
      data: data ?? this.data,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, data, errorMessage];
}
