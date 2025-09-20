from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- import CORS
import torch
from transformers import VitsModel, AutoTokenizer
import io
import base64
import numpy as np
import soundfile as sf

app = Flask(__name__)
CORS(app)  # <-- enable CORS for all routes

# Load Tamil TTS model once at startup
model_name = "facebook/mms-tts-tam"
model = VitsModel.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)
model.eval()

@app.route("/tts", methods=["POST"])
def tts():
    data = request.get_json()
    text = data.get("text", "")
    if not text.strip():
        return jsonify({"error": "No text provided"}), 400

    try:
        inputs = tokenizer(text, return_tensors="pt")
        with torch.no_grad():
            output = model(**inputs).waveform  # [1, num_samples]

        audio = output.squeeze(0).cpu().numpy()
        audio_int16 = (audio * 32767).clip(-32768, 32767).astype(np.int16)

        # Save to in-memory buffer
        buf = io.BytesIO()
        sf.write(buf, audio_int16, samplerate=model.config.sampling_rate, format='WAV')
        buf.seek(0)
        audio_base64 = base64.b64encode(buf.read()).decode("utf-8")

        return jsonify({"audio": audio_base64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
