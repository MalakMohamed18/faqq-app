import { runFeqqaAI } from "./faqqa-ai";

const TEST_CASES = [
  {
    name: "Today's Sales",
    question: "أنا بعت كام النهارده؟",
  },

  {
    name: "Weekly Sales",
    question: "مبيعاتي الأسبوع ده كام؟",
  },

  {
    name: "Top Product",
    question: "إيه أكتر منتج اتباع؟",
  },

  {
    name: "Weekly Products",
    question: "إيه المنتجات اللي بعتها الأسبوع ده؟",
  },

  {
    name: "Low Stock",
    question: "إيه المنتجات اللي قربت تخلص؟",
  },

  {
    name: "Top Receivable",
    question: "مين عليه أكبر مبلغ؟",
  },

  {
    name: "Receivables",
    question: "مين العملاء اللي عليهم فلوس؟",
  },

  {
    name: "Monthly Expenses",
    question: "مصاريفي الشهر ده كام؟",
  },

  {
    name: "Top Expense",
    question: "إيه أكتر مصروف عندي؟",
  },

  {
    name: "Business Insight",
    question: "عامل إيه في شغلي؟",
  },
];

async function runTests() {
  console.log(" FEQQA AI - INTENT TESTS");


  let passed = 0;
  let failed = 0;

  for (const test of TEST_CASES) {
    console.log(` ${test.name}`);
    console.log(` ${test.question}`);

    try {
      const result = await runFeqqaAI(
        test.question
      );

      if (!result.success) {
        console.log("FAILED");
        console.log(
          "Reason:",
          result.message
        );

        failed++;
        continue;
      }

      console.log(
        " Intent:",
        result.intent.intent
      );

      console.log(
        " Confidence:",
        result.intent.confidence
      );

      console.log(
        " Tool:",
        result.tool
      );

      console.log(
        " Data:",
        result.data
      );

      console.log(
        " Response:",
        result.response
      );

      passed++;

    } catch (error) {
      console.log(" ERROR");

      console.error(error);

      failed++;
    }
  }

  console.log(" TEST SUMMARY");


  console.log(` Passed: ${passed}`);
  console.log(` Failed: ${failed}`);
  console.log(
    ` Total: ${TEST_CASES.length}`
  );

}

runTests();