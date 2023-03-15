import Stack from "@mui/material/Stack"

export const InfoButton = ({ photo, link }) => {
  // const classes = useStyles()

  return (
    <Stack
      direction="row"
      sx={{
        width: { lg: "50px", md: "35px", sm: "25px" },
        height: { lg: "50px", md: "35px", sm: "25px" },
        m: 1
      }}
      justifyContent="center"
      alignItems="center"
    >
      <img
        src={photo}
        style={{ borderRadius: "50%" }}
        width="100%"
        height="100%"
        onClick={link}
        style={{ cursor: "pointer" }}
      />
    </Stack>
  )
}
