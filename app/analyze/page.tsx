"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mic, Upload, Volume2, Brain, BookOpen, FileText } from "lucide-react"
import "@/styles/olai2.css"

export default function AnalyzePage() {
  const { t } = useLanguage()
  const [poemText, setPoemText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const handleAnalyze = async (text?: string) => {
    const inputText = text || poemText
    if (!inputText.trim()) return
    setIsAnalyzing(true)
    setError(null)

    try {
      const res = await fetch("/api/genai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to analyze poem")

      setAnalysisResult(data)
    } catch (err: any) {
      console.error("Analyze error:", err)
      setError(err.message || "Unexpected error")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = "ta-IN"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsRecording(true)
    recognition.onend = () => setIsRecording(false)

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript
      setPoemText(spokenText)
      handleAnalyze(spokenText)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setError("Voice input failed: " + event.error)
      setIsRecording(false)
    }

    recognition.start()
  }

  const handleFileUpload = () => alert("File upload feature for Vattezhuthu will be implemented")
const playAudio = async (text: string, language: "ta" | "en") => {
  try {
    const res = await fetch("http://localhost:5000/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    if (!res.ok || !data.audio) throw new Error(data.error || "No audio returned");

    const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
    audio.play();
  } catch (err: any) {
    console.error("TTS playback error:", err);
    alert("Audio playback failed: " + err.message);
  }
};
  return (
    <div className="min-h-screen bg-olai bg-cover bg-center text-[#3d2f1b] font-olai">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-[#6b4f27]">{t("analyzer.title")}</h1>

          {/* Input Section */}
          <Card className="mb-8 card-olai">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("analyzer.input.label")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="poem-input">{t("analyzer.input.label")}</Label>
                <Textarea
                  id="poem-input"
                  placeholder={t("analyzer.input.placeholder")}
                  value={poemText}
                  onChange={(e) => setPoemText(e.target.value)}
                  className="min-h-32 mt-2 bg-[#fff8dc]/50 border-[#a1824a]"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={handleVoiceInput}
                  className={`flex items-center gap-2 bg-transparent text-[#3d2f1b] border-[#a1824a] hover:bg-[#a1824a]/10 ${
                    isRecording ? "animate-pulse" : ""
                  }`}
                >
                  <Mic className="h-4 w-4" />
                  {isRecording ? "Listening..." : t("analyzer.mic")}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleFileUpload}
                  className="flex items-center gap-2 bg-transparent text-[#3d2f1b] border-[#a1824a] hover:bg-[#a1824a]/10"
                >
                  <Upload className="h-4 w-4" />
                  {t("analyzer.upload.text")}
                </Button>
              </div>

              <Button
                onClick={() => handleAnalyze()}
                disabled={!poemText.trim() || isAnalyzing}
                className="w-full bg-[#a1824a] hover:bg-[#8f6f3d] text-[#fff8dc]"
              >
                {isAnalyzing ? "Analyzing..." : t("analyzer.analyze")}
              </Button>

              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-6">
              {/* Simplified Versions */}
              <Card className="card-olai">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {t("output.simplified")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {["Tamil", "English"].map((lang) => {
                    const text = lang === "Tamil" ? analysisResult.simplifiedTamil : analysisResult.simplifiedEnglish
                    return (
                      <div key={lang}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg">{t(`output.${lang.toLowerCase()}`)}</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => playAudio(text, lang === "Tamil" ? "ta" : "en")}
                            className="flex items-center gap-2 border-[#a1824a] text-[#3d2f1b] hover:bg-[#a1824a]/10"
                          >
                            <Volume2 className="h-4 w-4" />
                            {t(`output.listen.${lang.toLowerCase()}`)}
                          </Button>
                        </div>
                        <p className="text-[#3d2f1b] bg-[#fff8dc]/50 p-4 rounded-lg">{text}</p>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Ilakkanam Insights */}
              <Card className="card-olai">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {t("ilakkanam.title")}
                  </CardTitle>
                  <CardDescription>Comprehensive grammatical and literary analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(analysisResult.ilakkanam).map(([key, value]: any) => (
                      <div key={key} className="p-4 bg-[#fff8dc]/50 rounded-lg">
                        <h4 className="font-semibold mb-2">{t(`ilakkanam.${key}`)}</h4>
                        <p className="text-sm text-[#3d2f1b]">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => playAudio("இலக்கணப் பகுப்பாய்வு முடிந்தது", "ta")}
                      className="flex items-center gap-2 border-[#a1824a] text-[#3d2f1b] hover:bg-[#a1824a]/10"
                    >
                      <Volume2 className="h-4 w-4" />
                      {t("ilakkanam.listen")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}