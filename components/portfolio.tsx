'use client'

import React, { useState, useRef, useMemo, useEffect, lazy, Suspense } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Code, Github, Linkedin, Mail, Moon, Sun, Zap, Menu } from "lucide-react"
import Link from "next/link"
import Image from 'next/image'
import { motion, useScroll, useTransform, Variants } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useDarkMode } from '@/hooks/useDarkMode'
import dynamic from 'next/dynamic'

// Add this custom debounce function
function debounce<F extends (...args: unknown[]) => void>(func: F, wait: number): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface AnimatedSectionProps {
  children: React.ReactNode;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '0px 0px 50px 0px',
  })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

const GradientBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 opacity-20" />
    </div>
  )
}

const DynamicParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.01], [0, 1])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 z-50 origin-left"
      style={{ scaleX, opacity }}
    />
  )
}

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Add this near the top of your file, outside of any component
const worker = typeof Worker !== 'undefined' 
  ? new Worker(new URL('../workers/heavyComputation.worker.ts', import.meta.url))
  : null;

export const Portfolio = () => {
  const [darkMode, setDarkMode] = useDarkMode()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Add refs for each section
  const aboutRef = useRef<HTMLElement>(null)
  const skillsRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  // Smooth scroll function
  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleDarkMode = () => {
    if (darkMode !== null) {
      setDarkMode(!darkMode)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Implement form validation and submission logic here
  }

  const handleScroll = debounce(() => {
    // Scroll handling logic
  }, 100)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (worker) {
      worker.onmessage = function(e) {
        console.log('Result from worker:', e.data);
        // Handle the result here
      };
    }
  }, []);

  const performHeavyComputation = (data: unknown) => {
    if (worker) {
      worker.postMessage(data);
    } else {
      console.warn('Web Workers are not supported in this environment');
    }
  };

  const SkillCards = useMemo(() => (
    <motion.div 
      className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4"
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
    >
      {["JavaScript", "React", "Node.js", "Python", "SQL", "Git", "AWS", "Docker", "TypeScript", "GraphQL"].map((skill) => (
        <motion.div key={skill} variants={fadeIn}>
          <Card className="flex flex-col items-center justify-center p-2 sm:p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md hover:bg-white/40 dark:hover:bg-gray-700/40 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50">
            <Code className="h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2 text-purple-600 dark:text-purple-400" />
            <p className="text-xs sm:text-sm font-medium">{skill}</p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  ), [])

  const LazyProjectsSection = dynamic(() => import('@/components/ProjectsSection'), {
    loading: () => <p>Loading projects...</p>
  })

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {darkMode !== null && (
        <>
          <GradientBackground />
          <div className="relative min-h-screen flex flex-col bg-white/10 dark:bg-gray-950/90 text-gray-800 dark:text-gray-100 transition-colors duration-300 backdrop-blur-sm">
            {/* Header */}
            <motion.header
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="sticky top-0 z-40 w-full border-b border-gray-200/20 dark:border-gray-700/20 bg-white/10 dark:bg-gray-900/10 backdrop-blur-md supports-[backdrop-filter]:bg-white/5 dark:supports-[backdrop-filter]:bg-gray-900/5"
            >
              <div className="container mx-auto px-4 py-2 sm:py-4">
                <div className="flex items-center justify-between">
                  <Link className="flex items-center space-x-2" href="/">
                    <Zap className="text-purple-600 dark:text-purple-400" />
                    <span className="text-sm sm:text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">delfigore.dev</span>
                  </Link>
                  <button
                    className="lg:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                  <nav className={`hidden lg:flex items-center space-x-4`}>
                    <Button
                      variant="ghost"
                      onClick={() => scrollToSection(aboutRef)}
                      className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      About
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => scrollToSection(skillsRef)}
                      className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      Skills
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => scrollToSection(projectsRef)}
                      className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      Projects
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => scrollToSection(contactRef)}
                      className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      Contact
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={toggleDarkMode}
                      className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      <span className="sr-only">{darkMode ? 'Light mode' : 'Dark mode'}</span>
                    </Button>
                  </nav>
                </div>
                {/* Mobile menu */}
                <nav className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden mt-4`}>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        scrollToSection(aboutRef)
                        setIsMenuOpen(false)
                      }}
                      className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      About
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        scrollToSection(skillsRef)
                        setIsMenuOpen(false)
                      }}
                      className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      Skills
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        scrollToSection(projectsRef)
                        setIsMenuOpen(false)
                      }}
                      className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      Projects
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        scrollToSection(contactRef)
                        setIsMenuOpen(false)
                      }}
                      className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      Contact
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        toggleDarkMode()
                        setIsMenuOpen(false)
                      }}
                      className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                    >
                      {darkMode ? (
                        <>
                          <Sun className="h-5 w-5 mr-2" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Moon className="h-5 w-5 mr-2" />
                          Dark Mode
                        </>
                      )}
                    </Button>
                  </div>
                </nav>
              </div>
            </motion.header>

            <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
              {/* Hero Section */}
              <AnimatedSection>
                <section className="py-4 sm:py-8 md:py-16 lg:py-24 xl:py-32 flex items-center justify-center min-h-[calc(100vh-4rem)]">
                  <div className="text-center px-4 sm:px-6 md:px-8">
                    <motion.h1
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400"
                    >
                      Welcome to{" "}
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="inline-block"
                      >
                        delfigore.dev
                      </motion.span>
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="mt-2 sm:mt-4 mx-auto max-w-[700px] text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl"
                    >
                      Crafting elegant solutions through code. Full-stack developer passionate about creating impactful web experiences.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="mt-4 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-4"
                    >
                      <Button
                        onClick={() => scrollToSection(projectsRef)}
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 rounded-md text-sm sm:text-base"
                      >
                        View Projects
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => scrollToSection(contactRef)}
                        className="w-full sm:w-auto border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-400 dark:hover:text-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                      >
                        Contact Me
                      </Button>
                    </motion.div>
                  </div>
                </section>
              </AnimatedSection>

              {/* About Me Section */}
              <AnimatedSection>
                <section ref={aboutRef} className="py-12 md:py-24 lg:py-32 flex flex-col items-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 text-center">About Me</h2>
                  <p className="mt-4 max-w-[700px] text-gray-600 dark:text-gray-400 text-center backdrop-blur-md bg-white/30 dark:bg-gray-800/30 p-6 rounded-lg shadow-lg text-sm sm:text-base">
                    I'm a passionate full-stack developer with a keen eye for design and a love for clean, efficient code. With years of experience in web development, I specialize in creating responsive and user-friendly applications that solve real-world problems.
                  </p>
                </section>
              </AnimatedSection>

              {/* Skills Section */}
              <AnimatedSection>
                <section ref={skillsRef} className="py-12 md:py-24 lg:py-32 flex flex-col items-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 text-center">Skills & Technologies</h2>
                  {SkillCards}
                </section>
              </AnimatedSection>

              {/* Projects Section */}
              <AnimatedSection>
                <section ref={projectsRef} className="py-12 md:py-24 lg:py-32 flex flex-col items-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 text-center">Featured Projects</h2>
                  <Suspense fallback={<div>Loading projects...</div>}>
                    <LazyProjectsSection />
                  </Suspense>
                </section>
              </AnimatedSection>

              {/* Contact Form */}
              <AnimatedSection>
                <section ref={contactRef} className="py-8 sm:py-12 md:py-24 lg:py-32 flex flex-col items-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 text-center">Get in Touch</h2>
                  <form onSubmit={handleSubmit} className="mt-4 sm:mt-8 space-y-4 w-full max-w-md bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 space-y-2">
                        <label htmlFor="name" className="text-sm text-gray-700 dark:text-gray-300">Name</label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your name" className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:border-purple-600 dark:focus:border-purple-400" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label htmlFor="email" className="text-sm text-gray-700 dark:text-gray-300">Email</label>
                        <Input id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Your email" type="email" className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:border-purple-600 dark:focus:border-purple-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm text-gray-700 dark:text-gray-300">Message</label>
                      <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Your message" className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 focus:border-purple-600 dark:focus:border-purple-400" />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                    >
                      Send Message
                    </Button>
                  </form>
                </section>
              </AnimatedSection>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200/20 dark:border-gray-700/20 bg-white/10 dark:bg-gray-900/10 backdrop-blur-md">
              <div className="container mx-auto px-4 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-center text-xs sm:text-sm leading-loose text-gray-600 dark:text-gray-400">
                  © 2024 delfigore.dev. All rights reserved.
                </p>
                <div className="flex gap-4">
                  <Link href="https://github.com/Delfigore" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                  <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                  <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Email</span>
                  </Link>
                </div>
              </div>
            </footer>
          </div>
          <div className="relative">
            <ScrollProgressBar />
            <Suspense fallback={<div>Loading...</div>}>
              <DynamicParticleBackground />
            </Suspense>
          </div>
        </>
      )}
    </div>
  )
}