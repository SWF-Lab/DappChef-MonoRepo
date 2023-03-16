import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { useState, useEffect } from "react"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import phonehat from "./../../components/Img/phonehat.png"

export const PhoneError = () => {
  // const classes = useStyles()
  const [largeWidth, setLargeWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setLargeWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <main style={{ background: "#0F0B18", height: "100vh" }}>
      <Grid
        sx={{ p: 5, height: "100%", width: "100%" }}
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Paper
          style={{ backgroundColor: "#0F0B18" }}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            py: 5,
            px: 3,
            width: "90%",
            height: "95%",
            borderRadius: "20px",
            border: "2px solid white",
            overflow: "hidden"
          }}
        >
          <Stack
            direction="row"
            sx={{
              width: largeWidth > 300 ? "150px" : "75px",
              height: largeWidth > 300 ? "150px" : "75px"
            }}
            justifyContent="flex-start"
            alignItems="flex-start"
            xs={10}
            sm={4}
          >
            <img
              alt="acdf"
              style={{ borderRadius: "50%" }}
              src={phonehat}
              width="100%"
              height="100%"
            />
          </Stack>
          <Typography
            id="modal-modal-title"
            variant="h4"
            color="white"
            style={{ textAlign: "center" }}
            sx={{ typography: largeWidth > 300 ? "h4" : "body1" }}
          >
            Oops!
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="subtitle2"
            color="white"
            component="p"
            style={{ textAlign: "center" }}
            // sx={{typography: largeWidth > 300 ? "subtitle2":"overline" }}
          >
            DappChef requires a larger screen to be used...
            <br />
            Please use a bigger screen!
          </Typography>
        </Paper>
      </Grid>
    </main>
  )
}
