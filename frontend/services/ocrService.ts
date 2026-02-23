const OCR_API_KEY = process.env.NEXT_PUBLIC_OCR_API_KEY ?? "";
const OCR_API_URL =
  process.env.NEXT_PUBLIC_OCR_API_URL ?? "https://api.ocr.space/parse/image";

export interface OCRResult {
  text: string;
  isError: boolean;
  errorMessage?: string;
}

export async function extractTextFromImage(file: File): Promise<OCRResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("apikey", OCR_API_KEY);
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");
  formData.append("detectOrientation", "true");
  formData.append("scale", "true");
  formData.append("OCREngine", "2");

  try {
    const response = await fetch(OCR_API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return {
        text: "",
        isError: true,
        errorMessage: `OCR API returned status ${response.status}`,
      };
    }

    const data = await response.json();

    if (data.IsErroredOnProcessing) {
      return {
        text: "",
        isError: true,
        errorMessage:
          data.ErrorMessage?.[0] ||
          "OCR processing failed. Try a clearer image.",
      };
    }

    const parsedResults = data.ParsedResults;
    if (!parsedResults || parsedResults.length === 0) {
      return {
        text: "",
        isError: true,
        errorMessage: "No text found in the image.",
      };
    }

    const extractedText = parsedResults
      .map((r: { ParsedText: string }) => r.ParsedText)
      .join("\n")
      .trim();

    if (!extractedText) {
      return {
        text: "",
        isError: true,
        errorMessage: "No readable text found in the image.",
      };
    }

    return { text: extractedText, isError: false };
  } catch (err) {
    return {
      text: "",
      isError: true,
      errorMessage:
        err instanceof Error ? err.message : "Failed to process image.",
    };
  }
}
