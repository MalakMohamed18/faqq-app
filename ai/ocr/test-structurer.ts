import { structureInvoice } from "./invoice-structurer";

const ocrText = `
| do ee cof o
شراء
ديسمبر - 2024 - 08
0000001 رقم الفاتورة
2024-11-23 تاريخ الاصدار
فرح سعيد
123 Anywhere St., Any City
hello@reallygreatsite.com
123-456-7890

$15.00 $5.00 3 خبز عربي ابيض
$3.00 $3.00 1 خبز عربي اسمر
$115.00 $23.00 5 كرواسون بالشوكلاتة
$150.00 $25.00 6 كرواسون سادة
$400.00 $50.00 8 كيك بالفائيليا

$683.00 المبلغ الإجمالي:
$80.20 الضريبة:
$83.20 التحفيص:
$600.00 المستحق:
`;

async function test() {
  try {
    const invoice = await structureInvoice(ocrText);

    console.log("\n================ STRUCTURED INVOICE ================\n");

    console.dir(invoice, {
      depth: null,
    });

    console.log("\n=====================================================\n");
  } catch (error) {
    console.error("\n❌ Structuring Error:");
    console.error(error);
  }
}

test();