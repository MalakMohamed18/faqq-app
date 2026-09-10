import 'dart:io';

import 'package:faqqa/features/inventory/data/inventory_repository.dart';
import 'package:faqqa/features/inventory/widgets/product_saved_dialog.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:faqqa/features/inventory/models/inventory_models.dart';

class ProductFormScreen extends StatefulWidget {
  final InventoryRepository repository;
  final Product? product;

  const ProductFormScreen({super.key, this.product, required this.repository});

  bool get isEditing => product != null;

  @override
  State<ProductFormScreen> createState() => _ProductFormScreenState();
}

class _ProductFormScreenState extends State<ProductFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final ImagePicker _imagePicker = ImagePicker();

  XFile? _selectedImage;

  late final TextEditingController _nameController;
  late final TextEditingController _purchasePriceController;
  late final TextEditingController _quantityController;
  late final TextEditingController _codeController;
  late final TextEditingController _productTypeController;

  late String _category;
  DateTime? _expiryDate;

  final _categories = const [
    'مواد غذائية',
    'مشروبات',
    'ألبان',
    'منظفات',
    'أخرى',
  ];

  @override
  void initState() {
    super.initState();

    final product = widget.product;

    _nameController = TextEditingController(text: product?.name ?? '');

    _purchasePriceController = TextEditingController(
      text: product == null ? '' : product.purchasePrice.toString(),
    );

    _quantityController = TextEditingController(
      text: product == null ? '' : product.quantity.toString(),
    );

    _codeController = TextEditingController(text: product?.id ?? '');

    _productTypeController = TextEditingController(
      text: product?.productType ?? '',
    );

    _category = product?.category ?? _categories.first;
    _expiryDate = product?.expiryDate;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _purchasePriceController.dispose();
    _quantityController.dispose();
    _codeController.dispose();
    _productTypeController.dispose();
    super.dispose();
  }

  String get _expiryText {
    if (_expiryDate == null) {
      return 'اختر التاريخ';
    }

    return '${_expiryDate!.day}-${_expiryDate!.month}-${_expiryDate!.year}';
  }

  Future<void> _pickImage(ImageSource source) async {
    final image = await _imagePicker.pickImage(
      source: source,
      imageQuality: 80,
      maxWidth: 1200,
    );

    if (image != null && mounted) {
      setState(() {
        _selectedImage = image;
      });
    }
  }

  Future<void> _showImageSourceSheet() async {
    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      builder: (context) {
        return Directionality(
          textDirection: TextDirection.rtl,
          child: SafeArea(
            child: Wrap(
              children: [
                ListTile(
                  leading: const Icon(Icons.camera_alt_outlined),
                  title: const Text(
                    'التقاط صورة بالكاميرا',
                    style: TextStyle(fontFamily: 'Zain'),
                  ),
                  onTap: () {
                    Navigator.pop(context, ImageSource.camera);
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.photo_library_outlined),
                  title: const Text(
                    'اختيار من الاستديو',
                    style: TextStyle(fontFamily: 'Zain'),
                  ),
                  onTap: () {
                    Navigator.pop(context, ImageSource.gallery);
                  },
                ),
              ],
            ),
          ),
        );
      },
    );

    if (source != null) {
      await _pickImage(source);
    }
  }

  Future<void> _selectExpiryDate() async {
    final selectedDate = await showDatePicker(
      context: context,
      initialDate: _expiryDate ?? DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2040),
    );

    if (selectedDate != null) {
      setState(() {
        _expiryDate = selectedDate;
      });
    }
  }

  Future<void> _saveProduct() async {
    if (!_formKey.currentState!.validate()) return;

    final product = Product(
      id: _codeController.text.trim().isEmpty
          ? 'SKU-${DateTime.now().millisecondsSinceEpoch}'
          : _codeController.text.trim(),
      name: _nameController.text.trim(),
      imagePath: widget.product?.imagePath ?? 'assets/images/milk.png',
      localImagePath: _selectedImage?.path ?? widget.product?.localImagePath,
      quantity: int.tryParse(_quantityController.text.trim()) ?? 0,
      unit: widget.product?.unit ?? 'عبوة',
      minimumQuantity: widget.product?.minimumQuantity ?? 10,
      purchasePrice: double.tryParse(_purchasePriceController.text.trim()) ?? 0,
      sellingPrice: widget.product?.sellingPrice ?? 0,
      category: _category,
      productType: _productTypeController.text.trim(),
      expiryDate: _expiryDate,
    );
    final savedProduct = widget.isEditing
        ? await widget.repository.updateProduct(product)
        : await widget.repository.addProduct(product);

    if (!mounted) return;

    await showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) {
        return ProductSavedDialog(
          isEditing: widget.isEditing,
          onBackToList: () {
            Navigator.of(dialogContext).pop();
            Navigator.of(context).pop(savedProduct);
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.isEditing ? 'تعديل المنتج' : 'إضافة منتج';
    final buttonTitle = widget.isEditing ? 'حفظ التعديلات' : 'حفظ المنتج';

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: const Color(0xFFF8F9FB),
        body: SafeArea(
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                _Header(
                  title: title,
                  onBack: () => Navigator.of(context).pop(),
                ),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(20, 18, 20, 28),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _ImagePickerPlaceholder(
                          assetImagePath: widget.product?.imagePath,
                          localImagePath: widget.product?.localImagePath,
                          selectedImage: _selectedImage,
                          onTap: _showImageSourceSheet,
                        ),
                        const SizedBox(height: 20),

                        _InputField(
                          label: 'اسم المنتج',
                          controller: _nameController,
                          hint: 'اكتب اسم المنتج',
                          isRequired: true,
                        ),
                        _InputField(
                          label: 'سعر الشراء',
                          controller: _purchasePriceController,
                          hint: '00.00 ج.م',
                          keyboardType: const TextInputType.numberWithOptions(
                            decimal: true,
                          ),
                          isRequired: true,
                        ),
                        _InputField(
                          label: 'الكمية المتاحة',
                          controller: _quantityController,
                          hint: '0',
                          keyboardType: TextInputType.number,
                          isRequired: true,
                        ),
                        _InputField(
                          label: 'كود المنتج',
                          controller: _codeController,
                          hint: 'اكتب كود المنتج',
                        ),

                        const _FieldLabel(label: 'التصنيف', isRequired: true),
                        DropdownButtonFormField<String>(
                          value: _category,
                          decoration: _inputDecoration('اختر صنف المنتج'),
                          items: _categories.map((category) {
                            return DropdownMenuItem(
                              value: category,
                              child: Text(
                                category,
                                style: const TextStyle(fontFamily: 'Zain'),
                              ),
                            );
                          }).toList(),
                          onChanged: (value) {
                            if (value != null) {
                              setState(() {
                                _category = value;
                              });
                            }
                          },
                        ),
                        const SizedBox(height: 16),

                        const _FieldLabel(
                          label: 'تاريخ انتهاء الصلاحية',
                          isRequired: true,
                        ),
                        InkWell(
                          onTap: _selectExpiryDate,
                          borderRadius: BorderRadius.circular(12),
                          child: InputDecorator(
                            decoration: _inputDecoration('اختر التاريخ'),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.calendar_month_outlined,
                                  color: Color(0xFF344054),
                                ),
                                const SizedBox(width: 10),
                                Text(
                                  _expiryText,
                                  style: const TextStyle(
                                    color: Color(0xFF667085),
                                    fontFamily: 'Zain',
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        _InputField(
                          label: 'فئة المنتج',
                          controller: _productTypeController,
                          hint: 'مثال: منتجات ألبان',
                        ),
                      ],
                    ),
                  ),
                ),
                SafeArea(
                  top: false,
                  minimum: const EdgeInsets.fromLTRB(20, 10, 20, 16),
                  child: SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _saveProduct,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2E90FA),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: Text(
                        buttonTitle,
                        style: const TextStyle(
                          fontFamily: 'Zain',
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  final String title;
  final VoidCallback onBack;

  const _Header({required this.title, required this.onBack});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 62,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: Color(0xFF151D32),
              fontSize: 26,
              fontWeight: FontWeight.w700,
              fontFamily: 'Zain',
            ),
          ),
          Align(
            alignment: Alignment.centerRight,
            child: Material(
              color: Colors.white,
              shape: const CircleBorder(),
              child: InkWell(
                onTap: onBack,
                customBorder: const CircleBorder(),
                child: const SizedBox(
                  height: 52,
                  width: 52,
                  child: Icon(Icons.arrow_back_ios_new_rounded),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ImagePickerPlaceholder extends StatelessWidget {
  final String? assetImagePath;
  final String? localImagePath;
  final XFile? selectedImage;
  final VoidCallback onTap;

  const _ImagePickerPlaceholder({
    required this.assetImagePath,
    required this.localImagePath,
    required this.selectedImage,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    Widget imageWidget;

    if (selectedImage != null) {
      imageWidget = Image.file(File(selectedImage!.path), fit: BoxFit.contain);
    } else if (localImagePath != null) {
      imageWidget = Image.file(
        File(localImagePath!),
        fit: BoxFit.contain,
        errorBuilder: (_, __, ___) => const Icon(
          Icons.add_a_photo_outlined,
          color: Color(0xFF2E90FA),
          size: 32,
        ),
      );
    } else if (assetImagePath != null) {
      imageWidget = Image.asset(assetImagePath!, fit: BoxFit.contain);
    } else {
      imageWidget = const Icon(
        Icons.add_a_photo_outlined,
        color: Color(0xFF2E90FA),
        size: 32,
      );
    }

    return Center(
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            width: 122,
            height: 122,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFD0D5DD)),
            ),
            child: imageWidget,
          ),
        ),
      ),
    );
  }
}

class _FieldLabel extends StatelessWidget {
  final String label;
  final bool isRequired;

  const _FieldLabel({required this.label, this.isRequired = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 7),
      child: RichText(
        text: TextSpan(
          text: label,
          style: const TextStyle(
            color: Color(0xFF344054),
            fontSize: 15,
            fontWeight: FontWeight.w600,
            fontFamily: 'Zain',
          ),
          children: isRequired
              ? const [
                  TextSpan(
                    text: ' *',
                    style: TextStyle(color: Color(0xFFD92D20)),
                  ),
                ]
              : const [],
        ),
      ),
    );
  }
}

class _InputField extends StatelessWidget {
  final String label;
  final String hint;
  final TextEditingController controller;
  final TextInputType? keyboardType;
  final bool isRequired;

  const _InputField({
    required this.label,
    required this.hint,
    required this.controller,
    this.keyboardType,
    this.isRequired = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _FieldLabel(label: label, isRequired: isRequired),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          style: const TextStyle(color: Color(0xFF151D32), fontFamily: 'Zain'),
          validator: (value) {
            if (isRequired && (value == null || value.trim().isEmpty)) {
              return 'هذا الحقل مطلوب';
            }

            return null;
          },
          decoration: _inputDecoration(hint),
        ),
        const SizedBox(height: 16),
      ],
    );
  }
}

InputDecoration _inputDecoration(String hint) {
  return InputDecoration(
    hintText: hint,
    hintStyle: const TextStyle(color: Color(0xFF98A2B3), fontFamily: 'Zain'),
    filled: true,
    fillColor: Colors.white,
    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: Color(0xFFD0D5DD)),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: Color(0xFF2E90FA), width: 1.5),
    ),
  );
}
