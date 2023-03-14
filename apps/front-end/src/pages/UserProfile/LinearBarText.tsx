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
      justifyContent="space-between"
      alignItems="center"
      sx={{ width: "100%" }}
    >
      <Typography
        align="center"
        color="white"
        component="p"
        sx={{ typography: { lg: "caption", sm: "caption" } }}
      >
        Star {difficulty}
      </Typography>
      <Typography
        align="center"
        color="white"
        component="p"
        sx={{
          typography: { lg: "caption", sm: "caption", xs: "caption" },
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
