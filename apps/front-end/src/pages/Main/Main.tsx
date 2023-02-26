import { useState, useEffect } from "react"
import { TextExample } from "src/components/TextExample/TextExample"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"
import { Container } from "./styles"
import { ProblemList } from "../ProblemsInterface/ProblemList"
import { ResponsiveAppBar } from "../../components/Appbar"
import { useHook } from "../useHooks"
import { TotalMarquee } from "../../components/Murquee"
import { Footer } from "../../components/Footer"
import Grid from "@mui/material/Grid"
import BeforeLoginVideo from "../../components/Img/DappChef_v3_BeforeLogin.mp4"
import LoginVideo from "../../components/Img/DappChef_v3_login.mp4"

export const Main = () => {
  const { account } = useHook()
  return (
    <>
      <ResponsiveAppBar />
      <main style={{ background: "#0F0B18", height: "100%" }}>
        <Container>
          {account ? (
            <video
              autoPlay
              muted
              loop
              src={LoginVideo}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <video
              autoPlay
              muted
              src={BeforeLoginVideo}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </Container>

        <Container>
          <Grid sx={{ py: 15 }}>
            <ProblemList />
          </Grid>
        </Container>
        {/* TODO: Sponsor Area.... */}
        <TotalMarquee />
      </main>
      <Footer />
    </>
  )
}
