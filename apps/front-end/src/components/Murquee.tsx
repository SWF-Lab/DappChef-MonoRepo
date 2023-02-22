import Marquee from "react-fast-marquee"
import Typography from "@mui/material/Typography"

export const TotalMarquee = () => {
  return (
    <>
      <Typography
        variant="h4"
        align="center"
        color="white"
        component="p"
        sx={{ typography: { lg: "h4", sm: "body1" } }}
      >
        Supporting Sponsers
      </Typography>
      <Marquee speed={50}>
        I can be a React component, multiple React components, or just some
        text.
      </Marquee>
      <Marquee>Hello</Marquee>
    </>
  )
}
