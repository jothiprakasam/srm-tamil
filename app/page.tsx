"use client"

import { useLanguage } from "@/contexts/language-context"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Mic, Brain, Volume2 } from "lucide-react"

// ✅ Custom styles for Olai Chuvadi theme
import "@/styles/olai.css"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-olai text-[#3d2f1b] font-olai">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            {t("hero.title")}
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-pretty opacity-90">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/analyze">
              <Button size="lg" className="bg-[#a1824a] hover:bg-[#8f6f3d] text-[#fff8dc] px-8 py-3">
                {t("hero.cta")}
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent border-[#8f6f3d] text-[#3d2f1b]">
                {t("hero.learn")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f7f1d0]/80">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-olai text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-lg bg-[#c9b88a]/40 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-[#6b4f27]" />
                </div>
                <CardTitle className="text-lg">Poem Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Deep analysis of Tamil poetry with AI-powered insights into structure, meaning, and literary devices.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-olai text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-lg bg-[#a1824a]/30 flex items-center justify-center mb-4">
                  <Mic className="h-6 w-6 text-[#6b4f27]" />
                </div>
                <CardTitle className="text-lg">Voice Input</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Speak your poems directly or upload traditional Vattezhuthu script for instant analysis.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-olai text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-lg bg-[#c9b88a]/40 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-[#6b4f27]" />
                </div>
                <CardTitle className="text-lg">Ilakkanam Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive grammatical analysis covering Ezuthu, Sol, Porul, Yaappu, and Ani Ilakkanam.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="card-olai text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-lg bg-[#a1824a]/30 flex items-center justify-center mb-4">
                  <Volume2 className="h-6 w-6 text-[#6b4f27]" />
                </div>
                <CardTitle className="text-lg">Voice Bot</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Listen to simplified explanations and detailed analysis in both Tamil and English.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to explore Tamil literature?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start analyzing your favorite Tamil poems with our AI-powered tools.
          </p>
          <Link href="/analyze">
            <Button size="lg" className="bg-[#a1824a] hover:bg-[#8f6f3d] text-[#fff8dc] px-8 py-3">
              {t("hero.cta")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#c9b88a] py-8 px-4 sm:px-6 lg:px-8 bg-[#f7f1d0]/70">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-[#6b4f27] flex items-center justify-center">
                <span className="text-[#fff8dc] font-bold text-lg">த</span>
              </div>
              <span className="font-bold text-xl">Tamil Literature Intelligence</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/" className="hover:text-[#6b4f27] transition-colors">
                {t("nav.home")}
              </Link>
              <Link href="/analyze" className="hover:text-[#6b4f27] transition-colors">
                {t("nav.analyze")}
              </Link>
              <Link href="/about" className="hover:text-[#6b4f27] transition-colors">
                {t("nav.about")}
              </Link>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#c9b88a] text-center opacity-80">
            <p>&copy; 2024 Tamil Literature Intelligence. Preserving and analyzing Tamil literary heritage.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
