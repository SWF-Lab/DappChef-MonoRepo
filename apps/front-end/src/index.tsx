import React from "react"
import { render } from "react-dom"
import { App } from "./App"
import { HookProvider } from "./pages/useHooks"
import { BrowserRouter } from "react-router-dom"

const rootElement = document.getElementById("root")

render(
  <React.StrictMode>
    <BrowserRouter>
      <HookProvider>
        <App />
      </HookProvider>
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
)
