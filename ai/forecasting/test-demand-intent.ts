import { classifyIntent } from "../intent_classifier";
import { checkConfidence } from "../confidence-check";
import { routeTool } from "../tool-router";
import { executeTool } from "../tools/tool-excutor";

async function main() {
  const question = "البيبسي هبيع منه كام الشهر الجاي؟";

  console.log("\n User:");
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

  console.log("\n Forecast:");
  console.dir(data, { depth: null });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});