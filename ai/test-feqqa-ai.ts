import { runFeqqaAI } from "./faqqa-ai";

async function test() {
  const userMessage =
    "أنا بعت كام النهارده؟";

  console.log("================================");
  console.log("👤 USER");
  console.log("================================");

  console.log(userMessage);

  try {
    const result =
      await runFeqqaAI(userMessage);

    console.log(
      "\n================================"
    );
    console.log("🤖 FEQQA AI");
    console.log(
      "================================"
    );

    console.dir(result, {
      depth: null,
    });

    console.log(
      "\n================================"
    );
    console.log("💬 FINAL ANSWER");
    console.log(
      "================================"
    );

    console.log(result.response);

  } catch (error) {
    console.error(
      "\n❌ Pipeline Error:"
    );

    console.error(error);
  }
}

test();