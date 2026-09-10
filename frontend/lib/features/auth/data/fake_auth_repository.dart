import 'auth_repository.dart';

class FakeAuthRepository implements AuthRepository {
  @override
  Future<void> signUp({
    required String activityType,
    required String activityName,
    required String email,
    required String phone,
    required String password,
    required String governorate,
    required String address,
  }) async {
    // هذا مؤقت حتى يجهز الـbackend.
    await Future.delayed(const Duration(seconds: 2));
  }
}
