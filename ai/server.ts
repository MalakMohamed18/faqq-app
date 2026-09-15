import "dotenv/config";

import express from "express";
import cors from "cors";

import { runFeqqaAI } from "./faqqa-ai.js";

const app = express();

const PORT = Number(process.env.PORT ?? 4000);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "aivora-ai",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});


app.post("/ai/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required.",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authorization header.",
      });
    }

    const accessToken = authHeader.substring(7).trim();

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token is required.",
      });
    }

    console.log(" AI REQUEST");
    console.log("Message:", message);

    const result = await runFeqqaAI(
      message.trim(),
      accessToken,
    );

    return res.status(
      result.success === false ? 400 : 200,
    ).json(result);
  } catch (error) {
    console.error("\n❌ AI SERVER ERROR:");

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "حصل خطأ أثناء معالجة السؤال.",
    });
  }
});


app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "AI endpoint not found.",
  });
});


app.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("AIVORA AI API READY");
  console.log(`Port: ${PORT}`);
  console.log(` Health: http://localhost:${PORT}/health`);
  console.log(
    `Chat: http://localhost:${PORT}/ai/chat`,
  );
  console.log("");
});