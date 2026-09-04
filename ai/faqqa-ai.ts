import { classifyIntent } from "./intent_classifier";
import { checkConfidence } from "./confidence-check";
import { routeTool } from "./tool-router";
import { executeTool } from "./tools/tool-excutor";
import { generateResponse } from "./response-generator";

export async function runFeqqaAI(
  userMessage: string
) {

  const intentResult =
    await classifyIntent(userMessage);

  const confidence =
    checkConfidence(intentResult);

  if (!confidence.approved) {
    return {
      success: false,
      message: confidence.message,
      intent: intentResult,
    };
  }

  const toolName =
    routeTool(intentResult);

  if (!toolName) {
    return {
      success: false,
      message: "مش قادر أحدد المطلوب من السؤال.",
      intent: intentResult,
    };
  }

  const toolData =
    await executeTool(
      toolName,
      intentResult
    );

  console.log("\n🛠️ TOOL DATA:");
  console.dir(toolData, { depth: null });

  const response =
    await generateResponse(
      userMessage,
      toolName,
      toolData
    );

  console.log("\n💬 GENERATED RESPONSE:");
  console.log(response);

  return {
    success: true,
    intent: intentResult,
    tool: toolName,
    data: toolData,
    response,
  };
}