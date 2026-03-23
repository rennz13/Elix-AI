import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const RAW_ORIGINS = process.env.ALLOWED_ORIGINS || "";
const ALLOWED_ORIGINS = RAW_ORIGINS
  ? RAW_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server calls (no origin header) only in development
      if (!origin) {
        if (process.env.NODE_ENV !== "production") return callback(null, true);
        return callback(new Error("No origin"), false);
      }
      if (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin '${origin}' not allowed`), false);
    },
    optionsSuccessStatus: 200,
  })
);

// ── Rate limiting (in-memory, resets on server restart) ───────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20;           // requests per window per IP
const rateLimitMap = new Map();

function rateLimit(req, res, next) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return next();
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: "Too many requests. Please slow down." });
  }
  next();
}

app.use(express.json({ limit: "15mb" }));

const { OPENROUTER_API_KEY, PORT = 3001, OPENROUTER_VISION_MODEL } = process.env;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_FALLBACKS = [
  "mistralai/mistral-7b-instruct",
  "deepseek/deepseek-chat",
];
const VISION_MODEL =
  OPENROUTER_VISION_MODEL || "google/gemini-2.0-flash-exp:free";
const UNAVAILABLE_MESSAGE = "⚠️ AI is currently unavailable. Please try again.";

const ASSISTANT_SYSTEM_MESSAGE =
  "You are a helpful assistant. Answer in clear GitHub-flavored Markdown: use ## or ### for section titles, put a blank line between sections, use bullet lists (- item) for lists, and **bold** for emphasis. Never cram headings and list items into a single run-on line; use normal line breaks so the structure is readable.";

if (!OPENROUTER_API_KEY) {
  console.error("Missing OPENROUTER_API_KEY in environment variables.");
  process.exit(1);
}

app.get("/", (_req, res) => {
  res.send("Elix AI backend is running");
});

function isTokenOrCreditError(message) {
  const normalized = String(message || "").toLowerCase();
  return normalized.includes("max_tokens") || normalized.includes("credits");
}

function buildUserContent(text, imageBase64, imageMimeType) {
  if (imageBase64 && imageMimeType) {
    const t = (text && String(text).trim()) || "What is in this image?";
    return [
      { type: "text", text: t },
      {
        type: "image_url",
        image_url: {
          url: `data:${imageMimeType};base64,${imageBase64}`,
        },
      },
    ];
  }
  return text;
}

async function requestModelResponse(model, prompt, imageBase64, imageMimeType) {
  const userContent = buildUserContent(prompt, imageBase64, imageMimeType);
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: ASSISTANT_SYSTEM_MESSAGE },
        { role: "user", content: userContent },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const backendMessage =
      data?.error?.message ||
      data?.error ||
      `OpenRouter request failed for ${model}.`;
    throw new Error(backendMessage);
  }

  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error(`Empty response returned by model: ${model}`);
  }
  return text;
}

async function getAIResponse(prompt, imageBase64, imageMimeType) {
  if (imageBase64 && imageMimeType) {
    try {
      console.log(`Vision request model: ${VISION_MODEL}`);
      return await requestModelResponse(
        VISION_MODEL,
        prompt,
        imageBase64,
        imageMimeType,
      );
    } catch (error) {
      const message = error?.message || "Vision model error.";
      console.error(`Vision model failed (${VISION_MODEL}):`, message);
      throw error;
    }
  }

  let lastError;

  for (const model of MODEL_FALLBACKS) {
    try {
      console.log(`Trying model: ${model}`);
      return await requestModelResponse(model, prompt, null, null);
    } catch (error) {
      lastError = error;
      const message = error?.message || "Unknown model error.";
      console.error(`Model failed (${model}):`, message);
    }
  }

  throw lastError || new Error(UNAVAILABLE_MESSAGE);
}

const MAX_PROMPT_LENGTH = 4000;

app.post("/api/chat", rateLimit, async (req, res) => {
  try {
    const { prompt, imageBase64, imageMimeType } = req.body;
    const cleanedPrompt = typeof prompt === "string" ? prompt.trim() : "";
    const hasImage =
      typeof imageBase64 === "string" &&
      imageBase64.length > 0 &&
      typeof imageMimeType === "string" &&
      imageMimeType.startsWith("image/");

    if (!cleanedPrompt && !hasImage) {
      return res.status(400).json({ error: "Prompt or image is required." });
    }

    if (cleanedPrompt.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({ error: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer.` });
    }

    const text = await getAIResponse(
      cleanedPrompt,
      hasImage ? imageBase64 : null,
      hasImage ? imageMimeType : null,
    );

    res.json({
      reply: text,
    });
  } catch (error) {
    const statusCode =
      error?.status ||
      error?.code ||
      error?.response?.status ||
      500;
    const rawMessage =
      error?.message ||
      error?.error?.message ||
      "Failed to generate response.";
    const normalizedMessage = String(rawMessage);
    const isQuotaError =
      statusCode === 429 ||
      normalizedMessage.includes("RESOURCE_EXHAUSTED") ||
      normalizedMessage.includes("quota");

    if (isQuotaError) {
      console.error("OpenRouter quota error after fallbacks:", normalizedMessage);
      return res.status(503).json({ error: UNAVAILABLE_MESSAGE });
    }
    if (isTokenOrCreditError(normalizedMessage)) {
      console.error("OpenRouter token/credit error after fallbacks:", normalizedMessage);
      return res.status(503).json({ error: UNAVAILABLE_MESSAGE });
    }

    console.error("OpenRouter API request failed after fallbacks:", normalizedMessage);
    return res.status(503).json({ error: UNAVAILABLE_MESSAGE });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
