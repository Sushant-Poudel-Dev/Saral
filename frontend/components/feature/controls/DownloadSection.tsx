"use client";

interface DownloadSectionProps {
  text: string;
  lineHeight?: number;
  letterSpacing?: number;
  fontSize?: number;
  fontFamily?: string;
  backgroundColor?: string;
  backgroundTexture?: string;
  colorCodedLetters?: string[];
}

const colorMap: Record<string, string> = {
  bd: "#e53e3e",
  pq: "#3182ce",
  mw: "#d69e2e",
  nu: "#38a169",
  sz: "#805ad5",
  ao: "#dd6b20",
  bpdq: "#d53f8c",
  hn: "#718096",
  tf: "#2b6cb0",
  rn: "#9f7aea",
  gq: "#ed8936",
  vy: "#319795",
  ilj: "#dd6b20",
  xk: "#ed64a6",
  ceo: "#2c7a7b",
  vuw: "#68d391",
  "dev-bv": "#dd6b20",
  "dev-np": "#3182ce",
  "dev-ghd": "#805ad5",
  "dev-nda": "#38a169",
  "dev-np2": "#d69e2e",
  "dev-gg": "#9f7aea",
  "dev-dhb": "#2b6cb0",
  "dev-dhd": "#d53f8c",
  "dev-pb": "#dd6b20",
  "dev-pp": "#805ad5",
  "dev-cc": "#38a169",
  "dev-cj": "#319795",
  "dev-tt": "#718096",
  "dev-cj2": "#ed8936",
  "dev-kk": "#d53f8c",
  "dev-kg": "#68d391",
  "dev-ss": "#9f7aea",
  "dev-ss2": "#2c7a7b",
  "dev-dd": "#dd6b20",
  "dev-yg": "#3182ce",
  "dev-jj": "#805ad5",
  "dev-ng": "#38a169",
  "dev-rn": "#9f7aea",
  "dev-nm": "#2b6cb0",
  "dev-ms": "#d53f8c",
  "dev-v-ii": "#d69e2e",
  "dev-v-uu": "#319795",
  "dev-v-oo": "#805ad5",
  "dev-v-ee": "#ed8936",
  "dev-v-ri": "#38a169",
  "dev-v-aha": "#dd6b20",
  "dev-v-aa": "#2b6cb0",
};

function escapeHtml(unsafe: string): string {
  return unsafe.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#039;";
      default:
        return m;
    }
  });
}

function getColoredHTML(text: string, selectedCodes: string[]): string {
  let escapedText = escapeHtml(text);
  const sorted = [...selectedCodes].sort((a, b) => b.length - a.length);

  sorted.forEach((code) => {
    const color = colorMap[code] || "black";
    const letters = code.startsWith("dev-") ? code.slice(4) : code;

    if (letters.includes("-")) {
      const substring = letters.replace(/-/g, "");
      escapedText = escapedText.replace(
        new RegExp(substring, "gi"),
        (match) =>
          `<span style="color:${color}; font-weight:600;">${match}</span>`,
      );
    } else {
      escapedText = escapedText.replace(
        new RegExp(`[${letters}]`, "gi"),
        (match) =>
          `<span style="color:${color}; font-weight:600;">${match}</span>`,
      );
    }
  });

  return escapedText.replace(/\n/g, "<br>");
}

export default function DownloadSection({
  text,
  lineHeight = 1.5,
  letterSpacing = 0,
  fontSize = 16,
  fontFamily = "sans-serif",
  backgroundColor = "#ffffff",
  backgroundTexture = "",
  colorCodedLetters = [],
}: DownloadSectionProps) {
  const downloadStyledHTML = () => {
    const style = `
  body {
    white-space: pre-wrap;
    line-height: ${lineHeight};
    letter-spacing: ${letterSpacing}em;
    font-size: ${fontSize}px;
    font-family: ${fontFamily};
    background-color: ${backgroundColor};
    background-image: ${backgroundTexture && backgroundTexture !== "" ? `url('${backgroundTexture}')` : "none"};
    background-repeat: repeat;
    background-position: 0 0;
    background-size: 10px ${fontSize * lineHeight}px;
    padding: 20px;
  }`;

    const coloredHTML = getColoredHTML(text, colorCodedLetters);
    const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Colored & Styled Text</title>
    <style>${style}</style>
  </head>
  <body>${coloredHTML}</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "colored-styled-text.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Expose download function for parent — render null
  void downloadStyledHTML;
  return null;
}
