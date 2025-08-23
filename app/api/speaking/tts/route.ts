import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // ElevenLabs voice ID - Rachel (professional female voice)
    // You can change this to any voice ID from ElevenLabs
    const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel

    // Alternative voice options:
    // const voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Bella
    // const voiceId = 'ErXwobaYiN019PkySvjV'; // Antoni
    // const voiceId = 'MF3mGyEYCl7XYWbV9V6O'; // Elli

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1", // Standard model
          voice_settings: {
            stability: 0.5, // 0.0 to 1.0 - lower = more variable
            similarity_boost: 0.5, // 0.0 to 1.0 - higher = more similar to original
            style: 0.0, // 0.0 to 1.0 - style exaggeration
            use_speaker_boost: true, // Boost speaker similarity
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);

      // Handle specific error cases
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid ElevenLabs API key" },
          { status: 401 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              "Rate limit exceeded. You may have reached your monthly quota.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: "Failed to generate audio" },
        { status: response.status }
      );
    }

    // Get audio buffer from response
    const audioBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: unknown) {
    // Change `error: any` to `error: unknown`
    console.error("ElevenLabs TTS API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
