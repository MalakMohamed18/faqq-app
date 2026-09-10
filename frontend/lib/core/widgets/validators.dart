class Validators {
  Validators._();

  static String? requiredField(String value, {required String fieldName}) {
    if (value.trim().isEmpty) {
      return 'من فضلك أدخلي $fieldName';
    }

    return null;
  }

  static String? activityName(String value) {
    if (value.trim().isEmpty) {
      return 'من فضلك أدخلي اسم النشاط';
    }

    if (value.trim().length < 2) {
      return 'اسم النشاط يجب أن يكون حرفين على الأقل';
    }

    return null;
  }

  static String? email(String value) {
    if (value.trim().isEmpty) {
      return 'من فضلك أدخلي البريد الإلكتروني';
    }

    final emailRegex = RegExp(r'^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$');

    if (!emailRegex.hasMatch(value.trim())) {
      return 'البريد الإلكتروني غير صحيح';
    }

    return null;
  }

  static String? phone(String value) {
    if (value.trim().isEmpty) {
      return 'من فضلك أدخلي رقم الهاتف';
    }

    final phoneRegex = RegExp(r'^01[0125][0-9]{8}$');

    if (!phoneRegex.hasMatch(value.trim())) {
      return 'أدخلي رقم هاتف مصري صحيح يبدأ بـ 01';
    }

    return null;
  }

  static String? password(String value) {
    if (value.isEmpty) {
      return 'من فضلك أدخلي كلمة المرور';
    }

    if (value.length < 8) {
      return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }

    return null;
  }

  static String? address(String value) {
    if (value.trim().isEmpty) {
      return 'من فضلك أدخلي العنوان بالتفصيل';
    }

    if (value.trim().length < 5) {
      return 'العنوان قصير جدًا';
    }

    return null;
  }
}
