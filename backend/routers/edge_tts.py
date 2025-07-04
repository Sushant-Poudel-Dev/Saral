from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import edge_tts
import asyncio
import io
import logging
from typing import List, Dict

router = APIRouter(prefix="/edge-tts", tags=["edge-tts"])

logger = logging.getLogger(__name__)

class EdgeTTSRequest(BaseModel):
    text: str
    voice: str = "en-US-AriaNeural"
    rate: str = "+0%"
    pitch: str = "+0Hz"

class VoiceInfo(BaseModel):
    name: str
    short_name: str
    gender: str
    locale: str
    suggested_codec: str
    friendly_name: str
    status: str

@router.get("/voices", response_model=List[VoiceInfo])
async def get_voices():
    """Get all available Edge-TTS voices"""
    try:
        voices = await edge_tts.list_voices()
        voice_list = []
        
        for voice in voices:
            voice_info = VoiceInfo(
                name=voice["Name"],
                short_name=voice["ShortName"],
                gender=voice["Gender"],
                locale=voice["Locale"],
                suggested_codec=voice["SuggestedCodec"],
                friendly_name=voice["FriendlyName"],
                status=voice["Status"]
            )
            voice_list.append(voice_info)
        
        return voice_list
    except Exception as e:
        logger.error(f"Error fetching voices: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch voices: {str(e)}")

@router.post("/speak")
async def speak_text(request: EdgeTTSRequest):
    """Convert text to speech using Edge-TTS"""
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Clean the text to ensure it's plain text only
        clean_text = request.text.strip()
        
        # Log what we're processing
        logger.info(f"Processing text: '{clean_text}' with voice: {request.voice}")
        
        # Escape any XML characters in the text
        clean_text = clean_text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        
        # Generate speech using just the text and voice (not SSML)
        # Edge-TTS works better with plain text
        communicate = edge_tts.Communicate(clean_text, request.voice, rate=request.rate, pitch=request.pitch)
        
        # Collect audio data
        audio_data = io.BytesIO()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data.write(chunk["data"])
        
        audio_data.seek(0)
        
        if audio_data.getvalue():
            return StreamingResponse(
                io.BytesIO(audio_data.getvalue()),
                media_type="audio/mpeg",
                headers={
                    "Content-Disposition": "inline; filename=speech.mp3",
                    "Cache-Control": "no-cache"
                }
            )
        else:
            raise HTTPException(status_code=500, detail="No audio data generated")
            
    except Exception as e:
        logger.error(f"Error generating speech: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Speech generation failed: {str(e)}")

@router.get("/voices/by-language/{language}")
async def get_voices_by_language(language: str):
    """Get voices filtered by language/locale"""
    try:
        voices = await edge_tts.list_voices()
        filtered_voices = [
            voice for voice in voices 
            if voice["Locale"].lower().startswith(language.lower())
        ]
        
        voice_list = []
        for voice in filtered_voices:
            voice_info = VoiceInfo(
                name=voice["Name"],
                short_name=voice["ShortName"],
                gender=voice["Gender"],
                locale=voice["Locale"],
                suggested_codec=voice["SuggestedCodec"],
                friendly_name=voice["FriendlyName"],
                status=voice["Status"]
            )
            voice_list.append(voice_info)
        
        return voice_list
    except Exception as e:
        logger.error(f"Error fetching voices for language {language}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch voices: {str(e)}")

@router.get("/voices/english", response_model=List[VoiceInfo])
async def get_english_voices():
    """Get only US English voices"""
    try:
        voices = await edge_tts.list_voices()
        us_english_voices = []
        
        for voice in voices:
            # Filter for US English locales only
            if voice["Locale"] == "en-US":
                voice_info = VoiceInfo(
                    name=voice["Name"],
                    short_name=voice["ShortName"],
                    gender=voice["Gender"],
                    locale=voice["Locale"],
                    suggested_codec=voice["SuggestedCodec"],
                    friendly_name=voice["FriendlyName"],
                    status=voice["Status"]
                )
                us_english_voices.append(voice_info)
        
        return us_english_voices
    except Exception as e:
        logger.error(f"Error fetching US English voices: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch US English voices: {str(e)}")
