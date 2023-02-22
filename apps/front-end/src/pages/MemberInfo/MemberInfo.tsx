import * as React from "react"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"

import { CardActionArea } from "@mui/material"
import { useHook } from "../useHooks"
import { ResponsiveAppBar } from "../../components/Appbar"
import { Footer } from "../../components/Footer"

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

export const MemberInfo = () => {
  const { account, onClickConnect, toUserProfile } = useHook()
  const Style = {
    height: "32%",
    maxHeight: 132
  }

  return (
    <>
      <ResponsiveAppBar
      // account={account}
      // onClickConnect={onClickConnect}
      // toUserProfile={toUserProfile}
      />
      <main style={{ background: "black", height: "100%" }}>
        {/* Hero unit */}
        <Container sx={{ pt: 1, height: "100%" }} maxWidth="xl">
          <Card
            style={{ backgroundColor: "black" }}
            sx={{
              py: 2,
              px: 4,
              width: "95%",
              borderRadius: "20px",
              border: "5px solid white"
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              // spacing={2}
            >
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <CardMedia
                  sx={{
                    pt: 1.5,
                    px: 1.5,
                    borderRadius: "150px",
                    width: "15%"
                  }}
                  component="img"
                  image="https://p2.bahamut.com.tw/HOME/creationCover/97/0003913697_B.JPG"
                  alt="green iguana"
                />
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  sx={{ pl: 3 }}
                  spacing={1}
                >
                  <Typography
                    variant="subtitle1"
                    align="center"
                    color="white"
                    component="p"
                  >
                    Copyright @swfLab Version Alpha
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    align="center"
                    color="white"
                    component="p"
                  >
                    Copyright @swfLab Version Alpha
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    align="center"
                    color="white"
                    component="p"
                  >
                    Copyright @swfLab Version Alpha
                  </Typography>
                </Stack>
              </Stack>
              {/*logo*/}
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-end"
                spacing={7}
              >
                <Button
                  sx={{
                    color: "white",
                    width: "40px",
                    height: "45px",
                    fontsize: "24px",
                    borderRadius: "100px",
                    textTransform: "none",
                    background:
                      "linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)"
                  }}
                >
                  Y
                </Button>
                <Button
                  sx={{
                    color: "white",
                    width: "40px",
                    height: "45px",
                    fontsize: "24px",
                    borderRadius: "100px",
                    textTransform: "none",
                    background:
                      "  linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)"
                  }}
                >
                  Y
                </Button>
                <Button
                  sx={{
                    color: "white",
                    width: "40px",
                    height: "45px",
                    fontsize: "24px",
                    borderRadius: "100px",
                    textTransform: "none",
                    background:
                      "linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)"
                  }}
                >
                  Y
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Container>
        <Container sx={{ px: 2, pt: 4, ml: 2, height: "100%" }} maxWidth="xl">
          {/* End hero unit */}
          <Grid
            sx={{ pt: 2, pb: 4, height: "100%" }}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={4}
          >
            {cards.map((card) => (
              <Card
                style={{ backgroundColor: "black" }}
                sx={{
                  m: 1,
                  width: 1 / 7,
                  height: "29vh",
                  maxWidth: 345,
                  borderRadius: "20px",
                  border: "5px solid white"
                }}
              >
                <Grid
                  container
                  height="100%"
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={0}
                >
                  <CardActionArea>
                    <CardMedia
                      sx={{
                        pt: 1.5,
                        px: 1.5,
                        // height: "45vh",
                        borderRadius: "25px"
                        // maxHeight: "32%"
                      }}
                      style={Style}
                      component="img"
                      image="https://yt3.googleusercontent.com/ytc/AL5GRJVcbQPZqImGvAtqEnJQXQflyc1TJIVfQvuNbPZ0=s900-c-k-c0x00ffffff-no-rj"
                      alt="green iguana"
                    />
                    <CardContent sx={{ px: 1, pt: 0.5, pb: 0 }}>
                      <Typography
                        color="white"
                        align="center"
                        variant="h5"
                        component="div"
                        sx={{ typography: { lg: "h5", sm: "body1" } }}
                      >
                        ExcitedMail
                      </Typography>
                      <Typography
                        color="white"
                        align="center"
                        variant="subtitle1"
                        sx={{ typography: { lg: "subtitle1", sm: "caption" } }}
                      >
                        Restaurant Manager
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Grid>
              </Card>
            ))}
          </Grid>
        </Container>
      </main>
      <Footer />
    </>
  )
}
