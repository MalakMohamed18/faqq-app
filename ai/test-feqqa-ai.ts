import { runFeqqaAI } from "./faqqa-ai";

async function test() {
  const userMessage =
    "أنا بعت كام النهارده؟";

  console.log(" USER");


  console.log(userMessage);

  try {
    const result =
      await runFeqqaAI(userMessage);


    console.log(" FEQQA AI");


    console.dir(result, {
      depth: null,
    });


    console.log(" FINAL ANSWER");


    console.log(result.response);

  } catch (error) {
    console.error(
      "\n Pipeline Error:"
    );

    console.error(error);
  }
}

test();