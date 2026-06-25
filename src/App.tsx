import { Backdrop } from "@/components/Backdrop"
import { ScrollProgress } from "@/components/ScrollProgress"
import { Nav } from "@/components/sections/Nav"
import { Hero } from "@/components/sections/Hero"
import { Ticker } from "@/components/sections/Ticker"
import { Experience } from "@/components/sections/Experience"
import { Stats } from "@/components/sections/Stats"
import { Toolkit } from "@/components/sections/Toolkit"
import { Footer } from "@/components/sections/Footer"

function App() {
  return (
    <>
      <ScrollProgress />
      <Backdrop />
      <Nav />

      <main className="relative">
        <Hero />
        <Ticker />
        <Experience />
        <div className="mx-auto h-px max-w-[1100px] bg-border" />
        <Stats />
        <div className="mx-auto h-px max-w-[1100px] bg-border" />
        <Toolkit />
        <div className="mx-auto h-px max-w-[1100px] bg-border" />
        <Footer />
      </main>
    </>
  )
}

export default App
