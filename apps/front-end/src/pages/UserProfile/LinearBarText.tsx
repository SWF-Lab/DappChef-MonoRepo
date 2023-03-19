import * as React from "react"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

export const LinearBarText = ({
  difficulty,
  totalAC,
  totalProblem,
  percent,
  changepercent
}) => {
  //   console.log("~~~~", totalAC, totalProblem, totalAC / totalProblem)
  return (
    <Stack
      direction="row"
      justifyContent={{
        lg: "space-between",
        md: "space-between",
        sm: "center"
      }}
      alignItems="center"
      sx={{ width: "100%" }}
    >
      <Typography
        align="center"
        color="white"
        component="p"
        sx={{
          typography: { lg: "caption", md: "overline", sm: "overline" },
          display: { xs: "none", md: "block" }
        }}
      >
        Level {difficulty}
      </Typography>
      <Typography
        align="center"
        color="white"
        component="p"
        sx={{
          typography: { lg: "caption", md: "overline", sm: "overline" },
          "&:hover": {
            cursor: "pointer"
          }
        }}
        onClick={changepercent}
      >
        {percent
          ? `${Math.round((totalAC / totalProblem) * 100)}%`
          : `${totalAC} / ${totalProblem}`}
        {/* {`${Math.round(totalAC / totalProblem) * 100}%`} */}
      </Typography>
    </Stack>
  )
}
