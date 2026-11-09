import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[API /api/config] Successfully received configuration update:", {
      groomName: body?.groomName,
      brideName: body?.brideName,
      weddingDate: body?.weddingDate,
      galleryCount: body?.gallery?.length ?? 0,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Wedding site configuration saved successfully.",
        timestamp: new Date().toISOString(),
        config: body,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API /api/config] Error processing configuration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse configuration payload." },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      status: "online",
      endpoint: "/api/config",
      description: "Wedding site configuration endpoint.",
    },
    { status: 200 }
  );
}
