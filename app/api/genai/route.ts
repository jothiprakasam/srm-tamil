// app/api/analyze-poem/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const promptm = `
You are a Tamil literary expert. 
Analyze the following poem and return ONLY valid JSON in this structure:

{
  "simplifiedTamil": "string",
  "simplifiedEnglish": "string",
  "ilakkanam": {
    "ezuthu": "string",
    "sol": "string",
    "porul": "string",
    "yaappu": "string",
    "ani": "string"
  }
}

Poem:
"""${prompt}"""
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: promptm }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    // ✅ Safe access with fallback
    const candidate = result?.response?.candidates?.[0];
    const content = candidate?.content?.parts?.[0]?.text;

    if (!content) {
      return NextResponse.json(
        { error: "No valid response from LLM" },
        { status: 500 }
      );
    }

    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON from LLM", raw: content },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze poem", details: error.message },
      { status: 500 }
    );
  }
}

