import { useState, useEffect, useRef } from "react"
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
import styled from "styled-components"
import Box from "@material-ui/core/Box"
import ReactPlayer from "react-player"
import BeforeLoginVideo from "../../components/Img/DappChef_v3_BeforeLogin.mp4"
import LoginVideo from "../../components/Img/DappChef_v8_login.mp4"
import start from "../../components/Img/Start.png"
import { makeStyles } from "@material-ui/core/styles"
import Ads from "../../components/Ads.tsx"
import { Ad } from "../../components/Ad.tsx"
import { Dune } from "./Dune.tsx"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    backgroundColor: "#0F0B18",
    alignItems: "center",
    justifyContent: "center",
    "& video": {
      objectFit: "cover"
    }
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
    // backgroundColor:","
  },
  title: {
    paddingBottom: theme.spacing(4)
  }
}))

export const Main = () => {
  const { account } = useHook()
  const classes = useStyles()
  const imageStyle = {
    cursor: "pointer"
  }

  /*要再整理 */
  const scrolltoProblem = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    let scrollTop = height * 2.18
    console.log(width, height, scrollTop)
    // if (width >= 1280) {
    //   scrollTop = height*2;
    // } else if (width >= 1024) {
    //   scrollTop = 1450;
    // }  else {
    //   scrollTop = 1000;
    // }
    window.scrollTo({ top: scrollTop, behavior: "smooth" })
  }

  const newwidth = () => {
    let widthnow = window.innerWidth
    console.log(widthnow)
    return widthnow
  }

  return (
    <>
      <ResponsiveAppBar />
      <main
        style={{
          background: "#0F0B18",
          height: "100%"
          // overflow: "auto"
        }}
      >
        {/* <Container> */}
        {account ? (
          <section className={classes.root}>
            <div style={{ width: "100%", backgroundColor: "red" }}>
              <ReactPlayer
                url={LoginVideo}
                playing
                loop
                muted
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                width="100%"
                height="100%"
              />
            </div>
            <div className={classes.overlay}>
              <Box
                height="100%"
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="flex-end"
                sx={{ pb: 15 }}
              >
                <img
                  src={start}
                  width={"21%"}
                  style={imageStyle}
                  alt="start"
                  onClick={scrolltoProblem}
                />
              </Box>
            </div>
          </section>
        ) : (
          <section className={classes.root}>
            {/* <div style={{ width: '100%', height: '100vh' }}> */}
            <ReactPlayer
              url={BeforeLoginVideo}
              playing
              muted
              width="100%"
              height="100%"
            />
            {/* </div> */}
            <div className={classes.overlay}>
              <Box
                height="100%"
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
                alignItems="flex-end"
                sx={{ px: 20, pb: 15 }}
              >
                <img
                  src={start}
                  width={"23%"}
                  style={imageStyle}
                  alt="start"
                  onClick={scrolltoProblem}
                />
              </Box>
            </div>
          </section>
        )}
        <Ads />

        <Dune />
        <Grid>
          <ProblemList />
        </Grid>
        <TotalMarquee />
      </main>
      <Footer />
    </>
  )
}
