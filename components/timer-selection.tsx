"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"

interface TimerSelectionProps {
  onSelect: (minutes: number) => void
  onBack: () => void
  program: string
}

export default function TimerSelection({ onSelect, onBack, program }: TimerSelectionProps) {
  const [minutes, setMinutes] = useState(5)

  const programNames: Record<string, string> = {
    calm: "Успокоение",
    focus: "Концентрация",
    relax: "Расслабление",
    sleep: "Сон",
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    setMinutes(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full mr-2" style={{ background: "rgba(0,0,0,0.08)" }}>
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-xl font-medium">Выберите время</h2>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-lg mb-1">
          Программа: <span className="font-medium">{programNames[program]}</span>
        </h3>
        <p className="text-sm opacity-70">Установите длительность сеанса</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <span className="text-5xl font-semibold" style={{ color: "#e38dac" }}>
            {minutes}
          </span>
          <span className="text-xl ml-1">мин</span>
        </div>

        <input
          type="range"
          min="1"
          max="30"
          value={minutes}
          onChange={handleChange}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: "linear-gradient(to right, #e18eb5, #bfb1c7)",
            WebkitAppearance: "none",
          }}
        />

        <style jsx>{`
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #ee8fbe;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          }
        `}</style>

        <div className="flex justify-between mt-2 text-xs opacity-70">
          <span>1 мин</span>
          <span>15 мин</span>
          <span>30 мин</span>
        </div>
      </div>

      <motion.button
        onClick={() => onSelect(minutes)}
        className="w-full py-3 rounded-xl text-white font-medium mt-8"
        style={{ background: "#ee8fbe" }}
        whileTap={{ scale: 0.98 }}
      >
        Начать
      </motion.button>
    </div>
  )
}
