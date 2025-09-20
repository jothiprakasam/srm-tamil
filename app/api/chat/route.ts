import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { promises as fs } from "fs";
import path from "path";
import { pipeline } from "@xenova/transformers";

// ---------------------------
// Gemini for LLM responses
// ---------------------------
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// ---------------------------
// Knowledge base JSON storage
// ---------------------------
const KNOWLEDGE_BASE_PATH = path.join(process.cwd(), "knowledge_base.json");

// ---------------------------
// Utility: cosine similarity
// ---------------------------
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB) || 0;
}

// ---------------------------
// Open-source embedding model
// ---------------------------
let embeddingPipeline: any = null;

async function generateEmbedding(text: string): Promise<number[]> {
  if (!embeddingPipeline) {
    embeddingPipeline = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  const output = await embeddingPipeline(text, { pooling: "mean", normalize: true });
  return Array.from(output.data); // Convert Float32Array -> number[]
}

// ---------------------------
// Init KB file if not exists
// ---------------------------
async function initializeKnowledgeBase() {
  try {
    await fs.access(KNOWLEDGE_BASE_PATH);
  } catch {
    await fs.writeFile(KNOWLEDGE_BASE_PATH, JSON.stringify([]));
  }
}

// ---------------------------
// Retrieve relevant context
// ---------------------------
async function getRelevantContext(message: string, nResults: number = 3): Promise<string> {
  const messageEmbedding = await generateEmbedding(message);
  const knowledgeBase = JSON.parse(await fs.readFile(KNOWLEDGE_BASE_PATH, "utf-8"));

  const similarities = knowledgeBase
    .map((entry: any) => ({
      context: entry.context,
      similarity: cosineSimilarity(messageEmbedding, entry.embedding),
    }))
    .sort((a: any, b: any) => b.similarity - a.similarity)
    .slice(0, nResults)
    .map((entry: any) => entry.context);

  return similarities.join("\n\n") || "";
}

// ---------------------------
// Store data in KB
// ---------------------------
async function storeInKnowledgeBase(type: string, context: string, embedding: number[]) {
  const knowledgeBase = JSON.parse(await fs.readFile(KNOWLEDGE_BASE_PATH, "utf-8"));
  knowledgeBase.push({
    id: `${type}-${Date.now()}`,
    type,
    context,
    embedding,
  });
  await fs.writeFile(KNOWLEDGE_BASE_PATH, JSON.stringify(knowledgeBase, null, 2));
}

// ---------------------------
// Main POST handler
// ---------------------------
export async function POST(req: NextRequest) {
  try {
    const { message, poem, analysis } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await initializeKnowledgeBase();

    // Store poem + analysis
    if (poem && analysis) {
      const context = JSON.stringify({
        poem,
        simplifiedTamil: analysis.simplifiedTamil,
        simplifiedEnglish: analysis.simplifiedEnglish,
        ilakkanam: analysis.ilakkanam,
      });
      const embedding = await generateEmbedding(context);
      await storeInKnowledgeBase("poem-analysis", context, embedding);
    }

    // Store user query
    const messageEmbedding = await generateEmbedding(message);
    await storeInKnowledgeBase("chat-message", message, messageEmbedding);

    // Retrieve context
    const context = await getRelevantContext(message);

    // Ask Gemini with context
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
You are a Tamil literary expert. Use the following context to answer the user's question about the poem analysis. 
Be concise and accurate.

Context:
${context}

User Question:
${message}
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!response) {
      return NextResponse.json({ error: "No valid response from LLM" }, { status: 500 });
    }

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request", details: error.message },
      { status: 500 }
    );
  }
}
