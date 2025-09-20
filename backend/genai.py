import os
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import numpy as np

# ---------------------------
# Configure Gemini API
# ---------------------------
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY","YOUR_API_KEY_HERE"))

# ---------------------------
# Setup Flask and CORS
# ---------------------------
app = Flask(__name__)
CORS(app)

# ---------------------------
# Setup Logger
# ---------------------------
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("app.log", encoding="utf-8"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# ---------------------------
# Knowledge Base
# ---------------------------
KNOWLEDGE_BASE_PATH = "knowledge_base.json"

def init_knowledge_base():
    if not os.path.exists(KNOWLEDGE_BASE_PATH):
        with open(KNOWLEDGE_BASE_PATH, "w", encoding="utf-8") as f:
            json.dump([], f)

def load_knowledge_base():
    init_knowledge_base()
    with open(KNOWLEDGE_BASE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_knowledge_base(data):
    with open(KNOWLEDGE_BASE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# ---------------------------
# Utilities
# ---------------------------
def cosine_similarity(vec_a, vec_b):
    a = np.array(vec_a)
    b = np.array(vec_b)
    dot = np.dot(a, b)
    norm = np.linalg.norm(a) * np.linalg.norm(b)
    return float(dot / norm) if norm else 0.0

def generate_embedding(text):
    try:
        model = genai.GenerativeModel("embedding-001")
        res = model.embed_content([text])
        return res["embedding"]
    except Exception as e:
        logger.exception("Failed to generate embedding")
        return [0.0]  # fallback

def get_relevant_context(message, n=3):
    try:
        kb = load_knowledge_base()
        query_emb = generate_embedding(message)
        scored = [
            (entry["context"], cosine_similarity(query_emb, entry["embedding"]))
            for entry in kb
        ]
        scored.sort(key=lambda x: x[1], reverse=True)
        context = "\n\n".join([ctx for ctx, _ in scored[:n]])
        logger.debug(f"Retrieved context for message '{message}': {context}")
        return context
    except Exception as e:
        logger.exception("Failed to retrieve relevant context")
        return ""

# ---------------------------
# Route: Analyze Poem
# ---------------------------
@app.route("/analyze-poem", methods=["POST"])
def analyze_poem():
    try:
        data = request.get_json()
        logger.info(f"Received /analyze-poem request: {data}")

        poem = data.get("prompt")
        if not poem:
            logger.warning("No poem text provided")
            return jsonify({"error": "Poem text is required"}), 400

        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
You are a Tamil literary expert.
Analyze the following poem and return ONLY valid JSON in this structure:

{{
  "simplifiedTamil": "string",
  "simplifiedEnglish": "string",
  "ilakkanam": {{
    "ezuthu": "string",
    "sol": "string",
    "porul": "string",
    "yaappu": "string",
    "ani": "string"
  }}
}}

Poem:
\"\"\"{poem}\"\"\"
"""
        logger.debug(f"Sending prompt to Gemini: {prompt}")

        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )

        content = (
            response.candidates[0].content.parts[0].text
            if response and response.candidates else None
        )
        logger.debug(f"Gemini response content: {content}")

        if not content:
            logger.error("No valid response from LLM")
            return jsonify({"error": "No valid response from LLM"}), 500

        try:
            analysis = json.loads(content)
        except Exception:
            logger.exception("Invalid JSON from LLM")
            return jsonify({"error": "Invalid JSON from LLM", "raw": content}), 500

        # Save in KB
        embedding = generate_embedding(json.dumps(analysis))
        kb = load_knowledge_base()
        kb.append({
            "id": f"poem-{len(kb)+1}",
            "type": "poem-analysis",
            "context": json.dumps(analysis, ensure_ascii=False),
            "embedding": embedding
        })
        save_knowledge_base(kb)
        logger.info("Poem analysis saved to knowledge base")

        return jsonify(analysis)

    except Exception as e:
        logger.exception("Failed to analyze poem")
        return jsonify({"error": "Failed to analyze poem", "details": str(e)}), 500

# ---------------------------
# Route: Chat
# ---------------------------
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        logger.info(f"Received /chat request: {data}")

        message = data.get("message")
        poem = data.get("poem")
        analysis = data.get("analysis")
        if not message:
            logger.warning("No message provided")
            return jsonify({"error": "Message is required"}), 400

        # Save user message in KB
        emb = generate_embedding(message)
        kb = load_knowledge_base()
        kb.append({
            "id": f"msg-{len(kb)+1}",
            "type": "chat-message",
            "context": message,
            "embedding": emb
        })
        save_knowledge_base(kb)
        logger.debug(f"Saved chat message: {message}")

        # Retrieve context
        context = get_relevant_context(message)

        # Ask Gemini
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
You are a Tamil literary expert. give the concise answer for 2-4 lines . Use the following context to answer.

Context:
{context}

User Question:
{message}
"""
        response = model.generate_content(prompt)
        reply = (
            response.candidates[0].content.parts[0].text
            if response and response.candidates else "No response"
        )
        logger.debug(f"Gemini chat reply: {reply}")

        return jsonify({"response": reply})

    except Exception as e:
        logger.exception("Chat request failed")
        return jsonify({"error": "Chat request failed", "details": str(e)}), 500

# ---------------------------
# Main
# ---------------------------
if __name__ == "__main__":
    init_knowledge_base()
    logger.info("Starting Flask server on port 8000...")
    app.run(host="0.0.0.0", port=8000, debug=True)
