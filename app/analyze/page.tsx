"use client"

import { useState, useRef } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Mic, Upload, Volume2, Brain, BookOpen, FileText, Square } from "lucide-react"
import "@/styles/olai2.css"

export default function AnalyzePage() {
  const { t } = useLanguage()
  const [poemText, setPoemText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const recognitionRef = useRef<any>(null)

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

  const startRecognition = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser")
      return
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = "ta-IN"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsRecording(true)
    recognition.onend = () => {
      setIsRecording(false)
      setShowVoiceModal(false)
    }
    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript
      setPoemText(spokenText)
      handleAnalyze(spokenText)
      setShowVoiceModal(false)
    }
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setError("Voice input failed: " + event.error)
      setIsRecording(false)
      setShowVoiceModal(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
  }

  const handleFileUpload = () => alert("File upload feature for Vattezhuthu will be implemented")

  const playAudio = async (text: string, language: "ta" | "en") => {
    try {
      if (language === "ta") {
        const res = await fetch("http://localhost:5000/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        })
        const data = await res.json()
        if (!res.ok || !data.audio) throw new Error(data.error || "No audio returned")
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`)
        audio.play()
      } else {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "en-US"
        speechSynthesis.speak(utterance)
      }
    } catch (err: any) {
      console.error("TTS playback error:", err)
      alert("Audio playback failed: " + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-olai bg-cover text-[#4d2e0f] font-tamil">
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center text-[#b45f04] drop-shadow-lg">
          {t("analyzer.title")}
        </h1>

        {/* Input Section */}
        <Card className="mb-10 shadow-xl rounded-xl border-2 border-[#d4a373] bg-gradient-to-b from-[#fff8dc]/80 to-[#f7e7c6]/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-[#7f4f24]">
              <FileText className="h-6 w-6" />
              {t("analyzer.input.label")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="poem-input">{t("analyzer.input.label")}</Label>
            <Textarea
              id="poem-input"
              placeholder={t("analyzer.input.placeholder")}
              value={poemText}
              onChange={(e) => setPoemText(e.target.value)}
              className="min-h-36 mt-2 border-2 border-[#c99f6c] bg-[#fff8dc]/70 rounded-lg p-3 text-[#4d2e0f]"
            />

            <div className="flex flex-wrap gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowVoiceModal(true)}
                className="flex items-center gap-2 border-[#b45f04] text-[#4d2e0f] hover:bg-[#b45f04]/10"
              >
                <Mic className="h-5 w-5" />
                {t("analyzer.mic")}
              </Button>

              <Button
                variant="outline"
                onClick={handleFileUpload}
                className="flex items-center gap-2 border-[#b45f04] text-[#4d2e0f] hover:bg-[#b45f04]/10"
              >
                <Upload className="h-5 w-5" />
                {t("analyzer.upload.text")}
              </Button>
            </div>

            <Button
              onClick={() => handleAnalyze()}
              disabled={!poemText.trim() || isAnalyzing}
              className="w-full bg-[#b45f04] hover:bg-[#8f3e02] text-[#fff8dc] mt-4"
            >
              {isAnalyzing ? "Analyzing..." : t("analyzer.analyze")}
            </Button>

            {error && <p className="text-red-700 text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>

        {/* Voice Modal */}
        <Dialog open={showVoiceModal} onOpenChange={setShowVoiceModal}>
          <DialogContent className="sm:max-w-md bg-[#fff8dc] border-[#d4a373]">
            <DialogHeader>
              <DialogTitle className="text-[#7f4f24] flex items-center gap-2">
                <Mic className="h-5 w-5" />
                {t("Voice input") || "Voice Input"}
              </DialogTitle>
            </DialogHeader>
            <div className="py-6 text-center">
{isRecording ? (
  <div className="flex flex-col items-center gap-4">
    <p className="text-[#b45f04] font-semibold">🎙 Listening... Speak now</p>
    <div className="waveform">
      <div className="waveform-bar"></div>
      <div className="waveform-bar"></div>
      <div className="waveform-bar"></div>
      <div className="waveform-bar"></div>
      <div className="waveform-bar"></div>
    </div>
  </div>
) : (
  <p className="text-[#4d2e0f]">Click start to begin speaking</p>
)}

            </div>
            <DialogFooter className="flex justify-center gap-4">
              {!isRecording ? (
                <Button
                  onClick={startRecognition}
                  className="bg-[#b45f04] hover:bg-[#8f3e02] text-[#fff8dc]"
                >
                  Start Speaking
                </Button>
              ) : (
                <Button
                  onClick={stopRecognition}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-8">
            {/* Simplified Versions */}
            <Card className="shadow-lg rounded-xl border-2 border-[#d4a373] bg-[#fff3d1]/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-[#7f4f24]">
                  <BookOpen className="h-6 w-6" />
                  {t("output.simplified")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {["Tamil", "English"].map((lang) => {
                  const text = lang === "Tamil" ? analysisResult.simplifiedTamil : analysisResult.simplifiedEnglish
                  return (
                    <div key={lang}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{t(`output.${lang.toLowerCase()}`)}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playAudio(text, lang === "Tamil" ? "ta" : "en")}
                          className="flex items-center gap-2 border-[#b45f04] text-[#4d2e0f] hover:bg-[#b45f04]/10"
                        >
                          <Volume2 className="h-4 w-4" />
                          {t(`output.listen.${lang.toLowerCase()}`)}
                        </Button>
                      </div>
                      <p className="bg-[#fff8dc]/70 p-4 rounded-lg text-[#4d2e0f]">{text}</p>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Ilakkanam Insights */}
            <Card className="shadow-lg rounded-xl border-2 border-[#d4a373] bg-[#fff3d1]/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-[#7f4f24]">
                  <Brain className="h-6 w-6" />
                  {t("ilakkanam.title")}
                </CardTitle>
                <CardDescription>Comprehensive grammatical and literary analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(analysisResult.ilakkanam).map(([key, value]: any) => (
                    <div key={key} className="p-4 bg-[#fff8dc]/70 rounded-lg shadow-inner">
                      <h4 className="font-semibold mb-2">{t(`ilakkanam.${key}`)}</h4>
                      <p className="text-sm text-[#4d2e0f]">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => playAudio("இலக்கணப் பகுப்பாய்வு முடிந்தது", "ta")}
                    className="flex items-center gap-2 border-[#b45f04] text-[#4d2e0f] hover:bg-[#b45f04]/10"
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
  )
}