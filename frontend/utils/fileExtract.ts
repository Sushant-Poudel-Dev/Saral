import { extractTextFromImage } from "@/services/ocrService";

async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .filter((item) => "str" in item)
      .map((item) => (item as { str: string }).str);
    pages.push(strings.join(" "));
  }

  return pages.join("\n\n");
}

async function extractTextFromDOCX(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractTextFromDocument(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (file.type === "text/plain" || name.endsWith(".txt")) {
    return file.text();
  }

  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    return extractTextFromPDF(file);
  }

  if (
    name.endsWith(".docx") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractTextFromDOCX(file);
  }

  if (name.endsWith(".doc") || file.type === "application/msword") {
    throw new Error(
      "Legacy .doc format is not supported. Please convert to .docx or .txt.",
    );
  }

  throw new Error(`Unsupported file type: ${file.name}`);
}

function isImageFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    file.type.startsWith("image/") ||
    /\.(png|jpe?g|bmp|gif|tiff?)$/i.test(name)
  );
}

/** Extract text from a document or image file (OCR for images). */
export async function extractTextFromFile(file: File): Promise<string> {
  if (isImageFile(file)) {
    const result = await extractTextFromImage(file);
    if (result.isError) {
      throw new Error(result.errorMessage || "Failed to extract text from image.");
    }
    return result.text;
  }

  return extractTextFromDocument(file);
}

export const OPEN_FILE_ACCEPT =
  ".txt,.pdf,.docx,image/png,image/jpeg,image/bmp,image/gif,image/tiff";
