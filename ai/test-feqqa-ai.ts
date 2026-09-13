import { runFeqqaAI } from "./faqqa-ai";

async function test() {
  const accessToken = process.env.FEQQA_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("FEQQA_ACCESS_TOKEN is missing");
  }

  const questions = [
    // Sales
    "أنا بعت كام النهارده؟",
    "مبيعاتي الأسبوع ده كام؟",
    "إيه أكتر منتج بعته الأسبوع ده؟",
    "إيه المنتجات اللي بعتها الأسبوع ده؟",

    // Inventory
    "إيه المنتجات اللي قربت تخلص؟",

    // Customers / Receivables
    "مين أكتر عميل عليه فلوس؟",
    "العملاء عليهم كام فلوس؟",

    // Expenses
    "مصروفاتي الشهر ده كام؟",
    "إيه أكتر مصروف عندي؟",

    // Business Insight
    "إيه وضع المحل عندي؟",
    "متوقع الكاش عندي يبقى كام الأسبوع الجاي؟",
"الكاش المتوقع الأسبوع الجاي كام؟",

// Demand Forecast
"متوقع أبيع كام من البيبسي الأسبوع الجاي؟",
  ];

  let passed = 0;
  let failed = 0;

  for (const userMessage of questions) {
    console.log("\n========================================");
    console.log("USER");
    console.log(userMessage);
    console.log("========================================");

    try {
      const result = await runFeqqaAI(
        userMessage,
        accessToken
      );

      console.log("\nINTENT:");
      console.log(result.intent.intent);

      console.log("\nTOOL:");
      console.log(result.tool);

      console.log("\nDATA:");
      console.dir(result.data, {
        depth: null,
      });

      console.log("\nFINAL ANSWER:");
      console.log(result.response);

      passed++;

      console.log("\nSTATUS: ✅ PASSED");
    } catch (error) {
      failed++;

      console.error("\nSTATUS: ❌ FAILED");
      console.error("\nPIPELINE ERROR:");

      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    }
  }

  console.log("\n========================================");
  console.log("FINAL TEST SUMMARY");
  console.log("========================================");

  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${questions.length}`);

  if (failed === 0) {
    console.log("\n🎉 ALL REAL-DATA TOOLS PASSED!");
    console.log("Feqqa is ready for the next integration step.");
  } else {
    console.log("\n⚠️ Some tools still need fixing.");
  }
}


test();
