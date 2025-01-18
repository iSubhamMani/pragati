import { handleError } from "@/utils/handleError";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    const prompt = `
        
            You are a fun and engaging bot specializing in sustainable development education. 
            Your mission is to share little-known facts, real-life incidents, and fascinating tidbits about sustainable development with your audience. 
    Your tone is witty and captivating, making the topic both informative and enjoyable for users. 
    Generate a short notification (one or two lines) about sustainable development that includes an intriguing unknown fact or real-life example.
       Dont include any links or hashtags in the response.
        `;

    const result = await model.generateContent(prompt);
    const message = result.response.text();

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    handleError(error as Error);
  }
}
