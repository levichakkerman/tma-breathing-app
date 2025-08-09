"use client"

import { motion } from "framer-motion"

interface ProgramSelectionProps {
  onSelect: (program: string) => void
}

export default function ProgramSelection({ onSelect }: ProgramSelectionProps) {
  const programs = [
    {
      id: "calm",
      name: "Успокоение",
      description: "Снижение тревоги и стресса",
      pattern: "4-7-8",
    },
    {
      id: "focus",
      name: "Концентрация",
      description: "Повышение внимания и фокуса",
      pattern: "4-4-4-4",
    },
    {
      id: "relax",
      name: "Расслабление",
      description: "Глубокое расслабление тела",
      pattern: "4-7-8",
    },
    {
      id: "sleep",
      name: "Сон",
      description: "Подготовка к спокойному сну",
      pattern: "4-7-8",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mb-2" style={{ color: "#fbf9fa" }}>
          <span className="bg-gradient-to-r from-[#bfb1c7] to-[#e38dac] bg-clip-text text-transparent">
            Дыхательные практики
          </span>
        </h1>
        <p className="text-sm opacity-80">Выберите программу для начала</p>
      </div>

      <div className="grid gap-4">
        {programs.map((program) => (
          <motion.button
            key={program.id}
            onClick={() => onSelect(program.id)}
            className="w-full text-left p-4 rounded-xl relative overflow-hidden"
            style={{
              background: "rgba(251,249,250,0.32)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(251,249,250,0.1)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -2 }}
          >
            <div className="relative z-10">
              <h3 className="font-medium text-lg mb-1">{program.name}</h3>
              <p className="text-sm opacity-70">{program.description}</p>
              <div
                className="mt-2 text-xs inline-block px-2 py-1 rounded-full"
                style={{ background: "rgba(225,142,181,0.2)", color: "#e18eb5" }}
              >
                {program.pattern}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
