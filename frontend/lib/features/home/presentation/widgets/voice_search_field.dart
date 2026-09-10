import 'package:faqqa/app/theme/app_colors.dart';
import 'package:flutter/material.dart';

import '../../../../core/services/speech_service.dart';

class VoiceSearchField extends StatefulWidget {
  const VoiceSearchField({super.key, this.onTextChanged});

  final ValueChanged<String>? onTextChanged;

  @override
  State<VoiceSearchField> createState() => _VoiceSearchFieldState();
}

class _VoiceSearchFieldState extends State<VoiceSearchField> {
  final _speechService = SpeechService();
  final _controller = TextEditingController();

  bool _isReady = false;
  bool _isListening = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _prepareSpeech();
  }

  Future<void> _prepareSpeech() async {
    final isAvailable = await _speechService.initialize(
      onStatus: (status) {
        if (!mounted) return;

        if (status == 'done' || status == 'notListening') {
          setState(() => _isListening = false);
        }
      },
      onError: (message) {
        if (!mounted) return;

        setState(() {
          _isListening = false;
          _errorMessage = 'تعذر تسجيل الصوت: $message';
        });
      },
    );

    if (!mounted) return;

    setState(() {
      _isReady = isAvailable;

      if (!isAvailable) {
        _errorMessage = 'التعرف على الصوت غير متاح على هذا الجهاز.';
      }
    });
  }

  Future<void> _onMicPressed() async {
    if (!_isReady) {
      await _prepareSpeech();
      return;
    }

    if (_isListening) {
      await _speechService.stopListening();

      if (mounted) {
        setState(() => _isListening = false);
      }

      return;
    }

    setState(() {
      _isListening = true;
      _errorMessage = null;
    });

    try {
      await _speechService.startListening(
        onResult: (text) {
          _controller.value = TextEditingValue(
            text: text,
            selection: TextSelection.collapsed(offset: text.length),
          );

          widget.onTextChanged?.call(text);
        },
      );
    } catch (_) {
      if (!mounted) return;

      setState(() {
        _isListening = false;
        _errorMessage = 'حصلت مشكلة أثناء تشغيل الميكروفون.';
      });
    }
  }

  @override
  void dispose() {
    _speechService.cancelListening();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        SizedBox(
          height: 56,
          child: TextField(
            controller: _controller,
            textAlign: TextAlign.right,
            onChanged: widget.onTextChanged,
            decoration: InputDecoration(
              hintText: _isListening
                  ? 'جاري الاستماع...'
                  : 'اسأل فكّة أو قول اللي حصل النهارده...',
              hintStyle: TextStyle(
                fontFamily: "Zain",
                color: Color(0xff6B7280),
                fontSize: 16,
                fontWeight: FontWeight(400),
              ),

              filled: true,
              fillColor: Color(0xffF3F4F6),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16),
              prefixIcon: IconButton(
                onPressed: _onMicPressed,
                icon: Icon(
                  _isListening
                      ? Icons.stop_circle_outlined
                      : Icons.mic_none_rounded,
                  color: _isListening ? Colors.red : const Color(0xFF7C4DFF),
                ),
              ),
              border: _border(),
              enabledBorder: _border(),
              focusedBorder: _border(
                color: _isListening ? Colors.red : AppColors.primary,
              ),
            ),
          ),
        ),

        if (_errorMessage != null) ...[
          // Text(
          //   _errorMessage!,
          //   style: const TextStyle(color: Colors.red, fontSize: 12),
          // ),
        ],
      ],
    );
  }

  OutlineInputBorder _border({Color color = const Color(0xffE5E7EB)}) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(16),
      borderSide: BorderSide(color: color),
    );
  }
}
