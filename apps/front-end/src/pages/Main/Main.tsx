import { useState, useEffect } from "react"
import { TextExample } from "src/components/TextExample/TextExample"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"
import { Container } from "./styles"
import { ProblemList } from "../ProblemsInterface/ProblemList"
import { ResponsiveAppBar } from "../../components/Appbar"
import { useHook } from "../useHooks"
import { Footer } from "../../components/Footer"
import BeforeLoginVideo from "../../components/Img/DappChef_v3_BeforeLogin.mp4"

export const Main = () => {
  return (
    <>
      <ResponsiveAppBar />

      <>
        <>
          <video autoPlay muted>
            <source
              src={"https://www.youtube.com/watch?v=mlVpBTpaOU8"}
              type="vedio/mp4"
            />
          </video>
        </>
      </>
      <Container>
        <ProblemList />
      </Container>
      {/* TODO: Sponsor Area.... */}
      <Footer />
    </>
  )
}
