from fastapi import APIRouter, Query
from fastapi.responses import FileResponse
from gtts import gTTS
import uuid
import os

router = APIRouter(prefix="/tts", tags=["Text to Speech"])

@router.get("/")
def generate_tts(
    text: str = Query(..., description="Text to convert to speech"),
    lang: str = Query("en", description="Language code (en, es, fr, de, it, ja, ko, etc.)"),
    slow: bool = Query(False, description="Slow speech rate"),
    tld: str = Query("com", description="Top-level domain for accent (com=US, co.uk=British, ca=Canadian, co.in=Indian, com.au=Australian)")
):
    filename = f"{uuid.uuid4()}.mp3"
    
    try:
        tts = gTTS(
            text=text, 
            lang=lang, 
            slow=slow,
            tld=tld  # This affects accent: com=US, co.uk=British, ca=Canadian, etc.
        )
        tts.save(filename)

        def cleanup():
            try:
                if os.path.exists(filename):
                    os.remove(filename)
            except Exception as e:
                print(f"Error cleaning up file {filename}: {e}")

        return FileResponse(
            filename,
            media_type="audio/mpeg",
            filename="speech.mp3",
            background=cleanup
        )
    except Exception as e:
        return {"error": f"TTS generation failed: {str(e)}"}

@router.get("/voices")
def get_available_voices():
    """Get list of available voice options"""
    return {
        "languages": [
            {"code": "en", "name": "English"},
            {"code": "es", "name": "Spanish"},
            {"code": "fr", "name": "French"},
            {"code": "de", "name": "German"},
            {"code": "it", "name": "Italian"},
            {"code": "pt", "name": "Portuguese"},
            {"code": "ja", "name": "Japanese"},
            {"code": "ko", "name": "Korean"},
            {"code": "zh", "name": "Chinese"},
            {"code": "hi", "name": "Hindi"},
            {"code": "ar", "name": "Arabic"},
            {"code": "ru", "name": "Russian"}
        ],
        "accents": [
            {"tld": "com", "name": "US English", "lang": "en"},
            {"tld": "co.uk", "name": "British English", "lang": "en"},
            {"tld": "ca", "name": "Canadian English", "lang": "en"},
            {"tld": "co.in", "name": "Indian English", "lang": "en"},
            {"tld": "com.au", "name": "Australian English", "lang": "en"},
            {"tld": "co.za", "name": "South African English", "lang": "en"}
        ],
        "speeds": [
            {"value": False, "name": "Normal Speed"},
            {"value": True, "name": "Slow Speed"}
        ]
    }
