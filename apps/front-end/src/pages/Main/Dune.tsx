import { Container } from "./styles"

//front end
import Stack from "@mui/material/Stack"
import { makeStyles } from "@material-ui/core/styles"
import * as React from "react"
import Paper from "@mui/material/Paper"
// import Box from "@material-ui/core/Box"
import Grid from "@mui/material/Grid"
// import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import bg from "../../components/Img/Dune6.png"

import { useState, useEffect } from "react"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80vw",
    height: "93vh",
    position: "relative",
    display: "flex",
    // background: "#0F0B18",
    alignItems: "center",
    justifyContent: "center",
    objectFit: "contain",
    padding: 30
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

export const Dune = () => {
  const [largeHeight, setLargeHeight] = useState(window.innerHeight)
  useEffect(() => {
    const handleResize = () => setLargeHeight(window.innerHeight)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const classes = useStyles()
  return (
    <>
      <Container
        maxWidth={false}
        style={{ flexDirection: "row", overflow: "hidden" }}
      >
        <div
          className={classes.root}
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
            // backgroundAttachment: "fixed"
          }}
        >
          {/* <div className={classes.overlay}> */}
          <Grid
            sx={{ height: { lg: "80vh", md: "70vh", sm: "60vh" } }}
            width="75%"
            display="flex"
            flexDirection="column"
            justifyContent="space-around"
            alignItems={{ lg: "flex-start", md: "flex-start", sm: "center" }}
          >
            <Typography
              variant="h4"
              align="center"
              color="white"
              component="p"
              sx={{
                typography: { xl: "h3", lg: "h4", md: "h6", sm: "caption" }
                //   pb:3
              }}
            >
              Find your Dune data here...
            </Typography>
            <Stack
              direction="row"
              // direction={{ lg: "row", md: "row", sm: "column" }}
              justifyContent="space-around"
              alignItems="center"
              spacing={{ xl: 8, lg: 5, md: 2, sm: 1 }}
              // sx={{mt:5}}
            >
              <Paper
                style={{
                  backgroundColor: "white"
                }}
                sx={{
                  // m: 1,
                  width: { xl: "320px", lg: "220px", md: "150px", sm: "90px" },
                  height: { xl: "320px", lg: "220px", md: "150px", sm: "90px" },
                  // width: {  lg: "220px", md: "150px", sm: "90px" },
                  // height: { lg: "220px", md: "150px", sm: "90px" },
                  borderRadius: "15px",
                  border: {
                    xl: "13px solid #D9D9D9",
                    lg: "10px solid #D9D9D9",
                    md: "7px solid #D9D9D9",
                    sm: "4px solid #D9D9D9"
                  },
                  display: largeHeight >= 300 ? "block" : "none"
                }}
              >
                <iframe
                  src="https://dune.com/embeds/2022989/3349012"
                  height="100%"
                  width="100%"
                  style={{ border: "none" }}
                />
              </Paper>
              <Paper
                style={{
                  backgroundColor: "white"
                }}
                sx={{
                  // m: 1,
                  width: { xl: "320px", lg: "220px", md: "150px", sm: "90px" },
                  height: { xl: "320px", lg: "220px", md: "150px", sm: "90px" },
                  borderRadius: "15px",
                  border: {
                    xl: "13px solid #D9D9D9",
                    lg: "10px solid #D9D9D9",
                    md: "7px solid #D9D9D9",
                    sm: "4px solid #D9D9D9"
                  },
                  display: largeHeight >= 300 ? "block" : "none"
                }}
              >
                <iframe
                  src="https://dune.com/embeds/2023032/3349086"
                  height="100%"
                  width="100%"
                  style={{ border: "none" }}
                />
              </Paper>
              <Paper
                style={{
                  backgroundColor: "white"
                }}
                sx={{
                  // m: 1,
                  width: { xl: "320px", lg: "220px", md: "150px", sm: "90px" },
                  height: { xl: "320px", lg: "220px", md: "150px", sm: "90px" },
                  borderRadius: "15px",
                  border: {
                    xl: "13px solid #D9D9D9",
                    lg: "10px solid #D9D9D9",
                    md: "7px solid #D9D9D9",
                    sm: "4px solid #D9D9D9"
                  },
                  display: largeHeight >= 300 ? "block" : "none"
                }}
              >
                <iframe
                  src="https://dune.com/embeds/2023164/3349291"
                  height="100%"
                  width="100%"
                  style={{ border: "none" }}
                />
              </Paper>
            </Stack>
            <Stack
              flexDirection="row"
              justifyContent="space-around"
              alignItems="center"

              //   spacing={5}
            >
              <Paper
                style={{
                  // width: "300px",
                  // height: "230px",
                  backgroundColor: "white"
                }}
                sx={{
                  ml: { xl: 10, lg: 5, md: 2, sm: 1 },
                  width: { xl: "400px", lg: "300px", md: "250px", sm: "170px" },
                  // height: { lg: "230px", md: "170px", sm: "110px" },
                  height: { xl: "320px", lg: "220px", md: "150px", sm: "90px" },
                  borderRadius: "15px",
                  border: {
                    xl: "13px solid #D9D9D9",
                    lg: "10px solid #D9D9D9",
                    md: "7px solid #D9D9D9",
                    sm: "4px solid #D9D9D9"
                  },
                  display: largeHeight >= 550 ? "block" : "none"
                }}
              >
                <iframe
                  src="https://dune.com/embeds/2023125/3349229"
                  height="100%"
                  width="100%"
                  style={{ border: "none" }}
                />
              </Paper>
              <Paper
                style={{
                  // width: { lg: "500px", md: "400px", sm: "300px" },
                  // width: "500px",
                  // height: "230px",
                  backgroundColor: "white"
                }}
                sx={{
                  ml: { xl: 10, lg: 5, md: 2, sm: 1 },
                  width: { xl: "700px", lg: "500px", md: "350px", sm: "280px" },
                  // height: { lg: "230px", md: "170px", sm: "110px" },
                  height: { xl: "320px", lg: "220px", md: "150px", sm: "90px" },
                  borderRadius: "15px",
                  border: {
                    xl: "13px solid #D9D9D9",
                    lg: "10px solid #D9D9D9",
                    md: "7px solid #D9D9D9",
                    sm: "4px solid #D9D9D9"
                  },
                  display: largeHeight >= 550 ? "block" : "none"
                }}
              >
                <iframe
                  src="https://dune.com/embeds/2023176/3349282"
                  height="100%"
                  width="100%"
                  style={{ border: "none" }}
                />
              </Paper>
            </Stack>
          </Grid>
          {/* </div> */}
        </div>
      </Container>
    </>
  )
}
