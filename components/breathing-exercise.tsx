"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Pause, Play } from "lucide-react"

interface BreathingExerciseProps {
  program: string
  duration: number
  onBack: () => void
  onFinish: () => void
}

type BreathingPhase = "inhale" | "hold1" | "exhale" | "hold2"

interface ProgramPattern {
  inhale: number
  hold1: number
  exhale: number
  hold2: number
}

export default function BreathingExercise({ program, duration, onBack, onFinish }: BreathingExerciseProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("inhale")
  const [phaseTime, setPhaseTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Program patterns in seconds
  const patterns: Record<string, ProgramPattern> = {
    calm: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    focus: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 }, // Box breathing
    relax: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    sleep: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  }

  const pattern = patterns[program]
  const totalDuration = duration * 60 // Convert minutes to seconds

  const programNames: Record<string, string> = {
    calm: "Успокоение",
    focus: "Концентрация",
    relax: "Расслабление",
    sleep: "Сон",
  }

  const phaseMessages: Record<BreathingPhase, string> = {
    inhale: "Вдох",
    hold1: "Задержка",
    exhale: "Выдох",
    hold2: "Задержка",
  }

  // Calculate circle size based on phase
  const getCircleSize = () => {
    const smoothFactor = 0.05 // Фактор сглаживания

    switch (currentPhase) {
      case "inhale":
        // Более плавная функция анимации
        const inhaleProgress = phaseTime / pattern.inhale
        // Улучшенная функция плавности
        const inhaleEase =
          inhaleProgress < 0.2
            ? 4.5 * Math.pow(inhaleProgress, 2)
            : inhaleProgress > 0.8
              ? 1 - 4.5 * Math.pow(1 - inhaleProgress, 2)
              : 0.5 + (inhaleProgress - 0.5) * 1.25
        return 50 + 80 * inhaleEase
      case "hold1":
        // Добавляем небольшую пульсацию во время задержки
        return 130 + Math.sin(phaseTime * 3) * smoothFactor * 130
      case "exhale":
        // Более плавная функция анимации
        const exhaleProgress = phaseTime / pattern.exhale
        // Улучшенная функция плавности
        const exhaleEase =
          exhaleProgress < 0.2
            ? 4.5 * Math.pow(exhaleProgress, 2)
            : exhaleProgress > 0.8
              ? 1 - 4.5 * Math.pow(1 - exhaleProgress, 2)
              : 0.5 + (exhaleProgress - 0.5) * 1.25
        return 130 - 80 * exhaleEase
      case "hold2":
        // Добавляем небольшую пульсацию во время задержки
        return 50 + Math.sin(phaseTime * 3) * smoothFactor * 50
      default:
        return 90
    }
  }

  // Progress to next phase
  const nextPhase = () => {
    setPhaseTime(0)

    if (currentPhase === "inhale") {
      setCurrentPhase("hold1")
    } else if (currentPhase === "hold1") {
      setCurrentPhase("exhale")
    } else if (currentPhase === "exhale") {
      if (pattern.hold2 > 0) {
        setCurrentPhase("hold2")
      } else {
        setCurrentPhase("inhale")
        setCycleCount((prev) => prev + 1)
      }
    } else if (currentPhase === "hold2") {
      setCurrentPhase("inhale")
      setCycleCount((prev) => prev + 1)
    }
  }

  // Timer logic
  useEffect(() => {
    if (isPaused) return

    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const newElapsed = prev + 0.016
        if (newElapsed >= totalDuration) {
          clearInterval(intervalRef.current!)
          onFinish()
          return totalDuration
        }
        return newElapsed
      })

      setPhaseTime((prev) => {
        const newPhaseTime = prev + 0.016
        const currentPhaseDuration = pattern[currentPhase]

        if (newPhaseTime >= currentPhaseDuration) {
          nextPhase()
          return 0
        }

        return newPhaseTime
      })
    }, 16) // ~60fps для максимально плавной анимации

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, currentPhase, pattern, totalDuration])

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  const handleBack = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    onBack()
  }

  // Calculate progress percentage
  const progress = (elapsedTime / totalDuration) * 100

  // Format time remaining
  const formatTimeRemaining = () => {
    const remaining = Math.max(0, totalDuration - Math.floor(elapsedTime))
    const minutes = Math.floor(remaining / 60)
    const seconds = remaining % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-4">
        <button onClick={handleBack} className="p-2 rounded-full mr-2" style={{ background: "rgba(0,0,0,0.08)" }}>
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-lg font-medium">{programNames[program]}</h2>

        <div className="ml-auto">
          <button onClick={togglePause} className="p-2 rounded-full" style={{ background: "rgba(0,0,0,0.08)" }}>
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100 rounded-full mb-8">
        <div
          className="h-full rounded-full transition-all duration-300 ease-linear"
          style={{ width: `${progress}%`, background: "#e18eb5" }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Breathing circle */}
        {/* Внешний контейнер без 3D — создаёт отдельный stacking context */}
        <div
          className="relative mb-8"
          style={{ height: "280px", width: "280px", margin: "0 auto", isolation: "isolate" }}
        >
          {/* Внутренний 3D-контейнер только для слоёв круга */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Glow effect - placed first so it's behind the main circle */}
            <motion.div
            animate={{
              opacity: 0.6,
              scale: (getCircleSize() / 100) * 1.15,
            }}
            initial={{
              opacity: 0,
              scale: 0.5,
              borderRadius: "50%",
              width: "200px",
              height: "200px",
            }}
            transition={{
              scale: {
                type: "spring",
                damping: 25,
                stiffness: 80,
                restDelta: 0.001,
                delay: 0.05,
              },
              opacity: {
                duration: 1,
              },
            }}
            className="absolute rounded-full z-0"
            style={{
              background: "radial-gradient(circle, rgba(227,141,172,0.8) 0%, rgba(191,177,199,0.2) 70%)",
              filter: "blur(20px)",
              transformOrigin: "center center",
              zIndex: 0,
            }}
          />

            {/* Main circle */}
            <motion.div
            animate={{
              scale: getCircleSize() / 100,
              rotateY: currentPhase === "inhale" ? [0, 2, 0] : currentPhase === "exhale" ? [0, -2, 0] : 0,
              rotateX: currentPhase === "inhale" ? [0, 1, 0] : currentPhase === "exhale" ? [0, -1, 0] : 0,
            }}
            initial={{
              scale: 0.5,
              borderRadius: "50%",
              width: "200px",
              height: "200px",
            }}
            transition={{
              scale: {
                type: "spring",
                damping: 30,
                stiffness: 90,
                restDelta: 0.001,
                restSpeed: 0.001,
              },
              rotateY: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 3,
                ease: "easeInOut",
              },
              rotateX: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 4,
                ease: "easeInOut",
              },
            }}
            className="absolute rounded-full z-10"
            style={{
              background: "radial-gradient(circle, #e38dac 0%, #bfb1c7 100%)",
              boxShadow: "0 8px 32px rgba(227, 141, 172, 0.4)",
              transformOrigin: "center center",
              willChange: "transform",
              zIndex: 10,
            }}
            />
          </div>

          {/* Overlay для текста — отдельный слой вне 3D-контейнера */}
          <div className="absolute inset-0 grid place-items-center z-[60] pointer-events-none"
               style={{contain: "paint", willChange: "transform"}}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhase}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-white font-medium text-lg px-4 py-2 rounded-full shadow-sm"
                style={{
                  background: "rgba(0,0,0,0.25)",
                  backdropFilter: "blur(4px)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.35)",
                }}
              >
                {phaseMessages[currentPhase]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center">
          <div className="text-3xl font-semibold mb-2" style={{ color: "#e38dac" }}>
            {formatTimeRemaining()}
          </div>
          <div className="text-sm opacity-70">Циклов завершено: {cycleCount}</div>
        </div>
      </div>

      <motion.button
        onClick={onFinish}
        className="w-full py-3 rounded-xl text-white font-medium mt-8"
        style={{ background: "#ee8fbe" }}
        whileTap={{ scale: 0.98 }}
      >
        Завершить
      </motion.button>
    </div>
  )
}
