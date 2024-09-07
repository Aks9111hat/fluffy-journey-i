import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure you have your API key set as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_GEMINI_KEY!);


const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let chat: any;

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { message } = reqBody;

    if (!chat) {
        chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 100,
            },
        });
    }

    try {
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        return NextResponse.json({ reply: text });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
