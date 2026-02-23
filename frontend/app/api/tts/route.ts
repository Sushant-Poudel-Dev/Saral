import { NextRequest, NextResponse } from "next/server";

// Google Limit
const MAX_CHUNK_LENGTH = 200;

function chunkText(text: string, maxLen: number): string[] {
  const chunks: string[] = [];
  // Split on sentence boundaries first, then word boundaries
  const sentences = text.match(/[^.!?।]+[.!?।]?\s*/g) || [text];

  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length <= maxLen) {
      current += sentence;
    } else {
      if (current.trim()) chunks.push(current.trim());
      // If a single sentence exceeds maxLen, split on words
      if (sentence.length > maxLen) {
        const words = sentence.split(/\s+/);
        current = "";
        for (const word of words) {
          if ((current + " " + word).trim().length <= maxLen) {
            current = (current + " " + word).trim();
          } else {
            if (current.trim()) chunks.push(current.trim());
            current = word;
          }
        }
      } else {
        current = sentence;
      }
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function fetchTTSChunk(
  text: string,
  lang: string,
  slow: boolean,
): Promise<ArrayBuffer> {
  const params = new URLSearchParams({
    ie: "UTF-8",
    client: "tw-ob",
    tl: lang,
    q: text,
  });
  if (slow) params.set("ttsspeed", "0.24");

  const url = `https://translate.google.com/translate_tts?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://translate.google.com/",
    },
  });

  if (!res.ok) {
    throw new Error(`Google TTS returned ${res.status}`);
  }

  return res.arrayBuffer();
}

function concatArrayBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
  const totalLength = buffers.reduce((acc, buf) => acc + buf.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of buffers) {
    result.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }
  return result.buffer;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text");
  const lang = searchParams.get("lang") || "en";
  const slow = searchParams.get("slow") === "true";

  if (!text || !text.trim()) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  try {
    const chunks = chunkText(text, MAX_CHUNK_LENGTH);
    const audioBuffers: ArrayBuffer[] = [];

    for (const chunk of chunks) {
      const buf = await fetchTTSChunk(chunk, lang, slow);
      audioBuffers.push(buf);
    }

    const combined = concatArrayBuffers(audioBuffers);

    return new Response(combined, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="saral-audio.mp3"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("TTS error:", err);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 },
    );
  }
}
