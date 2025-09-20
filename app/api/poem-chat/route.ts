const playAudio = async (text: string, language: "ta" | "en") => {
  try {
    const res = await fetch("/api/poem-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language }),
    });

    const data = await res.json();
    if (!res.ok || !data.audio) throw new Error(data.error || "No audio returned");

    // Create a playable audio object
    const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
    audio.play();
  } catch (err: any) {
    console.error("TTS playback error:", err);
    alert("Audio playback failed: " + err.message);
  }
};
