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
import Button from "@mui/material/Button"
import Box from "@material-ui/core/Box"
import ReactPlayer from "react-player"
import BeforeLoginVideo from "../../components/Img/DappChef_v3_BeforeLogin.mp4"
import LoginVideo from "../../components/Img/DappChef_v3_login.mp4"
import start from "../../components/Img/Start.png"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    position: "relative",
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

  return (
    <>
      <ResponsiveAppBar />
      <main style={{ background: "#0F0B18", height: "100%" }}>
        {/* <Container> */}
        {account ? (
          <section className={classes.root}>
            <ReactPlayer
              url={LoginVideo}
              playing
              loop
              muted
              width="100%"
              height="100%"
            />
            <div className={classes.overlay}>
              <Box
                height="100%"
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="flex-end"
                sx={{ pb: 5 }}
              >
                <img src={start} width={"21%"} style={imageStyle} alt="start" />
              </Box>
            </div>
          </section>
        ) : (
          <section className={classes.root}>
            <ReactPlayer
              url={BeforeLoginVideo}
              playing
              muted
              width="100%"
              height="100%"
            />
            <div className={classes.overlay}>
              <Box
                height="100%"
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
                alignItems="flex-end"
                sx={{ px: 11, pb: 5 }}
              >
                <img src={start} width={"23%"} style={imageStyle} alt="start" />
              </Box>
            </div>
          </section>
        )}
        {/* </Container> */}
        <Container>
          <Grid sx={{ py: 15 }}>
            <ProblemList />
          </Grid>
        </Container>

        <TotalMarquee />
      </main>
      <Footer />
    </>
  )
}
