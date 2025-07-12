// Test script to check gTTS functionality
const gTTS = require("gtts");

// Test different languages
const testCases = [
  { text: "Hello world", lang: "en" },
  { text: "नमस्ते संसार", lang: "ne" },
  { text: "नमस्ते संसार", lang: "hi" },
];

testCases.forEach(({ text, lang }, index) => {
  console.log(`\nTest ${index + 1}: Testing ${lang} with text: "${text}"`);

  try {
    const tts = new gTTS(text, lang, false);
    console.log(`✓ gTTS instance created successfully for ${lang}`);

    // Try to save to test file
    const filename = `test-${lang}-${index}.mp3`;
    tts.save(filename, (err) => {
      if (err) {
        console.error(`✗ Save failed for ${lang}:`, err.message);
      } else {
        console.log(`✓ Save successful for ${lang}: ${filename}`);
        // Clean up
        const fs = require("fs");
        try {
          fs.unlinkSync(filename);
          console.log(`✓ Cleanup successful for ${filename}`);
        } catch (cleanupErr) {
          console.log(`? Cleanup skipped for ${filename}`);
        }
      }
    });
  } catch (err) {
    console.error(`✗ gTTS creation failed for ${lang}:`, err.message);
  }
});
