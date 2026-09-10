import 'package:shared_preferences/shared_preferences.dart';

class OnboardingLocalStorage {
  static const _key = 'has_seen_home_onboarding';

  Future<bool> hasSeenOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_key) ?? false;
  }

  Future<void> markOnboardingAsSeen() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_key, true);
  }

  // استخدميها فقط أثناء التجربة لرؤية الدليل مرة ثانية.
  Future<void> resetOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }
}
