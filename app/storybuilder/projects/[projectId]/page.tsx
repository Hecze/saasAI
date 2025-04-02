"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProjectRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push('/storybuilder')
  }, [router])

  return null
}

