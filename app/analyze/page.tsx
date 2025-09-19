"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mic, Upload, Volume2, Brain, BookOpen, FileText } from "lucide-react"

export default function AnalyzePage() {
  const { t } = useLanguage()
  const [poemText, setPoemText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!poemText.trim()) return
    setIsAnalyzing(true)
    setError(null)

    try {
      const res = await fetch("/api/genai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: poemText }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze poem")
      }

      setAnalysisResult(data)
    } catch (err: any) {
      console.error("Analyze error:", err)
      setError(err.message || "Unexpected error")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleVoiceInput = () => {
    alert("Voice input feature will be implemented with Web Speech API")
  }

  const handleFileUpload = () => {
    alert("File upload feature for Vattezhuthu will be implemented")
  }

  const playAudio = (text: string, language: "ta" | "en") => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "ta" ? "ta-IN" : "en-US"
      speechSynthesis.speak(utterance)
    } else {
      alert("Text-to-speech not supported in this browser")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">{t("analyzer.title")}</h1>

          {/* Input Section */}
          <Card className="mb-8">
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
                  className="min-h-32 mt-2"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handleVoiceInput} className="flex items-center gap-2 bg-transparent">
                  <Mic className="h-4 w-4" />
                  {t("analyzer.mic")}
                </Button>

                <Button variant="outline" onClick={handleFileUpload} className="flex items-center gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  {t("analyzer.upload.text")}
                </Button>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!poemText.trim() || isAnalyzing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isAnalyzing ? "Analyzing..." : t("analyzer.analyze")}
              </Button>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-6">
              {/* Simplified Versions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {t("output.simplified")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{t("output.tamil")}</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playAudio(analysisResult.simplifiedTamil, "ta")}
                        className="flex items-center gap-2"
                      >
                        <Volume2 className="h-4 w-4" />
                        {t("output.listen.tamil")}
                      </Button>
                    </div>
                    <p className="text-muted-foreground bg-secondary/30 p-4 rounded-lg">
                      {analysisResult.simplifiedTamil}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{t("output.english")}</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playAudio(analysisResult.simplifiedEnglish, "en")}
                        className="flex items-center gap-2"
                      >
                        <Volume2 className="h-4 w-4" />
                        {t("output.listen.english")}
                      </Button>
                    </div>
                    <p className="text-muted-foreground bg-secondary/30 p-4 rounded-lg">
                      {analysisResult.simplifiedEnglish}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Ilakkanam Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {t("ilakkanam.title")}
                  </CardTitle>
                  <CardDescription>Comprehensive grammatical and literary analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <h4 className="font-semibold mb-2">{t("ilakkanam.ezuthu")}</h4>
                      <p className="text-sm text-muted-foreground">{analysisResult.ilakkanam.ezuthu}</p>
                    </div>

                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <h4 className="font-semibold mb-2">{t("ilakkanam.sol")}</h4>
                      <p className="text-sm text-muted-foreground">{analysisResult.ilakkanam.sol}</p>
                    </div>

                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <h4 className="font-semibold mb-2">{t("ilakkanam.porul")}</h4>
                      <p className="text-sm text-muted-foreground">{analysisResult.ilakkanam.porul}</p>
                    </div>

                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <h4 className="font-semibold mb-2">{t("ilakkanam.yaappu")}</h4>
                      <p className="text-sm text-muted-foreground">{analysisResult.ilakkanam.yaappu}</p>
                    </div>

                    <div className="p-4 bg-secondary/30 rounded-lg md:col-span-2">
                      <h4 className="font-semibold mb-2">{t("ilakkanam.ani")}</h4>
                      <p className="text-sm text-muted-foreground">{analysisResult.ilakkanam.ani}</p>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => playAudio("இலக்கணப் பகுப்பாய்வு முடிந்தது", "ta")}
                      className="flex items-center gap-2"
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
