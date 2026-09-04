import { classifyIntent } from "./intent_classifier";

async function test() {
  const userMessage =
    "أنا بعت كام النهارده؟";

  console.log("👤 User:");
  console.log(userMessage);

  try {
    const result =
      await classifyIntent(userMessage);

    console.log("\n🤖 Ollama Intent:");
    console.dir(result, {
      depth: null,
    });

  } catch (error) {
    console.error(
      "\n❌ Ollama Error:"
    );

    console.error(error);
  }
}

test();