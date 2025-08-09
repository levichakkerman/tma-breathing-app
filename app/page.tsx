"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ProgramSelection from "@/components/program-selection"
import TimerSelection from "@/components/timer-selection"
import BreathingExercise from "@/components/breathing-exercise"

export default function Home() {
  const [step, setStep] = useState<"program" | "timer" | "exercise">("program")
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
  const [duration, setDuration] = useState<number>(5) // minutes

  const handleProgramSelect = (program: string) => {
    setSelectedProgram(program)
    setStep("timer")
  }

  const handleTimerSelect = (minutes: number) => {
    setDuration(minutes)
    setStep("exercise")
  }

  const handleBack = () => {
    if (step === "timer") setStep("program")
    if (step === "exercise") setStep("timer")
  }

  const handleFinish = () => {
    setStep("program")
    setSelectedProgram(null)
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#fbf9fa" }}>
      <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === "program" && (
            <motion.div
              key="program"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <ProgramSelection onSelect={handleProgramSelect} />
            </motion.div>
          )}

          {step === "timer" && (
            <motion.div
              key="timer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <TimerSelection onSelect={handleTimerSelect} onBack={handleBack} program={selectedProgram || ""} />
            </motion.div>
          )}

          {step === "exercise" && (
            <motion.div
              key="exercise"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <BreathingExercise
                program={selectedProgram || ""}
                duration={duration}
                onBack={handleBack}
                onFinish={handleFinish}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
