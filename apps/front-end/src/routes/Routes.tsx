import { Suspense } from "react"
import {
  Navigate,
  Route,
  Routes as RoutesReactRouterDom
} from "react-router-dom"
import {
  Main,
  GenericNotFound,
  ProblemsInterface,
  UserProfile,
  MemberInfo
} from "./paths"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import LinearProgress from "@mui/material/LinearProgress"
import Box from "@mui/material/Box"
import { Container } from "../pages/ProblemsInterface/styles"

const LoadingPage = () => {
  return (
    <>
      <main style={{ background: "#0F0B18", height: "100%" }}>
        <Container
          style={{ flexDirection: "column", height: "100%" }}
          // minWidth="xl"
        >
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            sx={{
              py: 2,
              my: 5,
              height: "100%"
            }}
            maxWidth="xl"
          >
            <Paper
              style={{ backgroundColor: "#1C1B29" }}
              // style={{ backgroundColor: "white" }}
              sx={{
                py: 2,
                px: 8,
                my: 0,
                width: "88%",
                height: "80%",
                borderRadius: "18px"
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-around"
                alignItems="center"
                sx={{ m: 0 }}
              >
                <>
                  <Typography
                    variant="h4"
                    align="center"
                    color="white"
                    component="p"
                    sx={{ typography: { lg: "h4", sm: "body1" } }}
                  >
                    Loading...
                  </Typography>
                  <Box sx={{ width: "20%", my: 3 }}>
                    <LinearProgress
                      sx={{
                        borderRadius: 5,
                        backgroundColor: `rgb(255, 255, 255,0.4)`,
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 5,
                          backgroundColor: `rgb(255, 255, 255)`
                        }
                      }}
                    />
                  </Box>
                </>
              </Grid>
            </Paper>
          </Grid>
        </Container>
      </main>
    </>
  )
}

export const Routes = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <RoutesReactRouterDom>
        <Route path="/" element={<Main />} />
        <Route path=":probNum" element={<ProblemsInterface />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/About" element={<MemberInfo />} />
        <Route path="*" element={<Navigate to="/404" />} />
        <Route path="/404" element={<GenericNotFound />} />
      </RoutesReactRouterDom>
    </Suspense>
  )
}
