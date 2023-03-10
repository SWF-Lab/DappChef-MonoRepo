import { Container } from "./styles"

//front end
import Stack from "@mui/material/Stack"
import { makeStyles } from "@material-ui/core/styles"
import * as React from "react"
import Paper from "@mui/material/Paper"
import Box from "@material-ui/core/Box"
import Grid from "@mui/material/Grid"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import bg from "../../components/Img/Dune.png"
import bg4 from "../../components/Img/Dune4.png"
import test from "../../components/Img/test.png"

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
    // "& video": {
    //   objectFit: "cover"
    // }
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
  const classes = useStyles()
  return (
    <>
      <Container
        maxWidth={false}
        style={{ flexDirection: "row", overflow: "visible" }}
      >
        <div
          className={classes.root}
          style={{
            backgroundImage: `url(${bg4})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
            // backgroundAttachment: "fixed"
          }}
        >
          {/* <div className={classes.overlay}> */}
          <Grid
            height="80vh"
            width="75%"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="flex-start"
            // alignItems="center"
            // spacing={7}
            // sx={{ p: 15 }}
          >
            <Typography
              variant="h4"
              align="center"
              color="white"
              component="p"
              sx={{
                typography: { lg: "h4", sm: "caption", sx: "caption" }
                //   pb:3
              }}
            >
              Find your Dune data here...
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="center"
              spacing={5}
              // sx={{mt:5}}
            >
              <Paper
                style={{
                  width: "220px",
                  height: "220px",
                  backgroundColor: "white"
                }}
                sx={{
                  m: 1,

                  borderRadius: "15px",
                  border: "10px solid #D9D9D9"
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
                  width: "220px",
                  height: "220px",
                  backgroundColor: "white"
                }}
                sx={{
                  m: 1,

                  borderRadius: "15px",
                  border: "10px solid #D9D9D9"
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
                  width: "220px",
                  height: "220px",
                  backgroundColor: "white"
                }}
                sx={{
                  m: 1,

                  borderRadius: "15px",
                  border: "10px solid #D9D9D9"
                }}
              >
                <iframe
                  src="https://dune.com/embeds/2023317/3349515"
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
                  width: "300px",
                  height: "230px",
                  backgroundColor: "white"
                }}
                sx={{
                  ml: { xl: 5, md: 0 },
                  borderRadius: "15px",
                  border: "10px solid #D9D9D9"
                }}
              >
                <iframe
                  src="https://dune.com/embeds/2023100/3349198"
                  height="100%"
                  width="100%"
                  style={{ border: "none" }}
                />
              </Paper>
              <Paper
                style={{
                  width: "500px",
                  height: "230px",
                  backgroundColor: "white"
                }}
                sx={{
                  ml: 5,
                  borderRadius: "15px",
                  border: "10px solid #D9D9D9"
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
