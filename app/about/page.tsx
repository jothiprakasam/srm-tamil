"use client"

import { useLanguage } from "@/contexts/language-context"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Target, Code, Users } from "lucide-react"

export default function AboutPage() {
  const { t, language } = useLanguage()

  const problemContent = {
    en: {
      title: "The Challenge",
      description:
        "Tamil literature, one of the world's oldest literary traditions, faces accessibility challenges in the modern digital age. Complex grammatical structures, ancient poetic forms, and deep cultural contexts make it difficult for new learners and even native speakers to fully appreciate the richness of Tamil poetry.",
      points: [
        "Limited digital tools for Tamil literary analysis",
        "Complex grammatical structures (Ilakkanam) are hard to understand",
        "Traditional Vattezhuthu script is becoming less accessible",
        "Lack of interactive learning resources for Tamil literature",
      ],
    },
    ta: {
      title: "சவால்",
      description:
        "உலகின் மிகப் பழமையான இலக்கிய மரபுகளில் ஒன்றான தமிழ் இலக்கியம், நவீன டிஜிட்டல் யுகத்தில் அணுகல் சவால்களை எதிர்கொள்கிறது. சிக்கலான இலக்கண அமைப்புகள், பண்டைய கவிதை வடிவங்கள், மற்றும் ஆழமான கலாச்சார சூழல்கள் புதிய கற்பவர்களுக்கும் தாய்மொழி பேசுபவர்களுக்கும் தமிழ் கவிதையின் செழுமையை முழுமையாக பாராட்டுவதை கடினமாக்குகிறது.",
      points: [
        "தமிழ் இலக்கிய பகுப்பாய்வுக்கான வரையறுக்கப்பட்ட டிஜிட்டல் கருவிகள்",
        "சிக்கலான இலக்கண அமைப்புகள் (இலக்கணம்) புரிந்துகொள்வது கடினம்",
        "பாரம்பரிய வட்டெழுத்து எழுத்து குறைவான அணுகல்",
        "தமிழ் இலக்கியத்திற்கான ஊடாடும் கற்றல் வளங்களின் பற்றாக்குறை",
      ],
    },
  }

  const solutionContent = {
    en: {
      title: "Our Solution",
      description:
        "Tamil Literature Intelligence combines artificial intelligence with deep linguistic knowledge to make Tamil poetry accessible to everyone. Our platform provides comprehensive analysis, voice interaction, and educational tools.",
      features: [
        "AI-powered poem analysis with simplified explanations",
        "Comprehensive Ilakkanam (grammar) breakdown",
        "Voice input and text-to-speech in Tamil and English",
        "Support for traditional Vattezhuthu script",
        "Bilingual interface for global accessibility",
      ],
    },
    ta: {
      title: "எங்கள் தீர்வு",
      description:
        "தமிழ் இலக்கிய நுண்ணறிவு செயற்கை நுண்ணறிவை ஆழமான மொழியியல் அறிவுடன் இணைத்து தமிழ் கவிதையை அனைவருக்கும் அணுகக்கூடியதாக ஆக்குகிறது. எங்கள் தளம் விரிவான பகுப்பாய்வு, குரல் தொடர்பு மற்றும் கல்வி கருவிகளை வழங்குகிறது.",
      features: [
        "எளிமையான விளக்கங்களுடன் AI-இயங்கும் கவிதை பகுப்பாய்வு",
        "விரிவான இலக்கணம் பிரிவு",
        "தமிழ் மற்றும் ஆங்கிலத்தில் குரல் உள்ளீடு மற்றும் உரை-க்கு-பேச்சு",
        "பாரம்பரிய வட்டெழுத்து எழுத்துக்கான ஆதரவு",
        "உலகளாவிய அணுகலுக்கான இருமொழி இடைமுகம்",
      ],
    },
  }

  const techStack = [
    { name: "Next.js", category: "Frontend" },
    { name: "React", category: "UI Library" },
    { name: "TypeScript", category: "Language" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "AI/ML APIs", category: "Analysis" },
    { name: "Web Speech API", category: "Voice" },
  ]

  const teamMembers = {
    en: [
      { name: "Dr. Meera Krishnan", role: "Tamil Literature Expert", description: "PhD in Classical Tamil Literature" },
      { name: "Arjun Patel", role: "AI Engineer", description: "Specializes in NLP and Tamil language processing" },
      { name: "Priya Sharma", role: "UX Designer", description: "Expert in multilingual interface design" },
      { name: "Karthik Raman", role: "Full Stack Developer", description: "Builds scalable web applications" },
    ],
    ta: [
      { name: "டாக்டர் மீரா கிருஷ்ணன்", role: "தமிழ் இலக்கிய நிபுணர்", description: "செம்மொழி தமிழ் இலக்கியத்தில் முனைவர் பட்டம்" },
      { name: "அர்ஜுன் பட்டேல்", role: "AI பொறியாளர்", description: "NLP மற்றும் தமிழ் மொழி செயலாக்கத்தில் நிபுணர்" },
      { name: "பிரியா சர்மா", role: "UX வடிவமைப்பாளர்", description: "பன்மொழி இடைமுக வடிவமைப்பில் நிபுணர்" },
      { name: "கார்த்திக் ராமன்", role: "முழு அடுக்கு டெவலப்பர்", description: "அளவிடக்கூடிய வலை பயன்பாடுகளை உருவாக்குகிறார்" },
    ],
  }

  const currentContent = {
    problem: problemContent[language],
    solution: solutionContent[language],
    team: teamMembers[language],
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">{t("about.title")}</h1>

          {/* Problem Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                {currentContent.problem.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{currentContent.problem.description}</p>
              <ul className="space-y-2">
                {currentContent.problem.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Solution Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Target className="h-5 w-5" />
                {currentContent.solution.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{currentContent.solution.description}</p>
              <ul className="space-y-2">
                {currentContent.solution.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Technology Stack */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                {t("about.tech")}
              </CardTitle>
              <CardDescription>Modern technologies powering our platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {techStack.map((tech, index) => (
                  <div key={index} className="flex flex-col items-center p-3 bg-secondary/30 rounded-lg">
                    <span className="font-semibold text-sm">{tech.name}</span>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {tech.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t("about.team")}
              </CardTitle>
              <CardDescription>Experts in Tamil literature, AI, and technology</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentContent.team.map((member, index) => (
                  <div key={index} className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
