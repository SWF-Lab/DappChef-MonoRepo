import * as React from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#2D2D2D",
  boxShadow: 24,
  p: 4
}

export default function BasicModal() {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box display="flex" justifyContent="center" sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Congratulations!
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Do you want to Mint?
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="space-between"
            sx={{ width: "70%" }}
          >
            <Button
              sx={{
                color: "black",
                width: "10vw",
                height: "4vh",
                fontSize: { lg: "20px", sm: "14px" },
                borderRadius: "20px",
                textTransform: "none",
                background: "#FFFFFF",
                ":hover": {
                  background: "black",
                  color: "#FFFFFF"
                }
              }}
            >
              Skip
            </Button>
            <Button
              sx={{
                color: "white",
                width: "10vw",
                height: "4vh",
                fontSize: { lg: "20px", sm: "14px" },
                borderRadius: "20px",
                textTransform: "none",
                background:
                  "linear-gradient(90deg, #B8CBB8 0%, #B8CBB8 0%, #B465DA 0%, #CF6CC9 33%, #EE609C 66%, #EE609C 100%)",
                ":hover": {
                  color: "black"
                }
              }}
            >
              Yes
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  )
}
