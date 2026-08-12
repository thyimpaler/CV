import { Backdrop } from "@/components/Backdrop"
import { RotatingBadge } from "@/components/Furniture"
import { ScrollProgress } from "@/components/ScrollProgress"
import { Nav } from "@/components/sections/Nav"
import { Hero } from "@/components/sections/Hero"
import { Ticker } from "@/components/sections/Ticker"
import { About } from "@/components/sections/About"
import { Experience } from "@/components/sections/Experience"
import { Stats } from "@/components/sections/Stats"
import { Projects } from "@/components/sections/Projects"
import { Toolkit } from "@/components/sections/Toolkit"
import { Footer } from "@/components/sections/Footer"
import { Coda } from "@/components/sections/Coda"

function App() {
  return (
    <>
      <ScrollProgress />
      <Backdrop />
      <Nav />
      <RotatingBadge />

      {/* Sections carry their own rules and rhythm, so no divider elements
          between them — a page stitched together with <hr>s reads as blocks
          stacked rather than a continuous document. */}
      <main className="relative z-10">
        <Hero />
        <Ticker />
        <About />
        <Experience />
        <Stats />
        <Projects />
        <Toolkit />
        <Footer />
        <Coda />
      </main>
    </>
  )
}

export default App
