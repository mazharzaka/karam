import { NextResponse } from "next/server";
import Replicate from "replicate";

export const maxDuration = 60;

const INSTANT_ID_MODEL =
  "zsxkib/instant-id:6423023020ceb24c1619623dcbd2049e2954a7428f73117dd64beebffed80524" as const;

function extractOutputUrl(output: unknown): string | null {
  const first = Array.isArray(output) ? output[0] : output;
  if (!first) return null;
  if (typeof first === "string") return first;
  if (
    typeof first === "object" &&
    "url" in first &&
    typeof (first as { url: () => URL | string }).url === "function"
  ) {
    return String((first as { url: () => URL | string }).url());
  }
  const asString = String(first);
  return asString.startsWith("http") ? asString : null;
}

export async function POST(request: Request) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error:
            "REPLICATE_API_TOKEN is not configured in your environment variables (.env).",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as {
      sourceImageUrl?: string;
      prompt?: string;
    };

    const sourceImageUrl = body?.sourceImageUrl?.trim();
    const prompt = body?.prompt?.trim();

    if (!sourceImageUrl || !prompt) {
      return NextResponse.json(
        {
          success: false,
          error: "Both sourceImageUrl and prompt are required.",
        },
        { status: 400 }
      );
    }

    const replicate = new Replicate({
      auth: token,
      useFileOutput: false,
    });

    const output = await replicate.run(INSTANT_ID_MODEL, {
      input: {
        image: sourceImageUrl,
        prompt,
        negative_prompt: "ugly, deformed, blurry",
      },
    });

    const imageUrl = extractOutputUrl(output);
    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Replicate did not return a valid image URL.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        imageUrl,
        url: imageUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API /api/generate-character] Error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate character via Replicate.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

