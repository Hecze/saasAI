"use client"

import { useEffect, useState } from "react"

export default function TypewriterEffect({ isVisible = true }) {
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(150)

  const fullText = "Describe tu idea para un video..."
  const pauseTime = 2000 // 2 seconds pause when text is complete

  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      handleTyping()
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [text, isDeleting, isVisible])

  const handleTyping = () => {
    // Current index in the phrases array
    const i = loopNum % 1

    // Full text of current phrase
    const currentText = fullText

    // Calculate new text
    const newText = isDeleting ? currentText.substring(0, text.length - 1) : currentText.substring(0, text.length + 1)

    // Update text state
    setText(newText)

    // Typing speed control
    if (isDeleting) {
      setTypingSpeed(75) // Faster when deleting
    } else {
      setTypingSpeed(150) // Normal speed when typing
    }

    // Handle complete typing or deletion
    if (!isDeleting && newText === currentText) {
      // Pause at the end of typing
      setTypingSpeed(pauseTime)
      setIsDeleting(true)
    } else if (isDeleting && newText === "") {
      setIsDeleting(false)
      setLoopNum(loopNum + 1)
      setTypingSpeed(500) // Pause before starting to type again
    }
  }

  if (!isVisible) return null

  return (
    <span className="text-gray-400">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  )
}

