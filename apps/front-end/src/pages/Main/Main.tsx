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
import BeforeLoginVideo from "../../components/Img/DappChef_v3_BeforeLogin.mp4"

export const Main = () => {
  return (
    <>
      <ResponsiveAppBar />
      <main style={{ background: "black", height: "100%" }}>
        <video autoPlay muted>
          <source
            src={"https://www.youtube.com/watch?v=eKdkigGYFpE"}
            type="vedio/mp4"
          />
        </video>

        <Container>
          <ProblemList />
        </Container>
        {/* TODO: Sponsor Area.... */}
        <TotalMarquee />
      </main>
      <Footer />
    </>
  )
}
