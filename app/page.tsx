"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Linkedin,
  Brain,
  Code,
  TrendingUp,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Target,
  GraduationCap,
  BarChart3,
  Network,
  FileText,
  Users,
  UserCheck,
  Rocket,
  Cpu,
  Zap,
  Star,
  Mail,
  Book,
} from "lucide-react"
import { useInView } from "@/hooks/useInView"

export default function EnhancedKashifPortfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")
  const [isHovering, setIsHovering] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [typingText, setTypingText] = useState("")
  const [glowIntensity, setGlowIntensity] = useState(0.5)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Refs for internal animation state
  const currentTextIndexRef = useRef(0)
  const charIndexRef = useRef(0)
  const isDeletingRef = useRef(false)
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const particlesAnimationRef = useRef<number>()
  const particlesRef = useRef<
    Array<{ id: number; x: number; y: number; size: number; opacity: number; vx: number; vy: number }>
  >([])
  const floatingElementsRef = useRef<Array<{ id: number; x: number; y: number; rotation: number; scale: number }>>()

  // Refs for scroll animations
  const [aboutRef, aboutInView] = useInView({ threshold: 0.2 })
  const [skillsRef, skillsInView] = useInView({ threshold: 0.2 })
  const [experienceRef, experienceInView] = useInView({ threshold: 0.2 })
  const [projectsRef, projectsInView] = useInView({ threshold: 0.2 })
  const [contactRef, contactInView] = useInView({ threshold: 0.2 })

  const typingTexts = [
    "Science & Engineering Associate - AI Engineer",
    "HR-AI Solutions Developer",
    "Machine Learning Engineer in HR",
    "AI Innovation Specialist",
  ]

  // Initialize particles once
  const initializeParticles = useCallback(() => {
    if (typeof window === "undefined") return

    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }))
    particlesRef.current = newParticles
  }, [])

  // Initialize floating elements once
  const initializeFloatingElements = useCallback(() => {
    if (typeof window === "undefined") return

    const elements = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
    }))
    floatingElementsRef.current = elements
  }, [])

  // Canvas animation with proper cleanup
  const animateCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update particle positions
      particlesRef.current = particlesRef.current.map((particle) => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vx: particle.x <= 0 || particle.x >= canvas.width ? -particle.vx : particle.vx,
        vy: particle.y <= 0 || particle.y >= canvas.height ? -particle.vy : particle.vy,
      }))

      // Draw enhanced connecting lines with gradient
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + Math.pow(particle.y - otherParticle.y, 2),
          )

          if (distance < 150) {
            const gradient = ctx.createLinearGradient(particle.x, particle.y, otherParticle.x, otherParticle.y)
            gradient.addColorStop(0, `rgba(59, 130, 246, ${0.3 * (1 - distance / 150)})`)
            gradient.addColorStop(0.5, `rgba(147, 51, 234, ${0.2 * (1 - distance / 150)})`)
            gradient.addColorStop(1, `rgba(59, 130, 246, ${0.1 * (1 - distance / 150)})`)

            ctx.beginPath()
            ctx.strokeStyle = gradient
            ctx.lineWidth = 1.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })

        // Draw enhanced particles with glow effect
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 3)
        gradient.addColorStop(0, `rgba(59, 130, 246, ${particle.opacity})`)
        gradient.addColorStop(0.7, `rgba(147, 51, 234, ${particle.opacity * 0.5})`)
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)")

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      particlesAnimationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }, [])

  // Initialize everything once on mount
  useEffect(() => {
    setIsVisible(true)
    initializeParticles()
    initializeFloatingElements()
    animateCanvas()

    return () => {
      if (particlesAnimationRef.current) {
        cancelAnimationFrame(particlesAnimationRef.current)
      }
    }
  }, [initializeParticles, initializeFloatingElements, animateCanvas])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      initializeParticles()
      initializeFloatingElements()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [initializeParticles, initializeFloatingElements])

  // Typing animation logic
  useEffect(() => {
    const type = () => {
      const currentText = typingTexts[currentTextIndexRef.current]
      const currentLength = charIndexRef.current

      if (!isDeletingRef.current) {
        // Typing
        if (currentLength < currentText.length) {
          setTypingText(currentText.substring(0, currentLength + 1))
          charIndexRef.current = currentLength + 1
          animationTimerRef.current = setTimeout(type, 500) // Much slower typing: 500ms per character
        } else {
          // Done typing, wait before deleting
          isDeletingRef.current = true
          animationTimerRef.current = setTimeout(type, 6000) // Much longer pause: 6 seconds
        }
      } else {
        // Deleting
        if (currentLength > 0) {
          setTypingText(currentText.substring(0, currentLength - 1))
          charIndexRef.current = currentLength - 1
          animationTimerRef.current = setTimeout(type, 200) // Slower deleting: 200ms per character
        } else {
          // Done deleting, switch to next text
          isDeletingRef.current = false
          currentTextIndexRef.current = (currentTextIndexRef.current + 1) % typingTexts.length
          charIndexRef.current = 0
          animationTimerRef.current = setTimeout(type, 2000) // Longer delay before next text: 2 seconds
        }
      }
    }

    type() // Start the animation

    // Cleanup function
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current)
      }
    }
  }, [typingTexts]) // Only re-run if typingTexts array changes

  // Scroll and mouse handlers
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setScrollY(scrollPosition)
      setGlowIntensity(0.5 + (scrollPosition / 1000) * 0.5)

      const sections = ["hero", "about", "skills", "experience", "projects", "contact"]
      const scrollPos = scrollPosition + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Enhanced particle interaction
      particlesRef.current = particlesRef.current.map((particle) => {
        const dx = e.clientX - particle.x
        const dy = e.clientY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          return {
            ...particle,
            vx: particle.vx + (dx / distance) * 0.02,
            vy: particle.vy + (dy / distance) * 0.02,
          }
        }
        return particle
      })

      // Update floating elements
      if (floatingElementsRef.current) {
        floatingElementsRef.current = floatingElementsRef.current.map((element) => ({
          ...element,
          rotation: element.rotation + 0.5,
          x: element.x + Math.sin(Date.now() * 0.001 + element.id) * 0.1,
          y: element.y + Math.cos(Date.now() * 0.001 + element.id) * 0.1,
        }))
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("scroll", handleMouseMove)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Update time
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  const skills = [
    { name: "Machine Learning", level: 85, category: "AI/ML", icon: Brain, color: "from-purple-500 to-pink-500" },
    { name: "Python", level: 90, category: "Programming", icon: Code, color: "from-green-500 to-emerald-500" },
    { name: "HR Analytics", level: 80, category: "HR Tech", icon: BarChart3, color: "from-blue-500 to-cyan-500" },
    {
      name: "Data Science",
      level: 82,
      category: "Analytics",
      icon: BarChart3,
      color: "from-teal-500 to-cyan-500",
    },
    {
      name: "Natural Language Processing",
      level: 78,
      category: "AI/ML",
      icon: FileText,
      color: "from-orange-500 to-red-500",
    },
    { name: "TensorFlow/PyTorch", level: 75, category: "AI/ML", icon: Cpu, color: "from-indigo-500 to-purple-500" },
    {
      name: "SQL & Databases",
      level: 85,
      category: "Data",
      icon: Network,
      color: "from-rose-500 to-pink-500",
    },
    {
      name: "Computer Vision",
      level: 70,
      category: "AI/ML",
      icon: Target,
      color: "from-violet-500 to-purple-500",
    },
  ]

  const hrProjects = [
    {
      title: "Resume Screening AI System",
      description:
        "Developed an intelligent resume screening system using NLP and machine learning to automatically parse, analyze, and rank candidate resumes based on job requirements, reducing manual screening time by 75%.",
      tech: ["Python", "spaCy", "Scikit-learn", "NLTK", "Pandas", "Flask"],
      impact: "75% reduction in screening time",
      status: "Completed",
      type: "Academic Project",
      icon: UserCheck,
      gradient: "from-blue-600 via-purple-600 to-indigo-800",
      stats: { resumes: "1K+", accuracy: "87%", efficiency: "+75%" },
      features: ["Resume Parsing", "Skill Extraction", "Automated Ranking", "Match Scoring"],
    },
    {
      title: "Employee Sentiment Analysis Tool",
      description:
        "Built a sentiment analysis application to analyze employee feedback and reviews using natural language processing, providing insights into employee satisfaction and engagement levels.",
      tech: ["Python", "VADER", "TextBlob", "Matplotlib", "Streamlit", "Pandas"],
      impact: "Real-time sentiment insights",
      status: "In Progress",
      type: "Learning Project",
      icon: TrendingUp,
      gradient: "from-emerald-600 via-teal-600 to-cyan-800",
      stats: { feedback: "500+", accuracy: "82%", insights: "Real-time" },
      features: ["Sentiment Classification", "Emotion Detection", "Trend Analysis", "Visual Dashboard"],
    },
    {
      title: "HR Chatbot Assistant",
      description:
        "Created an AI-powered chatbot to handle common HR queries, provide policy information, and assist employees with basic HR processes using natural language understanding.",
      tech: ["Python", "Rasa", "spaCy", "SQLite", "FastAPI", "React"],
      impact: "24/7 HR support automation",
      status: "Development",
      type: "Capstone Project",
      icon: FileText,
      gradient: "from-orange-600 via-red-600 to-rose-800",
      stats: { queries: "200+", response: "Instant", availability: "24/7" },
      features: ["Intent Recognition", "Policy Q&A", "Multi-language", "Learning Capability"],
    },
  ]

  const achievements = [
    {
      title: "B.E Computer Systems Engineering",
      organization: "University",
      year: "2024",
      icon: GraduationCap,
      color: "from-blue-500 to-indigo-600",
      description: "Specialized in AI and Machine Learning",
    },
    {
      title: "Science & Engineering Associate",
      organization: "Current Role - HR AI Engineer",
      year: "2025",
      icon: Rocket,
      color: "from-green-500 to-emerald-600",
      description: "AI Engineer in HR Department",
    },
    {
      title: "Machine Learning Certification",
      organization: "Coursera - Stanford",
      year: "2023",
      icon: Brain,
      color: "from-purple-500 to-pink-600",
      description: "Andrew Ng's ML Course Completion",
    },
    {
      title: "Python for Data Science",
      organization: "IBM - Coursera",
      year: "2023",
      icon: Code,
      color: "from-orange-500 to-red-600",
      description: "Data Science and Analytics Specialization",
    },
  ]

  // Enhanced cursor with advanced effects
  const getCursorStyle = () => {
    const baseStyle = {
      left: mousePosition.x - 12,
      top: mousePosition.y - 12,
      pointerEvents: "none" as const,
      zIndex: 9999,
      position: "fixed" as const,
      transition: "all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      mixBlendMode: "difference" as const,
    }

    switch (cursorVariant) {
      case "button":
        return {
          ...baseStyle,
          width: "60px",
          height: "60px",
          background: `radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.3) 50%, transparent 100%)`,
          border: "2px solid rgba(59, 130, 246, 0.6)",
          borderRadius: "50%",
          transform: "translate(-50%, -50%) scale(1.5)",
          left: mousePosition.x,
          top: mousePosition.y,
          boxShadow: `0 0 30px rgba(59, 130, 246, 0.5), inset 0 0 20px rgba(147, 51, 234, 0.3)`,
        }
      case "link":
        return {
          ...baseStyle,
          width: "40px",
          height: "40px",
          background: `conic-gradient(from 0deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.4), rgba(59, 130, 246, 0.5))`,
          borderRadius: "50%",
          transform: "translate(-50%, -50%) scale(1.2) rotate(45deg)",
          left: mousePosition.x,
          top: mousePosition.y,
          boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)",
        }
      case "card":
        return {
          ...baseStyle,
          width: "32px",
          height: "32px",
          background: `linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.2))`,
          border: "1px solid rgba(59, 130, 246, 0.4)",
          borderRadius: "8px",
          transform: "translate(-50%, -50%) rotate(45deg)",
          left: mousePosition.x,
          top: mousePosition.y,
          boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
        }
      default:
        return {
          ...baseStyle,
          width: "24px",
          height: "24px",
          background: `radial-gradient(circle, #3b82f6 0%, #9333ea 70%, transparent 100%)`,
          borderRadius: "50%",
          opacity: isHovering ? 1 : 0.8,
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)",
        }
    }
  }

  const handleButtonClick = (url: string, type: "external" | "download" | "scroll" = "external") => {
    setCursorVariant("button")
    setTimeout(() => setCursorVariant("default"), 400)

    switch (type) {
      case "external":
        window.open(url, "_blank", "noopener,noreferrer")
        break
      case "download":
        const link = document.createElement("a")
        link.href = url
        link.download = "Kashif_Mujeeb_Resume.pdf"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        break
      case "scroll":
        const element = document.getElementById(url)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
        break
    }
  }

  const handleMouseEnter = (variant: string) => {
    setCursorVariant(variant)
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setCursorVariant("default")
    setIsHovering(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced Custom Cursor */}
      <div style={getCursorStyle()} className="pointer-events-none z-50" />

      {/* Enhanced Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: glowIntensity }} />

      {/* Advanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient meshes */}
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse transform rotate-12" />
        <div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/15 to-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse transform -rotate-12"
          style={{ animationDelay: "1s" }}
        />
        {/* New gradient mesh */}
        <div
          className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-to-tl from-pink-500/15 via-red-500/10 to-orange-500/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse transform rotate-45"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Floating geometric elements */}
        {floatingElementsRef.current &&
          floatingElementsRef.current.map((element) => (
            <div
              key={element.id}
              className="absolute w-8 h-8 opacity-20"
              style={{
                left: element.x,
                top: element.y,
                transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
                transition: "all 0.3s ease-out",
              }}
            >
              <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg shadow-lg" />
            </div>
          ))}

        {/* Animated light rays */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent transform rotate-12 animate-pulse" />
        <div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-400/30 to-transparent transform -rotate-12 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Enhanced Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-2xl border-b border-white/10 z-40 transition-all duration-500 shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div
              className="flex items-center space-x-4 cursor-pointer group"
              onMouseEnter={() => handleMouseEnter("link")}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleButtonClick("hero", "scroll")}
            >
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden">
                  <span className="text-white font-bold text-xl z-10">K</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white animate-pulse shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl scale-110" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Kashif Mujeeb
                </h1>
                <p className="text-sm text-blue-300 font-medium">AI Engineer | HR-AI Specialist</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-green-300">Science & Engineering Associate</span>
                </div>
              </div>
            </div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {["About", "Skills", "Experience", "Projects", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`relative text-white/80 hover:text-white transition-all duration-500 group text-sm font-medium cursor-pointer ${
                    activeSection === item.toLowerCase() ? "text-white" : ""
                  }`}
                  onMouseEnter={() => handleMouseEnter("link")}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => {
                    e.preventDefault()
                    handleButtonClick(item.toLowerCase(), "scroll")
                  }}
                >
                  {item}
                  <span className="absolute -bottom-3 left-0 w-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 transition-all duration-500 group-hover:w-full rounded-full shadow-lg" />
                  {activeSection === item.toLowerCase() && (
                    <span className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full shadow-lg animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-110 blur-sm" />
                </a>
              ))}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <button
              className="md:hidden p-4 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-500 transform hover:scale-110 backdrop-blur-sm border border-white/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onMouseEnter={() => handleMouseEnter("button")}
              onMouseLeave={handleMouseLeave}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Enhanced Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-8 pb-8 border-t border-white/20">
              <div className="flex flex-col space-y-6 pt-8">
                {["About", "Skills", "Experience", "Projects", "Contact"].map((item, index) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-white/80 hover:text-white transition-all duration-500 py-4 px-6 rounded-2xl hover:bg-white/10 text-lg backdrop-blur-sm cursor-pointer border border-transparent hover:border-white/20 transform hover:scale-105"
                    onMouseEnter={() => handleMouseEnter("link")}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => {
                      e.preventDefault()
                      handleButtonClick(item.toLowerCase(), "scroll")
                      setIsMenuOpen(false)
                    }}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section id="hero" className="pt-32 pb-24 px-6 relative min-h-screen flex items-center" ref={heroRef}>
        <div className="container mx-auto text-center relative z-10">
          <div
            className={`max-w-7xl mx-auto transition-all duration-2000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            {/* Enhanced Status Badge */}
            <div className="mb-12">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-white/10 via-blue-500/20 to-purple-500/10 backdrop-blur-2xl text-white px-8 py-4 rounded-full text-lg font-medium mb-8 border border-white/30 shadow-2xl group hover:bg-white/20 transition-all duration-500 cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-75" />
                </div>
                <span className="relative z-10">Driving AI Innovation in HR</span>
                <div className="relative">
                  <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
                  <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 animate-ping" />
                </div>
              </div>
            </div>

            {/* Enhanced Name Display */}
            <div className="relative mb-12">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-6 leading-tight relative">
                Kashif Mujeeb
                <div className="absolute -top-8 -right-8 w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce hidden md:block shadow-2xl opacity-80" />
                <div className="absolute top-1/2 -left-12 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rotate-45 animate-pulse hidden md:block shadow-xl opacity-60" />
              </h1>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl opacity-50 animate-pulse" />
            </div>

            {/* Enhanced Typing Animation */}
            <div className="mb-8 h-20 flex items-center justify-center">
              <p className="text-3xl md:text-4xl text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text font-medium relative">
                {typingText}
                <span className="animate-pulse text-white ml-1 text-4xl">|</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl opacity-50" />
              </p>
            </div>

            <p className="text-xl text-white/90 mb-16 max-w-5xl mx-auto leading-relaxed font-light">
              A Science & Engineering Associate in HR, specializing as an
              <span className="text-blue-300 font-medium"> AI Engineer</span>. Passionate about applying
              <span className="text-purple-300 font-medium"> machine learning</span> and
              <span className="text-indigo-300 font-medium"> artificial intelligence</span> to revolutionize human
              resources and create innovative solutions for the future of work.
            </p>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-12 py-6 rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-500 border-0 group relative overflow-hidden text-lg font-medium"
                onMouseEnter={() => handleMouseEnter("button")}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleButtonClick("https://www.linkedin.com/in/kashif-mujeeb-64789616a/")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                <Linkedin className="mr-4 h-7 w-7 relative z-10" />
                <span className="relative z-10">Let's Connect & Learn</span>
                <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform duration-500 relative z-10" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/40 hover:border-white/60 px-12 py-6 bg-white/10 backdrop-blur-2xl text-white hover:bg-white/20 rounded-2xl transition-all duration-500 transform hover:scale-110 group relative overflow-hidden text-lg font-medium shadow-2xl"
                onMouseEnter={() => handleMouseEnter("button")}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleButtonClick("https://github.com/Kashifmujeeb17")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Code className="mr-4 h-7 w-7 relative z-10" />
                <span className="relative z-10">View My Projects</span>
              </Button>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                {
                  number: "2024",
                  label: "Graduation Year",
                  icon: GraduationCap,
                  gradient: "from-blue-500 to-cyan-500",
                  description: "B.E. Computer Systems Engineering",
                },
                {
                  number: "AI Engineer",
                  label: "Current Role",
                  icon: Brain,
                  gradient: "from-purple-500 to-pink-500",
                  description: "Science & Engineering Associate",
                },
                {
                  number: "HR Tech",
                  label: "Specialization",
                  icon: Users,
                  gradient: "from-green-500 to-emerald-500",
                  description: "AI in Human Resources",
                },
                {
                  number: "ML/AI",
                  label: "Core Skills",
                  icon: Zap,
                  gradient: "from-orange-500 to-red-500",
                  description: "Machine Learning & AI",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group relative p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-700 transform hover:scale-110 shadow-2xl cursor-pointer overflow-hidden"
                  onMouseEnter={() => handleMouseEnter("card")}
                  onMouseLeave={handleMouseLeave}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-blue-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 relative overflow-hidden`}
                  >
                    <stat.icon className="h-8 w-8 text-white relative z-10" />
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="text-xl font-bold text-white mb-3 relative z-10">{stat.number}</div>
                  <div className="text-white/80 text-sm mb-2 relative z-10">{stat.label}</div>
                  <div className="text-white/60 text-xs relative z-10">{stat.description}</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-full group-hover:translate-x-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer group"
          onMouseEnter={() => handleMouseEnter("link")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleButtonClick("about", "scroll")}
        >
          <div className="flex flex-col items-center space-y-4 animate-bounce">
            <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center group-hover:border-white transition-colors duration-500 relative overflow-hidden">
              <div className="w-2 h-4 bg-gradient-to-b from-blue-400 via-purple-400 to-indigo-400 rounded-full mt-2 animate-pulse shadow-lg" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <ChevronDown className="h-6 w-6 text-white/80 group-hover:text-white transition-colors duration-500 animate-pulse" />
            <div className="text-white/60 text-sm group-hover:text-white/80 transition-colors duration-300">
              Discover my journey
            </div>
          </div>
        </div>

        {/* Time Display */}
        <div className="absolute top-24 right-8 text-white/60 text-sm font-mono bg-white/10 backdrop-blur-xl px-4 py-2 rounded-lg border border-white/20">
          {currentTime.toLocaleTimeString()}
        </div>
      </section>

      {/* Enhanced About Section */}
      <section
        id="about"
        ref={aboutRef}
        className={`py-24 px-6 relative bg-gradient-to-b from-transparent to-black/20 transition-all duration-1000 ease-out ${aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
      >
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-white/10 via-blue-500/20 to-purple-500/10 backdrop-blur-2xl text-white px-8 py-4 rounded-full text-lg font-medium mb-12 border border-white/30 shadow-2xl">
                <Book className="h-6 w-6 text-blue-400 animate-pulse" />
                <span>About Me</span>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-12 leading-tight">
                AI Engineer | HR-AI Innovator
              </h2>
              <p className="text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
                Passionate about applying AI and machine learning to transform human resources and create innovative
                solutions
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
              <div className="space-y-10">
                {[
                  {
                    icon: Rocket,
                    title: "Current Role - AI Engineer",
                    description:
                      "Working as a Science & Engineering Associate in HR as an AI Engineer, where I'm applying my knowledge of machine learning and artificial intelligence to develop innovative HR solutions, automate processes, and create data-driven insights for better decision making.",
                    gradient: "from-blue-500 to-purple-600",
                    features: ["AI Development", "HR Automation", "Data Analysis", "Machine Learning"],
                  },
                  {
                    icon: GraduationCap,
                    title: "Academic Foundation",
                    description:
                      "Holds a B.E in Computer Systems Engineering, specializing in AI and machine learning. Applies strong theoretical knowledge to real-world HR challenges, contributing to the digital transformation of human resources through innovative technology solutions.",
                    gradient: "from-purple-500 to-pink-600",
                    features: ["Computer Systems", "AI/ML Focus", "Problem Solving", "Innovation Mindset"],
                  },
                ].map((item, index) => (
                  <Card
                    key={index}
                    className="bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/20 transition-all duration-700 transform hover:scale-105 group shadow-2xl cursor-pointer relative overflow-hidden"
                    onMouseEnter={() => handleMouseEnter("card")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-blue-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="p-10">
                      <div className="flex items-start space-x-6">
                        <div
                          className={`w-20 h-20 bg-gradient-to-r ${item.gradient} rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden`}
                        >
                          <item.icon className="h-10 w-10 text-white relative z-10" />
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{item.title}</h3>
                          <p className="text-white/80 leading-relaxed mb-6 relative z-10">{item.description}</p>
                          <div className="flex flex-wrap gap-3">
                            {item.features.map((feature) => (
                              <Badge
                                key={feature}
                                className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer backdrop-blur-sm px-4 py-2 text-sm"
                                onMouseEnter={() => handleMouseEnter("link")}
                                onMouseLeave={handleMouseLeave}
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-10">
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-2xl">
                  <h3 className="text-2xl font-bold text-white mb-10 flex items-center">
                    <BarChart3 className="h-8 w-8 mr-4 text-blue-400" />
                    Technical Skills Progress
                  </h3>
                  <div className="space-y-8">
                    {[
                      { skill: "Python Programming", level: 90, color: "from-green-500 to-emerald-500" },
                      { skill: "Machine Learning", level: 85, color: "from-purple-500 to-pink-500" },
                      { skill: "Data Analysis", level: 82, color: "from-blue-500 to-cyan-500" },
                      { skill: "HR Domain Knowledge", level: 75, color: "from-orange-500 to-red-500" },
                    ].map((item, index) => (
                      <div key={index} className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium text-lg">{item.skill}</span>
                          <span className="text-blue-300 font-bold text-xl">{item.level}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm shadow-inner">
                          <div
                            className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-2000 ease-out shadow-lg relative overflow-hidden`}
                            style={{ width: `${item.level}%` }}
                          >
                            <div className="absolute inset-0 bg-white/30 animate-pulse" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-shimmer" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      icon: Brain,
                      title: "AI/ML",
                      subtitle: "Core Expertise",
                      gradient: "from-purple-500 to-pink-600",
                    },
                    {
                      icon: Code,
                      title: "Programming",
                      subtitle: "Python & More",
                      gradient: "from-green-500 to-emerald-600",
                    },
                    {
                      icon: Users,
                      title: "HR Tech",
                      subtitle: "Domain Focus",
                      gradient: "from-blue-500 to-indigo-600",
                    },
                    {
                      icon: Zap,
                      title: "Innovation",
                      subtitle: "Forward-Thinking",
                      gradient: "from-orange-500 to-red-600",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="text-center p-8 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-110 group shadow-2xl cursor-pointer relative overflow-hidden"
                      onMouseEnter={() => handleMouseEnter("card")}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 relative overflow-hidden`}
                      >
                        <item.icon className="h-8 w-8 text-white relative z-10" />
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="text-lg font-bold text-white mb-2 relative z-10">{item.title}</div>
                      <div className="text-white/70 text-sm relative z-10">{item.subtitle}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Skills Section */}
      <section
        id="skills"
        ref={skillsRef}
        className={`py-24 px-6 relative bg-gradient-to-b from-transparent to-black/20 transition-all duration-1000 ease-out ${skillsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
      >
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-white/10 via-blue-500/20 to-purple-500/10 backdrop-blur-2xl text-white px-8 py-4 rounded-full text-lg font-medium mb-12 border border-white/30 shadow-2xl">
                <Brain className="h-6 w-6 text-purple-400 animate-pulse" />
                <span>My Skills</span>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-12 leading-tight">
                Technical Expertise & HR Domain
              </h2>
              <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
                Proficient in a range of technologies and methodologies, with a strong focus on AI, Machine Learning,
                and their application in Human Resources.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-10 flex items-center">
                  <BarChart3 className="h-8 w-8 mr-4 text-blue-400" />
                  Technical Skills Progress
                </h3>
                <div className="space-y-8">
                  {[
                    { skill: "Python Programming", level: 90, color: "from-green-500 to-emerald-500" },
                    { skill: "Machine Learning", level: 85, color: "from-purple-500 to-pink-500" },
                    { skill: "Data Analysis", level: 82, color: "from-blue-500 to-cyan-500" },
                    { skill: "HR Domain Knowledge", level: 75, color: "from-orange-500 to-red-500" },
                  ].map((item, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium text-lg">{item.skill}</span>
                        <span className="text-blue-300 font-bold text-xl">{item.level}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm shadow-inner">
                        <div
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-2000 ease-out shadow-lg relative overflow-hidden`}
                          style={{ width: `${item.level}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-pulse" />
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-shimmer" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    icon: Brain,
                    title: "AI/ML",
                    subtitle: "Core Expertise",
                    gradient: "from-purple-500 to-pink-600",
                  },
                  {
                    icon: Code,
                    title: "Programming",
                    subtitle: "Python & More",
                    gradient: "from-green-500 to-emerald-600",
                  },
                  {
                    icon: Users,
                    title: "HR Tech",
                    subtitle: "Domain Focus",
                    gradient: "from-blue-500 to-indigo-600",
                  },
                  {
                    icon: Zap,
                    title: "Innovation",
                    subtitle: "Forward-Thinking",
                    gradient: "from-orange-500 to-red-600",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center p-8 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-110 group shadow-2xl cursor-pointer relative overflow-hidden"
                    onMouseEnter={() => handleMouseEnter("card")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 relative overflow-hidden`}
                    >
                      <item.icon className="h-8 w-8 text-white relative z-10" />
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="text-lg font-bold text-white mb-2 relative z-10">{item.title}</div>
                    <div className="text-white/70 text-sm relative z-10">{item.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Experience Section */}
      <section
        id="experience"
        ref={experienceRef}
        className={`py-24 px-6 relative bg-gradient-to-b from-transparent to-black/20 transition-all duration-1000 ease-out ${experienceInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
      >
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-white/10 via-blue-500/20 to-purple-500/10 backdrop-blur-2xl text-white px-8 py-4 rounded-full text-lg font-medium mb-12 border border-white/30 shadow-2xl">
                <Rocket className="h-6 w-6 text-orange-400 animate-pulse" />
                <span>My Experience & Achievements</span>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-12 leading-tight">
                Professional Journey & Milestones
              </h2>
              <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
                Highlighting my academic background, professional roles, and key certifications that shape my expertise
                in HR-AI.
              </p>
            </div>

            {/* Achievements Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/20 transition-all duration-700 transform hover:scale-110 group shadow-2xl cursor-pointer relative overflow-hidden"
                  onMouseEnter={() => handleMouseEnter("card")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-18 h-18 bg-gradient-to-r ${achievement.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 relative overflow-hidden`}
                    >
                      <achievement.icon className="h-9 w-9 text-white relative z-10" />
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h4 className="font-bold text-white mb-3 text-lg relative z-10">{achievement.title}</h4>
                    <p className="text-white/70 mb-3 text-sm relative z-10">{achievement.organization}</p>
                    <p className="text-blue-300 text-sm font-medium mb-3 relative z-10">{achievement.year}</p>
                    <p className="text-white/60 text-xs relative z-10">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Projects Section */}
      <section
        id="projects"
        ref={projectsRef}
        className={`py-24 px-6 relative bg-gradient-to-b from-transparent to-black/20 transition-all duration-1000 ease-out ${projectsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
      >
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-white/10 via-blue-500/20 to-purple-500/10 backdrop-blur-2xl text-white px-8 py-4 rounded-full text-lg font-medium mb-12 border border-white/30 shadow-2xl">
                <Code className="h-6 w-6 text-green-400 animate-pulse" />
                <span>My HR-AI Projects</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-12 leading-tight">
                Driving Innovation in Human Resources
              </h2>
              <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
                Showcasing key projects where AI and Machine Learning are applied to solve real-world HR challenges.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {hrProjects.map((project, index) => (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/20 transition-all duration-700 transform hover:scale-105 group shadow-2xl cursor-pointer relative overflow-hidden"
                  onMouseEnter={() => handleMouseEnter("card")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-blue-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-8">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${project.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden`}
                    >
                      <project.icon className="h-8 w-8 text-white relative z-10" />
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{project.title}</h3>
                    <p className="text-white/80 leading-relaxed mb-6 text-sm relative z-10">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer backdrop-blur-sm px-3 py-1 text-xs"
                          onMouseEnter={() => handleMouseEnter("link")}
                          onMouseLeave={handleMouseLeave}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-blue-300 font-medium text-sm mb-2 relative z-10">Impact: {project.impact}</div>
                    <div className="text-purple-300 font-medium text-sm relative z-10">
                      Status: {project.status} ({project.type})
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Contact Section */}
      <section
        id="contact"
        ref={contactRef}
        className={`py-24 px-6 relative bg-gradient-to-b from-transparent to-black/20 transition-all duration-1000 ease-out ${contactInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
      >
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-white/10 via-blue-500/20 to-purple-500/10 backdrop-blur-2xl text-white px-8 py-4 rounded-full text-lg font-medium mb-12 border border-white/30 shadow-2xl">
              <Mail className="h-6 w-6 text-cyan-400 animate-pulse" />
              <span>Get in Touch</span>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-12 leading-tight">
              Let's Connect & Collaborate
            </h2>
            <p className="text-xl text-white/80 mb-12 leading-relaxed font-light">
              I'm always open to discussing new projects, innovative ideas in HR-AI, or opportunities to contribute to
              meaningful work. Feel free to reach out!
            </p>
            <div className="flex justify-center space-x-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-12 py-6 rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-500 border-0 group relative overflow-hidden text-lg font-medium"
                onMouseEnter={() => handleMouseEnter("button")}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleButtonClick("mailto:your.email@example.com")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                <Mail className="mr-4 h-7 w-7 relative z-10" />
                <span className="relative z-10">Send Me an Email</span>
                <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform duration-500 relative z-10" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-20 px-6 bg-gradient-to-t from-black via-slate-900 to-transparent border-t border-white/10">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-700 to-indigo-800 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                <span className="text-white font-bold text-2xl z-10">K</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
              </div>
              <div className="text-left">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Kashif Mujeeb
                </h3>
                <p className="text-blue-300 text-lg">AI Engineer | HR-AI Specialist</p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-300 text-sm">Science & Engineering Associate</span>
                </div>
              </div>
            </div>
            <p className="text-white/80 mb-12 leading-relaxed max-w-4xl mx-auto text-xl font-light">
              Passionate about applying AI and machine learning to transform human resources. Dedicated to contributing
              innovative solutions and learning from industry experts while building the future of HR technology.
            </p>
            <div className="flex justify-center space-x-8 mb-12">
              {[
                { icon: Github, link: "https://github.com/Kashifmujeeb17", gradient: "from-gray-600 to-gray-800" },
                {
                  icon: Linkedin,
                  link: "https://www.linkedin.com/in/kashif-mujeeb-64789616a/",
                  gradient: "from-blue-500 to-blue-700",
                },
                { icon: Mail, link: "mailto:", gradient: "from-green-500 to-emerald-600" },
              ].map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="lg"
                  className={`text-white hover:text-white w-16 h-16 rounded-2xl transition-all duration-500 transform hover:scale-125 bg-gradient-to-r ${social.gradient} hover:shadow-2xl cursor-pointer relative overflow-hidden group`}
                  onMouseEnter={() => handleMouseEnter("button")}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleButtonClick(social.link)}
                >
                  <social.icon className="h-8 w-8 relative z-10" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              ))}
            </div>
            <div className="border-t border-white/20 pt-12">
              <p className="text-white/60 text-lg">© 2024 Kashif Mujeeb. Dedicated to HR-AI innovation.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
