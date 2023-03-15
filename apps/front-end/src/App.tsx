//import { BrowserRouter } from "react-router-dom"
import ErrorBoundary from "./routes/components/ErrorBoundary"
import { Routes } from "./routes/Routes"
import GlobalStyle from "./styles/global"
import { createTheme, ThemeProvider } from "@mui/material"
import { useState, useEffect, useRef } from "react"
import useMediaQuery from "@mui/material/useMediaQuery"
import { PhoneError } from "./pages/PhoneError/phoneError.tsx"

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(",")
  },
  breakpoints: {
    values: {
      xs: 0, // 手機端
      sm: 600, // 平板
      md: 900, // 桌面
      lg: 1250, // 大桌面
      xl: 2000 // 超大桌面
    }
  }
})

export const App = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <ThemeProvider theme={theme}>
      {/* <BrowserRouter> */}

      <GlobalStyle />
      <ErrorBoundary>{isMobile ? <PhoneError /> : <Routes />}</ErrorBoundary>
      {/* </BrowserRouter> */}
    </ThemeProvider>
  )
}
