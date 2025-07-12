import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

// Dynamic import for gTTS
async function createTTS(text, lang, slow) {
  const gTTS = (await import("gtts")).default;

  // Map language codes to gTTS supported codes
  // Note: gTTS doesn't actually support Nepali (ne), so we use Hindi (hi) as fallback
  const langMap = {
    ne: "hi", // Nepali -> Hindi fallback (same script, similar pronunciation)
    en: "en", // English
    hi: "hi", // Hindi
    es: "es", // Spanish
    fr: "fr", // French
    de: "de", // German
    it: "it", // Italian
    pt: "pt", // Portuguese
  };

  const mappedLang = langMap[lang] || "en";
  console.log(
    `Mapping language "${lang}" to "${mappedLang}" ${
      lang === "ne" ? "(Hindi fallback for Nepali)" : ""
    }`
  );

  // Test if this is a problematic character set
  console.log(`Creating TTS for text: "${text}" with length: ${text.length}`);

  try {
    return new gTTS(text, mappedLang, slow);
  } catch (createError) {
    console.error("Error creating gTTS instance:", createError);
    throw new Error(`Failed to create TTS instance: ${createError.message}`);
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");
    const lang = searchParams.get("lang") || "en";
    const slow = searchParams.get("slow") === "true";

    console.log(
      `TTS API called with: text="${text}", lang="${lang}", slow=${slow}`
    );

    if (!text) {
      return NextResponse.json(
        { error: "Text parameter is required" },
        { status: 400 }
      );
    }

    // Create a temporary file
    const filename = `${uuidv4()}.mp3`;
    const tempDir = path.join(process.cwd(), "temp");

    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filePath = path.join(tempDir, filename);

    console.log(
      `Creating gTTS instance with text: "${text}", lang: "${lang}", slow: ${slow}`
    );

    // Generate TTS - using dynamic import
    let ttsInstance;
    try {
      ttsInstance = await createTTS(text, lang, slow);
      console.log("gTTS instance created successfully");
    } catch (createErr) {
      console.error("Failed to create gTTS instance:", createErr);
      return NextResponse.json(
        { error: `TTS creation failed: ${createErr.message}` },
        { status: 500 }
      );
    }

    return new Promise((resolve, reject) => {
      console.log(`Attempting to save TTS file to: ${filePath}`);

      ttsInstance.save(filePath, (err) => {
        if (err) {
          console.error("TTS Save Error:", err);
          console.error("Error details:", err.message || err);
          resolve(
            NextResponse.json(
              { error: `TTS generation failed: ${err.message || err}` },
              { status: 500 }
            )
          );
          return;
        }

        console.log("TTS file saved successfully");

        try {
          // Read the file and return as audio response
          const audioBuffer = fs.readFileSync(filePath);

          // Clean up the temp file
          fs.unlinkSync(filePath);

          // Return audio response
          resolve(
            new NextResponse(audioBuffer, {
              headers: {
                "Content-Type": "audio/mpeg",
                "Content-Disposition": 'inline; filename="speech.mp3"',
              },
            })
          );
        } catch (fileErr) {
          console.error("File Error:", fileErr);
          resolve(
            NextResponse.json(
              { error: "File processing failed" },
              { status: 500 }
            )
          );
        }
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
