import * as React from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import Stack from "@mui/material/Stack"

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "#2D2D2D",
  boxShadow: 24,
  pt: 4,
  pl: 4,
  pr: 4,
  pb: 2,
  flexDirection: "column",
  justifyContent: "center",
  borderRadius: 2
}

export const MintModal = ({ mintfunction }) => {
  const [open, setOpen] = React.useState(true)
  // const handleOpen = () => setOpen(true)
  // const handleClose = () => setOpen(false)

  return (
    <>
      <Modal
        open={open}
        // sx={{borderRadius: 20}}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box display="flex" sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            color="white"
            style={{ textAlign: "center" }}
          >
            Congratulations!
          </Typography>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            color="white"
            style={{ textAlign: "center" }}
          >
            Do you want to Mint?
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 2 }}
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
              onClick={() => {
                setOpen(false)
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
                  background: "black",
                  color: "#FFFFFF"
                }
              }}
              onClick={mintfunction}
            >
              Yes
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  )
}
