import 'dart:math' as math;

import 'package:faqqa/app/theme/app_colors.dart';
import 'package:flutter/material.dart';

class AuthDropdownField extends StatefulWidget {
  const AuthDropdownField({
    super.key,
    required this.label,
    required this.hint,
    required this.items,
    required this.value,
    required this.onChanged,
    this.errorText,
    this.prefixIcon,
  });

  final String label;
  final String hint;
  final List<String> items;
  final String? value;
  final ValueChanged<String?> onChanged;
  final String? errorText;
  final IconData? prefixIcon;

  @override
  State<AuthDropdownField> createState() => _AuthDropdownFieldState();
}

class _AuthDropdownFieldState extends State<AuthDropdownField> {
  final LayerLink _layerLink = LayerLink();
  final GlobalKey _fieldKey = GlobalKey();

  OverlayEntry? _overlayEntry;
  bool _isOpen = false;
  double _fieldWidth = 0;

  void _openList() {
    if (_isOpen) return;

    final renderBox = _fieldKey.currentContext!.findRenderObject() as RenderBox;

    _fieldWidth = renderBox.size.width;

    setState(() => _isOpen = true);

    _overlayEntry = OverlayEntry(
      builder: (context) {
        return Stack(
          children: [
            const Positioned.fill(
              child: ModalBarrier(
                color: Colors.transparent,
                dismissible: false,
              ),
            ),

            CompositedTransformFollower(
              link: _layerLink,
              targetAnchor: Alignment.bottomCenter,
              followerAnchor: Alignment.topCenter,
              offset: const Offset(0, 16),
              child: Material(
                color: Colors.transparent,
                child: SizedBox(width: _fieldWidth, child: _optionsList()),
              ),
            ),
          ],
        );
      },
    );

    Overlay.of(context, rootOverlay: true).insert(_overlayEntry!);
  }

  void _closeList() {
    _overlayEntry?.remove();
    _overlayEntry = null;

    if (mounted) {
      setState(() => _isOpen = false);
    }
  }

  void _selectItem(String item) {
    widget.onChanged(item);
    _closeList();
  }

  Widget _optionsList() {
    final maxHeight = MediaQuery.sizeOf(context).height * 0.62;
    final wantedHeight = widget.items.length * 74.0;
    final listHeight = math.min(wantedHeight, maxHeight);

    return Container(
      height: listHeight,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: const [
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 14,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: ListView.separated(
          physics: const BouncingScrollPhysics(),
          padding: EdgeInsets.zero,
          itemCount: widget.items.length,
          separatorBuilder: (_, _) {
            return const Divider(height: 1, color: Color(0xFFE7EAF0));
          },
          itemBuilder: (context, index) {
            final item = widget.items[index];
            final isSelected = item == widget.value;

            return InkWell(
              onTap: () => _selectItem(item),
              child: SizedBox(
                height: 74,
                child: Center(
                  child: Text(
                    item,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: isSelected
                          ? AppColors.primary
                          : AppColors.textPrimary,
                      fontSize: 17,
                      fontWeight: isSelected
                          ? FontWeight.w700
                          : FontWeight.w500,
                      fontFamily: "Zain",
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  @override
  void dispose() {
    _overlayEntry?.remove();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final borderColor = _isOpen ? AppColors.primary : AppColors.border;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      textDirection: TextDirection.rtl,
      children: [
        Text(
          textDirection: TextDirection.rtl,
          textAlign: TextAlign.right,
          widget.label,
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 16,
            fontWeight: FontWeight.bold,
            fontFamily: "Zain",
          ),
        ),
        const SizedBox(height: 8),

        CompositedTransformTarget(
          link: _layerLink,
          child: SizedBox(
            key: _fieldKey,
            child: InkWell(
              onTap: _openList,
              borderRadius: BorderRadius.circular(16),
              child: Container(
                height: 60,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: borderColor,
                    width: _isOpen ? 2 : 1.5,
                  ),
                ),
                child: Stack(
                  alignment: Alignment.centerRight,
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 40),
                      child: Text(
                        widget.value ?? widget.hint,
                        textAlign: TextAlign.right,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: widget.value == null
                              ? AppColors.textSecondary
                              : AppColors.textPrimary,
                          fontSize: 17,
                          fontWeight: FontWeight.w600,
                          fontFamily: "Zain",
                        ),
                      ),
                    ),
                    Positioned(
                      left: 16,
                      child: Icon(
                        _isOpen
                            ? Icons.keyboard_arrow_up_rounded
                            : Icons.keyboard_arrow_down_rounded,
                        size: 30,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    if (widget.prefixIcon != null)
                      Positioned(
                        right: 16,
                        child: Icon(
                          widget.prefixIcon,
                          color: AppColors.textSecondary,
                          size: 28,
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
        ),

        if (widget.errorText != null) ...[
          const SizedBox(height: 6),
          Text(
            widget.errorText!,
            style: const TextStyle(color: Colors.red, fontSize: 13),
          ),
        ],
      ],
    );
  }
}
