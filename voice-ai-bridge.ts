import { runFeqqaAI } from "./ai/faqqa-ai";

const input = process.argv.slice(2).join(" ").trim();
const accessToken = process.env.FEQQA_ACCESS_TOKEN;

if (!input) {
  console.error("NO_INPUT");
  process.exit(1);
}

if (!accessToken) {
  console.error("NO_ACCESS_TOKEN");
  process.exit(1);
}

runFeqqaAI(input, accessToken)
  .then((result) => {
    console.log(
      JSON.stringify({
        text:
          typeof result === "string"
            ? result
            : result?.response ??
              result?.message ??
              "",
      })
    );
  })
  .catch((error) => {
    console.error(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : String(error),
      })
    );

    process.exit(1);
  });