import type { Metadata } from 'next'
import '../globals.css'
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"


export const metadata: Metadata = {
  title: 'StoryboardToVideo',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <section className="w-screen min-h-screen bg-app-bg">
        <Navbar />
       {children}
        <Footer />
      </section>

  )
}
