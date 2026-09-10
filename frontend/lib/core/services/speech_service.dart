import 'package:speech_to_text/speech_recognition_result.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

class SpeechService {
  final stt.SpeechToText _speech = stt.SpeechToText();

  bool _isInitialized = false;

  bool get isListening => _speech.isListening;

  Future<bool> initialize({
    required void Function(String status) onStatus,
    required void Function(String message) onError,
  }) async {
    if (_isInitialized) return true;

    try {
      final isAvailable = await _speech.initialize(
        onStatus: onStatus,
        onError: (error) => onError(error.errorMsg),
      );

      _isInitialized = isAvailable;

      if (!isAvailable) {
        onError('التعرف على الصوت غير متاح على هذا الجهاز.');
      }

      return isAvailable;
    } catch (_) {
      _isInitialized = false;

      onError('ميزة الصوت لا تعمل على هذا المحاكي. جربيها على موبايل حقيقي.');

      return false;
    }
  }

  Future<void> startListening({
    required void Function(String text) onResult,
  }) async {
    if (!_isInitialized) {
      // throw Exception('Speech service is not initialized');
    }

    await _speech.listen(
      localeId: 'ar_EG',
      partialResults: true,
      cancelOnError: true,
      listenMode: stt.ListenMode.confirmation,
      onResult: (SpeechRecognitionResult result) {
        onResult(result.recognizedWords);
      },
    );
  }

  Future<void> stopListening() async {
    await _speech.stop();
  }

  Future<void> cancelListening() async {
    await _speech.cancel();
  }
}
