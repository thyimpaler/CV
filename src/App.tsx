import { Backdrop } from "@/components/Backdrop"
import { ScrollProgress } from "@/components/ScrollProgress"
import { IrisCursor } from "@/components/IrisCursor"
import { EntryGate } from "@/components/EntryGate"
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
import { ProjectPage } from "@/pages/ProjectPage"
import { usePath } from "@/lib/router"
import { usePointerVars } from "@/lib/pointerVars"

function Home() {
  return (
    // Sections carry their own rules and rhythm, so no divider elements
    // between them — a page stitched together with <hr>s reads as blocks
    // stacked rather than a continuous document.
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
  )
}

function App() {
  const path = usePath()
  // One pointer loop for the page; consumers read --px/--py in CSS.
  usePointerVars()
  const projectMatch = path.match(/^\/work\/([^/]+)\/?$/)

  return (
    <>
      <EntryGate />
      <ScrollProgress />
      <IrisCursor />
      <Backdrop />
      <Nav />
      {projectMatch ? <ProjectPage slug={projectMatch[1]} /> : <Home />}
    </>
  )
}

export default App
