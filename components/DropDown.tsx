"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

interface Option {
  value: string
  label: string
}

interface OptionsProps {
  options: Option[]
  isTurma?: boolean
}

export default function Dropdown({ options, isTurma = false }: OptionsProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const [position, setPosition] = React.useState<string | undefined>(() => {
    return isTurma ? undefined : options[0]?.value
  })

  const dropdown = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function clicar(event: MouseEvent) {
      if (dropdown.current && !dropdown.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", clicar)
    return () => document.removeEventListener("mousedown", clicar)
  }, [])

  const selectedOption = options.find((opt) => opt.value === position)

  const renderLabel = () => {
    if (selectedOption) {
      return selectedOption.label
    }
    return isTurma ? "Turma" : options[0]?.label
  }

  return (
    <div
      className={`relative font-(family-name:--font-text-me-one) text-xl ${
        isTurma ? "w-full block" : "inline-block text-left"
      }`}
      ref={dropdown}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-4 py-1.5 bg-[#D9D9D9] rounded-[30px] text-[#433F3F] hover:bg-[#FFFDFA] focus:outline-none transition-colors ${
          isTurma ? "w-full" : "min-w-[140px]"
        }`}
      >
        <span>{renderLabel()}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`absolute left-1/2 -translate-x-1/2 mt-2 rounded-[30px] text-[#433F3F] bg-[#D9D9D9] shadow-lg focus:outline-none z-10 p-1.5 
          transition-all duration-200 ease-out origin-top ${
            isTurma
              ? "w-full max-h-[150px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : "min-w-[140px]"
          }
          ${
            isOpen
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }`}
      >
        <div className="py-1 flex flex-col gap-0.5" role="radiogroup">
          {options.map((option) => {
            const isSelected = position === option.value
            return (
              <label
                key={option.value}
                onClick={() => {
                  setPosition(option.value)
                  setIsOpen(false)
                }}
                className={`flex items-center px-2.5 py-0.5 cursor-pointer rounded-[70px] text-[#433F3F] transition-colors ${
                  isSelected ? "bg-[#FFFDFA]" : "hover:bg-[#FFFDFA]"
                }`}
              >
                <span>{option.label}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}