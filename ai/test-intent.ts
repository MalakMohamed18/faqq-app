import { mockLLMResponse } from "./mock-llm";
import { IntentSchema } from "./schemas/intent.schema";
import { checkConfidence } from "./confidence-check";
import { routeTool } from "./tool-router";
import { executeTool } from "./tools/tool-excutor";
import { mockGenerateResponse } from "./mock-response-generator";

async function test() {
  // =========================
  // 1. User Message
  // =========================

  const userMessage = "أنا بعت كام النهارده؟";

  console.log("👤 User:");
  console.log(userMessage);

  // =========================
  // 2. Intent Classification
  // =========================

  const llmResponse = mockLLMResponse(userMessage);

  // =========================
  // 3. Zod Validation
  // =========================

  const result = IntentSchema.safeParse(llmResponse);

  if (!result.success) {
    console.error("\n❌ Invalid AI response:");
    console.error(result.error);
    return;
  }

  console.log("\n🤖 Intent:");
  console.log(result.data.intent);

  // =========================
  // 4. Confidence Check
  // =========================

  const confidence = checkConfidence(result.data);

  console.log("\n🔎 Confidence:");
  console.log(confidence);

  if (!confidence.approved) {
    console.log("\n🛑 Request stopped.");
    return;
  }

  // =========================
  // 5. Tool Router
  // =========================

  const toolName = routeTool(result.data);

  console.log("\n🛠️ Selected Tool:");
  console.log(toolName);

  if (!toolName) {
    console.log("❌ No tool found.");
    return;
  }

  // =========================
  // 6. Tool Executor
  // =========================

  const toolData = await executeTool(
    toolName,
    result.data
  );

  console.log("\n📊 Verified Business Data:");
  console.log(toolData);

  // =========================
  // 7. Final AI Response
  // =========================

  const finalResponse = mockGenerateResponse(
    userMessage,
    toolName,
    toolData
  );

  console.log("\n💬 Final AI Response:");
  console.log(finalResponse);
}

test().catch((error) => {
  console.error("\n❌ Pipeline Error:");
  console.error(error);
});