abstract class AuthRepository {
  Future<void> signUp({
    required String activityType,
    required String activityName,
    required String email,
    required String phone,
    required String password,
    required String governorate,
    required String address,
  });
}
