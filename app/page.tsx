"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Hero from "@/components/hero"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  )
}