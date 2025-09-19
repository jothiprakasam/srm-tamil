"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ta"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.analyze": "Analyze",
    "nav.about": "About",

    // Landing Page
    "hero.title": "AI-Powered Tamil Literature Intelligence",
    "hero.subtitle": "Discover the depth and beauty of Tamil poetry through advanced AI analysis",
    "hero.cta": "Start Analyzing",
    "hero.learn": "Learn More",

    // Language Toggle
    "lang.toggle": "தமிழ்",
    "lang.current": "English",

    // Analyzer Page
    "analyzer.title": "Poem Analyzer & Voice Bot",
    "analyzer.input.label": "Enter Poem",
    "analyzer.input.placeholder": "Paste your Tamil poem here...",
    "analyzer.upload.text": "Upload Vattezhuthu",
    "analyzer.mic": "Voice Input",
    "analyzer.analyze": "Analyze Poem",

    // Output Sections
    "output.simplified": "Simplified Versions",
    "output.tamil": "Simple Tamil Explanation",
    "output.english": "Simple English Explanation",
    "output.listen.tamil": "Listen in Tamil",
    "output.listen.english": "Listen in English",

    // Ilakkanam Insights
    "ilakkanam.title": "Ilakkanam Insights",
    "ilakkanam.ezuthu": "Ezuthu Ilakkanam (Letter Grammar)",
    "ilakkanam.sol": "Sol Ilakkanam (Word Grammar)",
    "ilakkanam.porul": "Porul Ilakkanam (Meaning Grammar)",
    "ilakkanam.yaappu": "Yaappu Ilakkanam (Prosody)",
    "ilakkanam.ani": "Ani Ilakkanam (Rhetoric)",
    "ilakkanam.listen": "Listen to Insights",

    // About Page
    "about.title": "About Tamil Literature Intelligence",
    "about.problem": "The Problem",
    "about.solution": "Our Solution",
    "about.tech": "Technology Stack",
    "about.team": "Our Team",
  },
  ta: {
    // Navigation
    "nav.home": "முகப்பு",
    "nav.analyze": "பகுப்பாய்வு",
    "nav.about": "எங்களைப் பற்றி",

    // Landing Page
    "hero.title": "தமிழ் இலக்கிய நுண்ணறிவு",
    "hero.subtitle": "மேம்பட்ட AI பகுப்பாய்வு மூலம் தமிழ் கவிதையின் ஆழத்தையும் அழகையும் கண்டறியுங்கள்",
    "hero.cta": "பகுப்பாய்வு தொடங்கு",
    "hero.learn": "மேலும் அறிய",

    // Language Toggle
    "lang.toggle": "English",
    "lang.current": "தமிழ்",

    // Analyzer Page
    "analyzer.title": "கவிதை பகுப்பாய்வி மற்றும் குரல் போட்",
    "analyzer.input.label": "கவிதையை உள்ளிடுங்கள்",
    "analyzer.input.placeholder": "உங்கள் தமிழ் கவிதையை இங்கே ஒட்டுங்கள்...",
    "analyzer.upload.text": "வட்டெழுத்து பதிவேற்று",
    "analyzer.mic": "குரல் உள்ளீடு",
    "analyzer.analyze": "கவிதையை பகுப்பாய்வு செய்",

    // Output Sections
    "output.simplified": "எளிய வடிவங்கள்",
    "output.tamil": "எளிய தமிழ் விளக்கம்",
    "output.english": "எளிய ஆங்கில விளக்கம்",
    "output.listen.tamil": "தமிழில் கேளுங்கள்",
    "output.listen.english": "ஆங்கிலத்தில் கேளுங்கள்",

    // Ilakkanam Insights
    "ilakkanam.title": "இலக்கணப் பகுப்பாய்வு",
    "ilakkanam.ezuthu": "எழுத்து இலக்கணம்",
    "ilakkanam.sol": "சொல் இலக்கணம்",
    "ilakkanam.porul": "பொருள் இலக்கணம்",
    "ilakkanam.yaappu": "யாப்பு இலக்கணம்",
    "ilakkanam.ani": "அணி இலக்கணம்",
    "ilakkanam.listen": "பகுப்பாய்வை கேளுங்கள்",

    // About Page
    "about.title": "தமிழ் இலக்கிய நுண்ணறிவு பற்றி",
    "about.problem": "பிரச்சினை",
    "about.solution": "எங்கள் தீர்வு",
    "about.tech": "தொழில்நுட்ப அடுக்கு",
    "about.team": "எங்கள் குழு",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && (saved === "en" || saved === "ta")) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
