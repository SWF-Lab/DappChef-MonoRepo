import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import phonehat from "./../../components/Img/phonehat.png"

const useStyles = makeStyles({
  root: {
    backgroundColor: "#0F0B18"
  }
})

export const PhoneError = () => {
  const classes = useStyles()
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
            border: "2px solid white"
          }}
        >
          <Stack
            direction="row"
            // sx={{ width: "150", height: "150"}}
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
          >
            Oops!
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="subtitle2"
            color="white"
            style={{ textAlign: "center" }}
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
