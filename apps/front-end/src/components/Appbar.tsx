import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import Container from "@mui/material/Container"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import MenuItem from "@mui/material/MenuItem"
import AdbIcon from "@mui/icons-material/Adb"
// import { Theme, makeStyles } from "@material-ui/core/styles";

const settings = ["LightingMode", "Logout"]

export const ResponsiveAppBar = ({
  account,
  onClickConnect,
  toAbout,
  toUserProfile
}) => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar position="sticky" style={{ background: "#000000" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ mr: 1 }} />
          <Button
            sx={{
              m: 2,
              color: "white",
              display: "block",
              textTransform: "none",
              fontSize: "24px",
              ":hover": {
                color: "#D9D9D9"
              }
            }}
            onClick={toAbout}
          >
            MemberInfo
          </Button>
          <Button
            sx={{
              m: 2,
              color: "white",
              display: "block",
              textTransform: "none",
              fontSize: "24px",
              ":hover": {
                color: "#D9D9D9"
              }
            }}
          >
            FAQ
          </Button>
          <Box
            sx={{ flexGrow: 1, display: "flex", flexDirection: "row-reverse" }}
          >
            {account ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "right"
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      sx={{ fontSize: "24px" }}
                      key={setting}
                      onClick={handleCloseUserMenu}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
                <Button
                  sx={{
                    m: 2,
                    color: "white",
                    display: "block",
                    textTransform: "none",
                    fontSize: "24px",
                    ":hover": {
                      color: "#D9D9D9"
                    }
                  }}
                  onClick={toUserProfile}
                >
                  Profile
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                sx={{
                  m: 2,
                  color: "white",
                  borderColor: "white",
                  border: "5px solid",
                  borderRadius: "15px",
                  display: "block",
                  textTransform: "none",
                  fontSize: "24px",
                  "&:hover": {
                    color: "black",
                    backgroundColor: "white"
                  }
                }}
                onClick={() => onClickConnect()}
              >
                Sign In
              </Button>
            )}
            <Button
              sx={{
                m: 2,
                color: "white",
                display: "block",
                textTransform: "none",
                fontSize: "24px",
                ":hover": {
                  color: "#D9D9D9"
                }
              }}
            >
              CheerWeup
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
