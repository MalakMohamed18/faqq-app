import { classifyIntent } from "../../intent_classifier";
import { checkConfidence } from "../../confidence-check";
import { routeTool } from "../../tool-router";
import { executeTool } from "../../tools/tool-excutor";
import { generateResponse } from "../../response-generator";

async function main() {
  const question =
    "الفلوس اللي هتدخل وتخرج الأسبوع الجاي شكلها إيه؟";

  console.log("\n👤 User:");
  console.log(question);

  const intentResult = await classifyIntent(question);

  console.log("\n Intent:");
  console.dir(intentResult, { depth: null });

  const confidence = checkConfidence(intentResult);

  console.log("\n Confidence:");
  console.dir(confidence, { depth: null });

  if (!confidence.approved) {
    console.log(confidence.message);
    return;
  }

  const toolName = routeTool(intentResult);

  console.log("\n Tool:");
  console.log(toolName);

  if (!toolName) {
    throw new Error("No tool selected");
  }

  const data = await executeTool(
    toolName,
    intentResult
  );

  console.log("\n Cash Flow Forecast:");
  console.dir(data, { depth: null });

  const response = await generateResponse(
    question,
    toolName,
    data
  );

  console.log("\n Final Response:");
  console.log(response);
}

main().catch((error) => {
  console.error("\n Error:");
  console.error(error);
  process.exit(1);
});