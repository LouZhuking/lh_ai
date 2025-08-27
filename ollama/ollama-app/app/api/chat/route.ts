import type { NextResponse } from "next/server";
import {
    Message,
    ChatResponse,
    ChatRequest,
} from "@/types/chat";

const oLLAMA_API_URL = "http://localhost:11434/api/chat";
const MODEL_NAME = 'deepseek-r1:1.5b';

export async function POST(request: NextResponse) {
    try {
        const body: { messages: Message[] } = await request.json();

        const ollamaRequestBody: ChatRequest = {
            model: MODEL_NAME,
            messages: body.messages,
            stream: false
        }
        const response = await fetch(oLLAMA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ollamaRequestBody)
        })
        if (!response.ok) {
            const errorText = await response.text
            return Response.json(
                {
                    error: `Ollama API Error:${errorText}`
                }
            )
        }

        const ollamaData: ChatResponse = await response.json()
        return Response.json(ollamaData)
    } catch (err) {
        console.log('Chat API Error:', err);
        return Response.json(
            {
                status: 500
            }
        )
    }
}