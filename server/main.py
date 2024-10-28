# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

HUGGINGFACE_API_KEY = "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"  # Reemplaza con tu API Key
MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-Nemo-Instruct-2407/v1/chat/completions"

# Define el esquema de entrada para la API
class ChatRequest(BaseModel):
    prompt: str

@app.post("/chat/")
async def chat_with_model(request: ChatRequest):
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
        "Content-Type": "application/json"
    }
    body = {
        "model": "mistralai/Mistral-Nemo-Instruct-2407",
        "messages": [{"role": "user", "content": request.prompt}],
        "max_tokens": 500,
        "stream": False
    }

    response = requests.post(MODEL_URL, headers=headers, json=body)

    if response.status_code == 200:
        data = response.json()
        return {"response": data.get("choices")[0].get("message").get("content")}
    else:
        raise HTTPException(status_code=500, detail="Error al comunicarse con el modelo.")
