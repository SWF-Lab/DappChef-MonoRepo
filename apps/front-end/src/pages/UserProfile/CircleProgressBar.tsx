import * as React from "react"
import CircularProgress, {
  CircularProgressProps
} from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { useState } from "react"

export const CircularStatic = ({ totalAC, totalProblem }) => {
  console.log(totalAC, totalProblem)

  const [totalACpercent, setTotalACpercent] = useState(true)
  const changeTotalpercent = () => {
    if (totalACpercent) {
      setTotalACpercent(false)
    } else {
      setTotalACpercent(true)
    }
    // console.log(totalACpercent)
  }

  return (
    <Box sx={{ position: "relative", display: "inline-flex", pt: 1.5 }}>
      <CircularProgress
        // value={100}
        value={(totalAC / totalProblem) * 100}
        variant="determinate"
        size={90}
        thickness={2}
        sx={{
          color: "#7CC5FA",
          "& .MuiCircularProgress-determinate": {
            transition: "none"
          },
          boxShadow: `inset 0 0 0 ${(1 / 44) * 50}px ${"white"}`,
          borderRadius: "50%"
        }}
      />
      <Box
        sx={{
          pt: 1.5,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Typography
          sx={{
            typography: { lg: "h6", sm: "caption", xs: "caption" },
            "&:hover": {
              cursor: "pointer"
            }
          }}
          onClick={changeTotalpercent}
          component="div"
          color="white"
        >
          {totalACpercent
            ? `${Math.round((totalAC / totalProblem) * 100)}%`
            : `${totalAC} / ${totalProblem}`}
        </Typography>
      </Box>
    </Box>
  )
}
