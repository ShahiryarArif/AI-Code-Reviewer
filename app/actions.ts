"use server";

import type { ReviewActionState } from "@/lib/review-state";
import { type ReviewRequest, type ReviewResponse } from "@/lib/reviewer";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL ?? "openrouter/auto";

const reviewSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "score",
    "maintainability",
    "improvements",
    "positive",
    "nextTests",
  ],
  properties: {
    summary: {
      type: "string",
    },
    score: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    maintainability: {
      type: "string",
      enum: ["High", "Moderate", "Low"],
    },
    improvements: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "detail", "severity"],
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
          severity: {
            type: "string",
            enum: ["high", "medium", "low"],
          },
        },
      },
    },
    positive: {
      type: "string",
    },
    nextTests: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
} as const;

function extractOutputText(response: unknown) {
  if (!response || typeof response !== "object" || !("choices" in response)) {
    throw new Error("OpenRouter response did not include choices.");
  }

  const choices = (
    response as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    }
  ).choices;

  const text = choices?.[0]?.message?.content;
  if (typeof text === "string" && text.trim()) {
    return text;
  }

  throw new Error("OpenRouter response did not contain text output.");
}

function parseRequest(formData: FormData): ReviewRequest {
  return {
    code: String(formData.get("code") ?? ""),
    language: String(formData.get("language") ?? "TypeScript"),
    focus: String(formData.get("focus") ?? "Maintainability"),
  };
}

export async function reviewCodeAction(
  _previousState: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const request = parseRequest(formData);

  if (!process.env.OPENROUTER_API_KEY) {
    return {
      error: "OPENROUTER_API_KEY is missing in your .env file.",
      review: null,
    };
  }

  const userPrompt = `Review this ${request.language} code with a focus on ${request.focus}.

Return exactly:
- a short overall assessment
- exactly three improvements
- one positive note
- three suggested tests

Code:
\`\`\`
${request.code}
\`\`\`

Respond only with valid JSON matching the requested schema.`;

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a senior fullstack software engineer reviewing code before human review. Focus on readability, structure, maintainability, and testing risk. Keep the feedback specific, practical, and concise. Return only JSON.",
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "review_response",
            strict: true,
            schema: reviewSchema,
          },
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "OpenRouter request failed");
    }

    const payload = (await response.json()) as unknown;
    const text = extractOutputText(payload);
    const review = JSON.parse(text) as ReviewResponse;

    return {
      error: null,
      review,
    };
  } catch (error) {
    console.error("OpenRouter review error:", error);

    return {
      error: "Live model unavailable. Please check your API key and try again.",
      review: null,
    };
  }
}
