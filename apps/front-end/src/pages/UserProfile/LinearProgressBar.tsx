import * as React from "react"
import Box from "@mui/material/Box"
import LinearProgress from "@mui/material/LinearProgress"

export const LinearBar = ({ clr, totalAC, totalProblem }) => {
  // console.log("~~~~", totalAC, totalProblem, totalAC/totalProblem)
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress
        variant="determinate"
        value={(totalAC / totalProblem) * 100}
        sx={{
          borderRadius: 5,
          backgroundColor: `rgb(${clr},0.4)`,
          "& .MuiLinearProgress-bar": {
            borderRadius: 5,
            backgroundColor: `rgb(${clr})`
          }
        }}
      />
    </Box>
  )
}
