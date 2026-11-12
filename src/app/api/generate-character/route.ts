import { NextResponse } from "next/server";

export const maxDuration = 60;

const INSTANT_ID_VERSION =
  "6423023020ceb24c1619623dcbd2049e2954a7428f73117dd64beebffed80524";

function extractOutputUrl(output: unknown): string | null {
  const first = Array.isArray(output) ? output[0] : output;
  if (!first || typeof first !== "string") return null;
  return first.startsWith("http") ? first : null;
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

    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait=55",
      },
      body: JSON.stringify({
        version: INSTANT_ID_VERSION,
        input: {
          image: sourceImageUrl,
          prompt,
          negative_prompt: "ugly, deformed, blurry",
        },
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      return NextResponse.json(
        {
          success: false,
          error: `Replicate API error (${createRes.status}): ${errText}`,
        },
        { status: 502 }
      );
    }

    let prediction = (await createRes.json()) as {
      status?: string;
      output?: unknown;
      error?: string;
      urls?: { get?: string };
    };

    let attempts = 0;
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed" &&
      prediction.status !== "canceled" &&
      prediction.urls?.get &&
      attempts < 20
    ) {
      attempts += 1;
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const pollRes = await fetch(prediction.urls.get, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!pollRes.ok) break;
      prediction = (await pollRes.json()) as typeof prediction;
    }

    if (prediction.status !== "succeeded") {
      return NextResponse.json(
        {
          success: false,
          error:
            prediction.error ||
            `Character generation ended with status: ${prediction.status || "unknown"}`,
        },
        { status: 502 }
      );
    }

    const imageUrl = extractOutputUrl(prediction.output);
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
