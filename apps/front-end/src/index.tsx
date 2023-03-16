import React from "react"
import { render } from "react-dom"
import { App } from "./App"
import { HookProvider } from "./pages/useHooks"
import { BrowserRouter } from "react-router-dom"
import useMediaQuery from "@mui/material/useMediaQuery"
import { PhoneError } from "./pages/PhoneError/phoneError.tsx"
import { createTheme, ThemeProvider } from "@mui/material"

const rootElement = document.getElementById("root")
// const theme = createTheme({
//   typography: {
//     fontFamily: ["Montserrat", "sans-serif"].join(",")
//   }
// })

// const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

render(
  <React.StrictMode>
    <BrowserRouter>
      <HookProvider>
        <App />
        {/* <ThemeProvider theme={theme}> */}
        {/* {isMobile? 
      (<PhoneError/>):(<App />)} */}
        {/* </ThemeProvider> */}
      </HookProvider>
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
)
