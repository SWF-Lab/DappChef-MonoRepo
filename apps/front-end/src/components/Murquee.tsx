import Marquee from "react-easy-marquee"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import logo from "./Img/logo transparent_white.png"

export const TotalMarquee = () => {
  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="space-around"
        alignItems="center"
        // maxWidth="xl"
      >
        <Typography
          variant="h4"
          align="center"
          color="white"
          component="p"
          sx={{ typography: { lg: "h4", sm: "body1" }, zIndex: "fab" }}
        >
          Supporting Sponsers
        </Typography>
        <Paper
          style={{ backgroundColor: "#1C1B29" }}
          sx={{
            mt: -1,
            mb: 7,
            // my: 0,
            width: "80%",
            // height: "80%",
            borderRadius: "18px"
          }}
        >
          <Grid
            container
            direction="column"
            justifyContent="space-around"
            alignItems="center"
          >
            <Marquee
              reverse={false}
              background="#1C1B29"
              height="15vh"
              width="98%"
              duration={12000}
              pauseOnHover={true}
            >
              <img src={logo} alt="logo" width={48} height={48} />
              <img src={logo} alt="logo" width={48} height={48} />
              <img src={logo} alt="logo" width={48} height={48} />
              <img src={logo} alt="logo" width={48} height={48} />
              <img src={logo} alt="logo" width={48} height={48} />
            </Marquee>
          </Grid>
        </Paper>
        <Typography
          variant="h4"
          align="center"
          color="white"
          component="p"
          sx={{ typography: { lg: "h4", sm: "body1" }, zIndex: "fab" }}
        >
          Colaborators
        </Typography>
        <Paper
          style={{ backgroundColor: "#1C1B29" }}
          sx={{
            mt: -1,
            mb: 7,
            width: "80%",
            // height: "80%",
            borderRadius: "18px"
          }}
        >
          <Grid
            container
            direction="column"
            justifyContent="space-around"
            alignItems="center"
          >
            <Marquee
              reverse={false}
              background="#1C1B29"
              height="15vh"
              width="98%"
              duration={12000}
              pauseOnHover={true}
            >
              <img src={logo} alt="logo" width={48} height={48} />
              <img src={logo} alt="logo" width={48} height={48} />
              <img src={logo} alt="logo" width={48} height={48} />
              <img src={logo} alt="logo" width={48} height={48} />
              <img src={logo} alt="logo" width={48} height={48} />
              <img src={logo} alt="logo" width={48} height={48} />
              <img src={logo} alt="logo" width={48} height={48} />
              <img src={logo} alt="logo" width={48} height={48} />
              <img src={logo} alt="logo" width={48} height={48} />
              <img src={logo} alt="logo" width={48} height={48} />
            </Marquee>
          </Grid>
        </Paper>
      </Grid>
    </>
  )
}
