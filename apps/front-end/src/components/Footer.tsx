import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
// import { Theme, makeStyles } from "@material-ui/core/styles";

export const Footer = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{ p: 2, background: "#dcdcdc", height: "100%", overflow: "auto" }}
      component="footer"
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
            width: { lg: "150px", sm: "100px" },
            height: "45px",
            fontSize: { lg: "24px", sm: "12px" },
            borderRadius: "8px",
            textTransform: "none",
            background:
              " linear-gradient(90deg, #FF8177 0%, #FF867A 0%, #FF8C7F 21%, #F99185 52%, #CF556C 78%, #B12A5B 100%)",
            ":hover": {
              color: "black"
            }
          }}
          target="_blank"
          href="https://swflab-official.web.app/"
        >
          SWFLab
        </Button>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={{ lg: 6, sm: 4 }}
        >
          <Typography
            variant="subtitle1"
            align="center"
            color="#363636"
            component="p"
            sx={{ typography: { lg: "subtitle1", sm: "caption" } }}
          >
            Copyright @swfLab Version Alpha
          </Typography>
          <Button
            sx={{
              ml: { lg: 15, sm: 2 },
              color: "white",
              width: { lg: "150px", sm: "100px" },
              height: "45px",
              fontSize: { lg: "24px", sm: "12px" },
              borderRadius: "8px",
              textTransform: "none",
              background: "  linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)",
              ":hover": {
                color: "black"
              }
            }}
            target="_blank"
            href="https://github.com/SWF-Lab/DappChef"
          >
            Github
          </Button>

          <Button
            sx={{
              color: "white",
              width: { lg: "150px", sm: "100px" },
              height: "45px",
              fontSize: { lg: "24px", sm: "12px" },
              borderRadius: "8px",
              textTransform: "none",
              background: "  linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)",
              ":hover": {
                color: "black"
              }
            }}
            // target="_blank" href="https://hackmd.io/AzWycmkkT3Wn7ZkPtVQyQg"
          >
            OpenSea
          </Button>
          <Button
            sx={{
              color: "white",
              width: { lg: "150px", sm: "100px" },
              height: "45px",
              fontSize: { lg: "24px", sm: "14px" },
              borderRadius: "8px",
              textTransform: "none",
              background: "  linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)",
              ":hover": {
                color: "black"
              }
            }}
            target="_blank"
            href="https://twitter.com/DappChef"
          >
            Twitter
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}
