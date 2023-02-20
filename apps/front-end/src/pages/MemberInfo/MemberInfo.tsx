import { ResponsiveAppBar } from "../../components/Appbar"
import * as React from "react"

import Button from "@mui/material/Button"
import CameraIcon from "@mui/icons-material/PhotoCamera"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import CssBaseline from "@mui/material/CssBaseline"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"

import Box from "@mui/material/Box"
// import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Link from "@mui/material/Link"
import { CardActionArea } from "@mui/material"
import { useHook } from "../useHooks"

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

export const MemberInfo = () => {
  const { account, onClickConnect, toUserProfile } = useHook()

  return (
    <>
      <ResponsiveAppBar
        account={account}
        onClickConnect={onClickConnect}
        toUserProfile={toUserProfile}
      />
      <main style={{ background: "black" }}>
        {/* Hero unit */}
        <Container
          sx={{
            pt: 1
          }}
          align="center"
          maxWidth="xl"
        >
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
                spacing={1}
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
        <Container sx={{ px: 2, pt: 4, ml: 2 }} maxWidth="xl">
          {/* End hero unit */}
          <Grid
            sx={{ pt: 2, pb: 4 }}
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
                  height: "30vh",
                  maxWidth: 345,
                  borderRadius: "20px",
                  border: "5px solid white"
                }}
              >
                <CardActionArea>
                  <CardMedia
                    sx={{
                      pt: 1.5,
                      px: 1.5,
                      borderRadius: "25px"
                    }}
                    component="img"
                    width=""
                    height="130vh"
                    image="https://yt3.googleusercontent.com/ytc/AL5GRJVcbQPZqImGvAtqEnJQXQflyc1TJIVfQvuNbPZ0=s900-c-k-c0x00ffffff-no-rj"
                    alt="green iguana"
                  />
                  <CardContent sx={{ px: 1, pt: 0.5, pb: 0 }}>
                    <Typography
                      color="white"
                      align="center"
                      variant="h5"
                      component="div"
                    >
                      ExcitedMail
                    </Typography>
                    <Typography
                      color="white"
                      align="center"
                      variant="subtitle1"
                    >
                      Restaurant Manager
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Container
        sx={{ p: 2, m: 0, background: "#dcdcdc" }}
        maxWidth="xl"
        // component="footer"
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          // spacing={2}
        >
          <Button
            sx={{
              color: "white",
              width: "150px",
              height: "45px",
              fontsize: "24px",
              borderRadius: "8px",
              textTransform: "none",
              background:
                " linear-gradient(90deg, #FF8177 0%, #FF867A 0%, #FF8C7F 21%, #F99185 52%, #CF556C 78%, #B12A5B 100%)"
            }}
          >
            SWFLab
          </Button>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={6}
          >
            <Typography
              variant="subtitle1"
              align="center"
              color="#363636"
              component="p"
            >
              Copyright @swfLab Version Alpha
            </Typography>
            <Button
              sx={{
                ml: 15,
                color: "white",
                width: "150px",
                height: "45px",
                fontsize: "24px",
                borderRadius: "8px",
                textTransform: "none",
                background: "  linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)"
              }}
            >
              Github
            </Button>

            <Button
              sx={{
                color: "white",
                width: "150px",
                height: "45px",
                fontsize: "24px",
                borderRadius: "8px",
                textTransform: "none",
                background: "  linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)"
              }}
            >
              OpenSea
            </Button>
            <Button
              sx={{
                color: "white",
                width: "150px",
                height: "45px",
                fontsize: "24px",
                borderRadius: "8px",
                textTransform: "none",
                background: "  linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)"
              }}
            >
              Twitter
            </Button>
          </Stack>
        </Stack>
      </Container>
      {/* End footer */}
    </>
  )
}

// export const MemberInfo = () => {
//   return <div></div>
// }
