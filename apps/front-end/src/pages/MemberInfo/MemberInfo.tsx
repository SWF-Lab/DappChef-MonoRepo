import * as React from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"

import { CardActionArea } from "@mui/material"
import { useHook } from "../useHooks"
import { ResponsiveAppBar } from "../../components/Appbar"
import { Footer } from "../../components/Footer"
import medium from "../../components/Img/medium.png"
import linkedin from "../../components/Img/LI-In-Bug.png"
import github from "../../components/Img/github-mark-white.png"
import swf from "../../components/Img/swf.png"
import shusi from "../../components/Img/shusi.png"
import { InfoButton } from "./InfoButton"

const cards = [
  {
    name: "Mur**",
    title: "Executive Chef & Technology Chef",
    link: "https://chihaolu.me/"
  },
  {
    name: "KilliMilli",
    title: "Operation Cook",
    link: "https://github.com/mollyy0514"
  },
  {
    name: "FoodChain",
    title: "Smart Contract Cook",
    link: "https://www.linkedin.com/in/fu-chuan-chung-177841232"
  },
  {
    name: "Dino",
    title: "Smart Contract Cook",
    link: "https://www.linkedin.com/in/yan-long-chen-253134231/"
  },
  { name: "cookSen", title: "Full-Stack Cook", link: "https://senchao.xyz/" },
  {
    name: "ExcitedMail",
    title: "Full-Stack Cook",
    link: "https://medium.com/@A_93726"
  },
  {
    name: "unsweet",
    title: "Front-End Cook",
    link: "https://www.linkedin.com/in/unsweet/"
  },
  {
    name: "Corn",
    title: "Restaurant Manager",
    link: "https://www.linkedin.com/in/%E5%AE%87%E7%A5%A5-%E9%83%AD-268371205/"
  },
  {
    name: "theyhw",
    title: "Restaurant Manager",
    link: "https://www.linkedin.com/in/theyhw/"
  },
  { name: "qqai", title: "Pastry Cook", link: "https://medium.com/@qqai" },
  {
    name: "Miipro",
    title: "Pastry Cook",
    link: "https://www.behance.net/CHUYUU"
  }
]

export const MemberInfo = () => {
  // const { account, onClickConnect, toUserProfile } = useHook()
  const Style = {
    height: "32%",
    maxHeight: { lg: "132px", md: 120, sm: 100 }
  }

  return (
    <>
      <ResponsiveAppBar />
      <main
        style={{
          background: "#0F0B18",
          height: "100%",
          minHeight: "100vh"
        }}
      >
        {/* Hero unit */}

        <Grid
          sx={{ py: 1, px: 2, height: "100%" }}
          direction="column"
          justifyContent="center"
          alignItems="center"
          container
        >
          {/* <Grid
            // container
            direction="row"
            justifyContent="center"
            alignItems="center"
          > */}
          <Paper
            style={{ backgroundColor: "#0F0B18" }}
            sx={{
              py: 2,
              px: 4,
              width: "90%",
              borderRadius: "20px",
              border: "3px solid white"
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Box
                  component="img"
                  sx={{
                    height: { xs: 100, xl: 150 },
                    width: { xs: 100, xl: 150 },
                    // maxHeight: { xs: 233, md: 167 },
                    // maxWidth: { xs: 350, md: 250 },
                    borderRadius: 150
                  }}
                  alt="The house from the offer."
                  src={swf}
                />

                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  sx={{ pl: 3, pr: 8 }}
                  spacing={1}
                >
                  <Typography
                    variant="subtitle1"
                    align="center"
                    align="flex-start"
                    color="white"
                    component="p"
                    sx={{
                      typography: {
                        lg: "subtitle1",
                        md: "caption",
                        sm: "caption"
                      }
                    }}
                  >
                    Hello, we are SWF Lab, a DApp Development & Blockchain
                    Solution Team from Taiwan!
                    <br />
                    We are researching everthing about Blockchain and developing
                    DApp on EVM-based chains.
                  </Typography>
                </Stack>
              </Stack>
              {/*logo*/}
              <Stack
                direction={{ md: "row", sm: "column" }}
                justifyContent="center"
                alignItems="center"
                // spacing={{ lg:7, md: 5, sm: 3 }}
              >
                <InfoButton
                  photo={github}
                  link={() => window.open("https://github.com/SWF-Lab")}
                />
                <InfoButton
                  photo={linkedin}
                  link={() =>
                    window.open("https://www.linkedin.com/company/swf-lab/")
                  }
                />
                <InfoButton
                  photo={medium}
                  link={() => window.open("https://medium.com/swf-lab")}
                />
              </Stack>
            </Stack>
          </Paper>

          {/* End hero unit */}
          <Grid
            sx={{
              // pt: 2,
              mx: 0,
              my: 1,
              px: 4,
              width: "100%",
              height: "100%"
            }}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            // spacing={4}
          >
            {cards.map((card) => (
              <Grid
                item
                key={card}
                // spacing={4}
                // 1xs={12} sm={6} md={4} lg={54}
              >
                <Card
                  style={{
                    backgroundColor: "#0F0B18"
                  }}
                  sx={{
                    m: { lg: 2, md: 1.5, sm: 3 },
                    height: "100%",
                    width: { lg: "290px", md: "250px", sm: "230px" },
                    height: { lg: "240px", md: "220px", sm: "190px" },
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "20px",
                    p: 2,
                    border: "3px solid white"
                  }}
                  // sx={{

                  //   width: { lg: "300px", md: "250px", sm: "300px" },
                  //   // height: "29vh",
                  //   p: 1,
                  //   maxWidth: 345,
                  //   borderRadius: "20px",
                  //   border: "3px solid white"
                  // }}
                  onClick={() => {
                    window.open(card.link)
                  }}
                >
                  <Grid
                    height="100%"
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                  >
                    <CardActionArea>
                      <CardMedia
                        sx={{
                          // pt: 1.5,
                          // px: 1.5,
                          height: { lg: "130px", md: "120px", sm: "90px" },
                          width: "100%",
                          // height: "45vh",
                          borderRadius: "5px"
                          // maxHeight: "32%"
                        }}
                        // style={Style}
                        component="img"
                        image={shusi}
                        alt="green"
                      />
                      <CardContent sx={{ px: 1, pt: 0.5, pb: 0 }}>
                        <Typography
                          color="white"
                          align="center"
                          variant="h5"
                          component="div"
                          sx={{
                            typography: { lg: "h5", md: "h6", sm: "h6" }
                          }}
                        >
                          {card.name}
                        </Typography>
                        <Typography
                          color="white"
                          align="center"
                          variant="subtitle1"
                          sx={{
                            typography: {
                              lg: "subtitle1",
                              md: "subtitle2",
                              sm: "caption"
                            }
                          }}
                        >
                          {card.title}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
          {/* </Container> */}
        </Grid>
      </main>
      <Footer />
      {/* </div> */}
    </>
  )
}
