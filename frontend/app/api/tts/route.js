import { NextResponse } from "next/server";

async function createTTS(text, lang, slow) {
  const gTTS = (await import("gtts")).default;

  const langMap = {
    ne: "hi", // Nepali -> Hindi fallback
    en: "en",
    hi: "hi",
    es: "es",
    fr: "fr",
    de: "de",
    it: "it",
    pt: "pt",
  };

  const mappedLang = langMap[lang] || "en";

  console.log(
    `Mapping language "${lang}" to "${mappedLang}" ${
      lang === "ne" ? "(Hindi fallback for Nepali)" : ""
    }`
  );

  return new gTTS(text, mappedLang, slow);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");
    const lang = searchParams.get("lang") || "en";
    const slow = searchParams.get("slow") === "true";

    if (!text) {
      return NextResponse.json(
        { error: "Text parameter is required" },
        { status: 400 }
      );
    }

    const ttsInstance = await createTTS(text, lang, slow);

    // Stream the audio in-memory
    const chunks = [];
    return new Promise((resolve, reject) => {
      const stream = ttsInstance.stream();

      stream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      stream.on("end", () => {
        const audioBuffer = Buffer.concat(chunks);
        resolve(
          new NextResponse(audioBuffer, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Disposition": 'inline; filename="speech.mp3"',
            },
          })
        );
      });

      stream.on("error", (err) => {
        console.error("TTS stream error:", err);
        resolve(
          NextResponse.json(
            { error: "TTS stream generation failed" },
            { status: 500 }
          )
        );
      });
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
