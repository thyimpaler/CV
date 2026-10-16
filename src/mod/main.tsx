import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "../index.css"
import { ModPage } from "./ModPage.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModPage />
  </StrictMode>,
)
