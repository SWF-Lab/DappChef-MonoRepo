import * as React from "react"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import GitHubIcon from "@mui/icons-material/GitHub"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
// import MenuBookIcon from "@mui/icons-material/MenuBook"

import { CardActionArea } from "@mui/material"
import { useHook } from "../useHooks"
import { ResponsiveAppBar } from "../../components/Appbar"
import { Footer } from "../../components/Footer"
import medium from "../../components/Img/medium.png"
import linkedin from "../../components/Img/LI-In-Bug.png"
import github from "../../components/Img/github-mark-white.png"

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
    link: "https://www.linkedin.com/in/theyhw//"
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
    maxHeight: 132
  }

  return (
    <>
      <ResponsiveAppBar
      // account={account}
      // onClickConnect={onClickConnect}
      // toUserProfile={toUserProfile}
      />
      <main style={{ background: "#0F0B18", height: "100%" }}>
        {/* Hero unit */}
        <Container
          sx={{ pt: 1, px: 2, height: "100%", overflow: "auto" }}
          maxWidth="xl"
          disableGutters
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              style={{ backgroundColor: "black" }}
              sx={{
                py: 2,
                px: 4,
                width: "95%",
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
                    sx={{ pl: 3, pr: 8 }}
                    spacing={1}
                  >
                    <Typography
                      variant="subtitle1"
                      align="center"
                      align="flex-start"
                      color="white"
                      component="p"
                      sx={{ typography: { lg: "subtitle1", sm: "caption" } }}
                    >
                      Hello, we are swfLAB, a Blockchain DApp Development &
                      Solution Team from Taiwan!
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      align="flex-start"
                      color="white"
                      component="p"
                      sx={{ typography: { lg: "subtitle1", sm: "caption" } }}
                    >
                      We are researching Web3 by researching everthing about
                      Blockchain and developing DApp on Ethereum. Check out
                      Medium Publication to follow the latest posts, or Official
                      Website to overview the fantastic projects we have done
                      before.
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      align="flex-start"
                      color="white"
                      component="p"
                      sx={{ typography: { lg: "subtitle1", sm: "caption" } }}
                    >
                      Thank you 💜
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
                  <img
                    src={github}
                    alt="github"
                    width="50vw"
                    height="50vh"
                    onClick={() => window.open("https://github.com/SWF-Lab")}
                    style={{ cursor: "pointer" }}
                  />

                  <img
                    src={linkedin}
                    alt="linkedin"
                    width="53vw"
                    height="53vh"
                    onClick={() =>
                      window.open("https://www.linkedin.com/company/swf-lab/")
                    }
                    style={{ cursor: "pointer" }}
                  />

                  <img
                    src={medium}
                    alt="medium"
                    width="50vw"
                    height="50vh"
                    backgroundColor="#ffffff"
                    style={{ cursor: "pointer" }}
                    onClick={() => window.open("https://medium.com/swf-lab")}
                  />
                  {/* </Button> */}
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Container>
        <Container
          sx={{ px: 2, pt: 4, height: "100%" }}
          disableGutters
          maxWidth="xl"
        >
          {/* End hero unit */}
          <Grid
            sx={{ pt: 2, pb: 4, m: -2, height: "100%" }}
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
                  border: "3px solid white"
                }}
                onClick={() => {
                  window.open(card.link)
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
                  <CardActionArea
                  // href={card.link}
                  >
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
                      image="https://thumbor.4gamers.com.tw/M2uWlienrNyWxunZA_qeLDWcTN4=/adaptive-fit-in/1200x1200/filters:no_upscale():extract_cover():format(jpeg):quality(85)/https%3A%2F%2Fugc-media.4gamers.com.tw%2Fpuku-prod-zh%2Fanonymous-story%2F67db9224-8f8f-43ff-a18a-0f52a01d514a.jpg"
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
                        {card.name}
                      </Typography>
                      <Typography
                        color="white"
                        align="center"
                        variant="subtitle1"
                        sx={{ typography: { lg: "subtitle1", sm: "caption" } }}
                      >
                        {card.title}
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
