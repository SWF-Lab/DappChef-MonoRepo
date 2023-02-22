import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
// import { Theme, makeStyles } from "@material-ui/core/styles";

export const Footer = () => {
  return (
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
              " linear-gradient(90deg, #FF8177 0%, #FF867A 0%, #FF8C7F 21%, #F99185 52%, #CF556C 78%, #B12A5B 100%)",
            ":hover": {
              transform: "scale(1.1)"
            }
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
              background: "  linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)",
              ":hover": {
                transform: "scale(1.1)"
              }
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
              background: "  linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)",
              ":hover": {
                transform: "scale(1.1)"
              }
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
              background: "  linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)",
              ":hover": {
                transform: "scale(1.1)"
              }
            }}
          >
            Twitter
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}