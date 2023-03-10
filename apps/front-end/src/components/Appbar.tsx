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
import Stack from "@mui/material/Stack"
import logo from "./Img/logo transparent_white.png"
// import { Theme, makeStyles } from "@material-ui/core/styles";
import { useHook } from "../pages/useHooks"
import egg from "./Img/egg.png"
// const settings = ["LightingMode", "Logout"]
const settings = ["ChangeAccount"]

export const ResponsiveAppBar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )

  const { account, onClickConnect, toAbout, toUserProfile, toMain } = useHook()
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const disconnect = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {}
          }
        ]
      })
    } catch (e: any) {
      console.log(e)
    }
  }

  const imageStyle = {
    cursor: "pointer"
  }

  return (
    <AppBar position="sticky" style={{ background: "#0F0B18" }}>
      <Container maxWidth={false} xs={{ height: "100%", overflow: "hidden" }}>
        <Toolbar disableGutters>
          <Stack
            spacing={1}
            sx={{
              p: 2
            }}
            onClick={toMain}
          >
            <img
              src={logo}
              alt="logo"
              style={imageStyle}
              width={48}
              height={48}
            />
          </Stack>
          {/* <AdbIcon sx={{ mr: 1 }} /> */}
          <Button
            sx={{
              m: { lg: 2, sm: 0 },
              color: "white",
              display: "block",
              textTransform: "none",

              fontSize: { lg: "24px", sm: "14px" },
              ":hover": {
                color: "#727171",
                background: "#0F0B18"
              }
            }}
            onClick={toAbout}
          >
            MemberInfo
          </Button>
          <Button
            sx={{
              m: { lg: 2, sm: 0 },
              color: "white",
              display: "block",
              textTransform: "none",
              fontSize: { lg: "24px", sm: "14px" },
              ":hover": {
                color: "#727171",
                background: "#0F0B18"
              }
            }}
            target="_blank"
            href="https://chihaolu.gitbook.io/dappchef/frequently-infomation/faq"
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
                    <Avatar alt="Remy Sharp" src={egg} />
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
                      sx={{ fontSize: { lg: "24px", sm: "14px" } }}
                      key={setting}
                      onClick={disconnect}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
                <Button
                  sx={{
                    m: { lg: 2, sm: 0 },
                    color: "white",
                    display: "block",
                    textTransform: "none",
                    fontSize: { lg: "24px", sm: "14px" },
                    ":hover": {
                      color: "#727171",
                      background: "#0F0B18"
                    }
                  }}
                  onClick={toUserProfile}
                >
                  Profile
                </Button>
              </>
            ) : (
              <Button
                // variant="outlined"
                sx={{
                  m: { lg: 2, sm: 0 },
                  color: "white",
                  borderColor: "white",
                  border: "3px solid",
                  borderRadius: "15px",
                  display: "block",
                  textTransform: "none",
                  fontSize: { lg: "24px", sm: "14px" },
                  "&:hover": {
                    color: "black",
                    backgroundColor: "white",
                    borderColor: "white"
                  }
                }}
                onClick={() => onClickConnect()}
              >
                Sign In
              </Button>
            )}
            <Button
              sx={{
                m: { lg: 2, sm: 0 },
                color: "white",
                display: "block",
                textTransform: "none",
                fontSize: { lg: "24px", sm: "14px" },
                ":hover": {
                  color: "#727171",
                  background: "#0F0B18"
                }
              }}
              target="_blank"
              href="https://etherscan.io/address/0x189c92f28047c979ca2d17c13e3a12963eb1b8b4"
            >
              CheerUsUp
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
