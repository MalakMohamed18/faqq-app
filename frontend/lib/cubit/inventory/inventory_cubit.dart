import 'package:faqqa/features/inventory/data/inventory_repository.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'inventory_state.dart';

class InventoryCubit extends Cubit<InventoryState> {
  InventoryCubit(this._repository) : super(const InventoryState());

  final InventoryRepository _repository;

  Future<void> loadDashboard() async {
    emit(state.copyWith(status: InventoryStatus.loading, clearError: true));

    try {
      final data = await _repository.getDashboardData();

      emit(state.copyWith(status: InventoryStatus.success, data: data));
    } catch (_) {
      emit(
        state.copyWith(
          status: InventoryStatus.failure,
          errorMessage: 'تعذر تحميل بيانات المخزون.',
        ),
      );
    }
  }
}
