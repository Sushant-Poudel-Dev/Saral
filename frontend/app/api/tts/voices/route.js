import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    languages: [
      { code: "en", name: "English" },
      { code: "ne", name: "Nepali" },
      { code: "hi", name: "Hindi" },
      { code: "es", name: "Spanish" },
      { code: "fr", name: "French" },
      { code: "de", name: "German" },
      { code: "it", name: "Italian" },
      { code: "pt", name: "Portuguese" },
      { code: "ja", name: "Japanese" },
      { code: "ko", name: "Korean" },
      { code: "zh", name: "Chinese" },
      { code: "ar", name: "Arabic" },
      { code: "ru", name: "Russian" },
    ],
    accents: [
      { tld: "com", name: "US English", lang: "en" },
      { tld: "co.uk", name: "British English", lang: "en" },
      { tld: "ca", name: "Canadian English", lang: "en" },
      { tld: "co.in", name: "Indian English", lang: "en" },
      { tld: "com.au", name: "Australian English", lang: "en" },
      { tld: "co.za", name: "South African English", lang: "en" },
    ],
    speeds: [
      { value: false, name: "Normal Speed" },
      { value: true, name: "Slow Speed" },
    ],
  });
}
