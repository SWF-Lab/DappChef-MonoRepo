//import { BrowserRouter } from "react-router-dom"
import ErrorBoundary from "./routes/components/ErrorBoundary"
import { Routes } from "./routes/Routes"
import GlobalStyle from "./styles/global"
import { createTheme, ThemeProvider } from "@mui/material"

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(",")
  }
})

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* <BrowserRouter> */}
      <GlobalStyle />
      <ErrorBoundary>
        <Routes />
      </ErrorBoundary>
      {/* </BrowserRouter> */}
    </ThemeProvider>
  )
}
