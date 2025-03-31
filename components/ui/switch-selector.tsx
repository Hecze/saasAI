"use client"

import { useState, type ReactNode } from "react"

/**
 * SwitchSelector Component
 *
 * A reusable component that renders a toggle switch between two options.
 *
 * @param {Object} props - Component props
 * @param {string} props.option1Label - Label for the first option
 * @param {string} props.option2Label - Label for the second option
 * @param {ReactNode} props.option1Icon - Optional icon for the first option
 * @param {ReactNode} props.option2Icon - Optional icon for the second option
 * @param {boolean} props.defaultSelected - Default selected option (false for option1, true for option2)
 * @param {(selected: boolean) => void} props.onChange - Callback when selection changes
 */
interface SwitchSelectorProps {
  option1Label: string
  option2Label: string
  option1Icon?: ReactNode
  option2Icon?: ReactNode
  defaultSelected?: boolean
  onChange: (selected: boolean) => void
}

export default function SwitchSelector({
  option1Label,
  option2Label,
  option1Icon,
  option2Icon,
  defaultSelected = false,
  onChange,
}: SwitchSelectorProps) {
  const [isSecondOptionSelected, setIsSecondOptionSelected] = useState(defaultSelected)

  // Handle option 1 click
  const handleOption1Click = () => {
    setIsSecondOptionSelected(false)
    onChange(false)
  }

  // Handle option 2 click
  const handleOption2Click = () => {
    setIsSecondOptionSelected(true)
    onChange(true)
  }

  return (
    <div className="flex justify-center mb-4">
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-full p-1 flex relative">
        <button
          className={`pl-4 pr-6 py-3 rounded-full text-sm font-medium transition-colors z-10 relative flex items-center ${
            !isSecondOptionSelected ? "text-white" : "text-gray-400 hover:text-white"
          }`}
          onClick={handleOption1Click}
        >
          {option1Icon && <span className="mr-2">{option1Icon}</span>}
          {option1Label}
        </button>
        <button
          className={`px-4 py-3 rounded-full text-sm font-medium transition-colors z-10 relative flex items-center ${
            isSecondOptionSelected ? "text-white" : "text-gray-400 hover:text-white"
          }`}
          onClick={handleOption2Click}
        >
          {option2Icon && <span className="mr-2">{option2Icon}</span>}
          {option2Label}
        </button>
        <div
          className="absolute top-1 bottom-1 left-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 ease-in-out"
          style={{
            width: "50%",
            transform: isSecondOptionSelected ? "translateX(100%)" : "translateX(0)",
          }}
        ></div>
      </div>
    </div>
  )
}

