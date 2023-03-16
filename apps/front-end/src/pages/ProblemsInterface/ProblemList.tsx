import { useEffect, useState } from "react"
import { TextExample } from "src/components/TextExample/TextExample"
import { Container } from "./styles"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"
import REWARD_NFT_ABI from "../../../contract-artifacts/rewardABI.json"

//front end
import Stack from "@mui/material/Stack"
import { makeStyles } from "@material-ui/core/styles"
import * as React from "react"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import Grid from "@mui/material/Grid"
import { styled, alpha } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import Pagination from "@mui/material/Pagination"
import TableRow, { tableRowClasses } from "@mui/material/TableRow"
import Button from "@mui/material/Button"
import question from "../../components/Img/question.png"
import trytry from "../../components/Img/Try.png"
import lock from "../../components/Img/Lock.png"
import solved from "../../components/Img/Solved.png"
import star from "../../components/Img/DappChef-Asset-star.png"
/** */
import Menu, { MenuProps } from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"

const useStyles = makeStyles({
  root: {
    "& td:first-child": {
      borderTopLeftRadius: "10px",
      borderBottomLeftRadius: "10px"
    },
    "& td:last-child": {
      borderTopRightRadius: "10px",
      borderBottomRightRadius: "10px"
    }
  },
  table: {
    // minWidth: 650,
    borderCollapse: "separate",
    borderSpacing: "0px 10px",
    "& .MuiTableCell-body": {
      padding: "3px 16px"
    }
  }
})

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#8D8D94"
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#323239"
  },
  "& th": {
    fontSize: { lg: "24px", sm: "16px" }
  },
  "&.MuiTableRow-root:hover": {
    backgroundColor: "#2D5798",
    cursor: "pointer"
  }
}))
const HideRow = styled(TableRow)(({ theme }) => ({
  "&": {
    backgroundColor: "#1C1B29"
  },
  "& th": {
    fontSize: { lg: "24px", sm: "16px" }
  }
}))

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    // marginTop: theme.spacing(1),
    // minWidth: 180,
    color: "black",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenuItem-root": {
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        )
      }
    }
  }
}))

const tagRow = [
  "Reset",
  "Beginner",
  "Token",
  "DeFi",
  "Design_Pattern",
  "Company",
  "DSA",
  "Gas_Optim",
  "Cryptgraphy",
  "EVM",
  "Scalability"
]

const difficultRow = [
  { name: "Reset", value: 0 },
  { name: "Easy", value: 1 },
  { name: "Medium", value: 2 },
  { name: "Hard", value: 3 }
]

/*------------------------------------------------------ */
export const ProblemList = () => {
  const RewardNFTAddress = process.env.REWARDS_CONTRACT_ADDR as string
  const PROBLEMS_IPFS_CID = process.env.PROBLEMS_IPFS_CID as string

  const navigate = useNavigate()
  const [account, setAccount] = useState("")
  const [problemsInfo, setProblemsInfo] = useState([])
  const [problemList, setProblemList] = useState<any>([])
  const [originalList, setOriginalList] = useState<any>([])

  async function getTokenInfoOfUser() {
    /** --------------------------------------------------------
     * Setting up the basic ethers object
     * -------------------------------------------------------- */
    if (!(window as any).ethereum) {
      return
    }
    await window.ethereum.enable()
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum,
      "any"
    )
    await provider
      .send("wallet_switchEthereumChain", [{ chainId: "0x5" }])
      .catch((e) => console.log(e))

    provider
      .send("eth_requestAccounts", [])
      .then((accounts) => {
        if (accounts.length > 0) setAccount(accounts[0])
      })
      .catch((e) => console.log(e))

    const signer = provider.getSigner()

    /**  --------------------------------------------------------
     * Get RewardNFT Contract Object
     * -------------------------------------------------------- */

    const RewardNFTContract = new ethers.Contract(
      RewardNFTAddress,
      REWARD_NFT_ABI,
      signer
    )

    /**  --------------------------------------------------------
     * Get User Answer Status
     * -------------------------------------------------------- */

    const TargetAccountBalance = await RewardNFTContract.getSolvingStatus(
      await signer.getAddress()
    )

    let t: Array<number> = []
    const len = TargetAccountBalance[0].toNumber()
    TargetAccountBalance[1].map((element: any, index: number) => {
      if (index < len) t.push(element.toNumber())
    })

    /**  --------------------------------------------------------
     * Get Problem Info
     * -------------------------------------------------------- */

    const problemsResponse = await fetch(PROBLEMS_IPFS_CID)
    const data = await problemsResponse.json()
    setProblemsInfo(data)

    let pList: Array<any> = Object.values(data)
    pList.map((element: any, index: any) => {
      if (t.includes(element.problemNumber)) {
        pList[index].solved = true
      } else {
        pList[index].solved = false
      }
      let attributes = data[pList[index].problemNumber].attributes
      if (attributes != undefined) {
        pList[index].difficulty = attributes[0].value
        pList[index].class = attributes[1].value
      } else {
        pList[index].difficulty = "undefined"
        pList[index].class = "undefined"
      }
    })
    setProblemList(pList)
    setOriginalList(pList)
  }

  useEffect(() => {
    getTokenInfoOfUser()
  }, [])

  /*front end */

  /*---------------Filter---------------*/

  const filtertag = () => {}

  /*---------------Page---------------*/
  const [page, setPage] = React.useState(1)
  const classes = useStyles()
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  /*---------------Menu 1---------------*/

  const [anchorElTag, setAnchorElTag] = React.useState<null | HTMLElement>(null)
  const openTag = Boolean(anchorElTag)
  const handleClickTag = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTag(event.currentTarget)
  }
  // filter function
  const handleCloseTag = (event) => {
    const { myValue } = event.currentTarget.dataset

    if (tagRow.includes(myValue)) {
      if (myValue === "Reset") {
        setProblemList(originalList)
      } else {
        var newArray = originalList.filter(function (el) {
          return el.class === myValue
        })
        setProblemList(newArray)
        setPage(1)
      }
    }
    setAnchorElTag(null)
  }

  /*---------------Menu 2---------------*/
  const [anchorElDiff, setAnchorElDiff] = React.useState<null | HTMLElement>(
    null
  )
  const openDiff = Boolean(anchorElDiff)
  const handleClickDiff = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElDiff(event.currentTarget)
  }
  const handleCloseDiff = (event) => {
    const { myValue } = event.currentTarget.dataset
    var numvalue = parseInt(myValue)
    if ([0, 1, 2, 3].includes(numvalue)) {
      if (numvalue === 0) {
        setProblemList(originalList)
      } else {
        var newArray = originalList.filter(function (el) {
          return el.difficulty === numvalue
        })

        setProblemList(newArray)
        setPage(1)
      }
    }
    setAnchorElDiff(null)
  }

  // const [emptyarray, setEmptyArray] = new Array(10)
  const emptyarray = Array(10).fill("")
  const emptyRows = page > 0 ? Math.max(0, page * 10 - problemList.length) : 0

  return (
    <>
      <Container
        style={{ flexDirection: "column", overflow: "visible" }}
        // maxWidth={false}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ width: "100%" }}
          sx={{ m: -3, zIndex: "fab" }}
        >
          <img src={question} height="4%" width="4%" alt="Question" />

          <Typography
            variant="h4"
            align="center"
            color="white"
            component="p"
            sx={{ typography: { lg: "h4", sm: "h6", sx: "h6" }, mx: 4 }}
          >
            Problems
          </Typography>
          <img src={question} height="4%" width="4%" alt="Question" />
        </Stack>

        <Paper
          style={{ width: "80vw" }}
          component={Stack}
          direction="column"
          justifyContent="flex-start"
          // alignItems="flex-start"
          sx={{
            pt: 0,
            pb: 2,
            px: 4,
            // width: "95%",
            overflow: "hidden",
            backgroundColor: "#1C1B29"
            // overflow: "hidden"
          }}
        >
          <Grid
            m={0}
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="flex-start"
          >
            <TableContainer style={{ width: "100%" }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                className={classes.table}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#1C1B29",
                      color: "white",
                      [`&.${tableRowClasses.root}`]: {
                        height: "2"
                      },
                      "& th": {
                        fontSize: { lg: "24px", sm: "16px" }
                      }
                    }}
                  >
                    <TableCell
                      key="tag"
                      align="center"
                      justifyContent="center"
                      onClick={handleClickTag}
                      style={{ cursor: "pointer" }}
                      sx={{
                        backgroundColor: "#1C1B29",
                        color: "white",
                        borderBottom: "5px solid white"
                      }}
                    >
                      Tag▼
                    </TableCell>
                    {/*Menu*/}
                    <StyledMenu
                      id="demo-customized-menu"
                      MenuListProps={{
                        "aria-labelledby": "demo-customized-button"
                      }}
                      anchorEl={anchorElTag}
                      open={openTag}
                      onClose={handleCloseTag}
                    >
                      {tagRow.map((row) => (
                        <MenuItem
                          key={row}
                          // onClick={(e) => clicked(item, popupState)}
                          onClick={handleCloseTag}
                          data-my-value={row}
                          // value={123}
                        >
                          {row === "Design_Pattern" ? "Design" : row}
                        </MenuItem>
                      ))}
                    </StyledMenu>
                    {/*Menu*/}
                    <TableCell
                      key="title"
                      align="flex-start"
                      // minWidth=""
                      sx={{
                        backgroundColor: "#1C1B29",
                        color: "white",
                        borderBottom: "5px solid white"
                      }}
                    >
                      Title
                    </TableCell>

                    <TableCell
                      key="Difficulty"
                      align="center"
                      style={{ cursor: "pointer" }}
                      onClick={handleClickDiff}
                      sx={{
                        backgroundColor: "#1C1B29",
                        color: "white",
                        borderBottom: "5px solid white"
                      }}
                    >
                      Difficulty▼
                    </TableCell>
                    {/*Menu*/}
                    <StyledMenu
                      id="demo-customized-menu"
                      MenuListProps={{
                        "aria-labelledby": "demo-customized-button"
                      }}
                      anchorEl={anchorElDiff}
                      open={openDiff}
                      onClose={handleCloseDiff}
                    >
                      {difficultRow.map((row) => (
                        <MenuItem
                          key={row.name}
                          onClick={handleCloseDiff}
                          data-my-value={row.value}
                        >
                          {row.name}
                        </MenuItem>
                      ))}
                    </StyledMenu>
                    {/*Menu*/}
                    <TableCell
                      key="status"
                      align="center"
                      // minWidth="350"
                      sx={{
                        backgroundColor: "#1C1B29",
                        color: "white",
                        borderBottom: "5px solid white"
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {problemList.slice(page * 10 - 10, page * 10).map((row) => {
                    return (
                      <StyledTableRow
                        hover
                        tabIndex={-1}
                        key={row}
                        style={
                          account
                            ? { cursor: "pointer" }
                            : { cursor: "not-allowed" }
                        }
                        style={{ height: "10px" }}
                        className={classes.root}
                        onClick={() => {
                          if (account) {
                            navigate("/" + row.problemNumber)
                            window.scrollTo(0, 0)
                          }
                        }}
                      >
                        <TableCell
                          key={row.id}
                          width="20%"
                          align="center"
                          sx={{
                            borderBottom: "none",
                            color: "white",
                            justifyContent: "center"
                          }}
                        >
                          <Button
                            sx={{
                              color: "white",
                              width: "60%",
                              height: "3.5vh",
                              textTransform: "none",
                              fontSize: { lg: "16px", sm: "12px" },
                              borderRadius: "20px",
                              // Type A
                              background:
                                "linear-gradient(90deg, #8ADABB 0%, #3CBA92 50.52%, #0BA360 100%)",
                              // Type B
                              ...(row.class === "Token" && {
                                background:
                                  "linear-gradient(90deg, #F78CA0 0%, #F9748F 19%, #FD868C 60%)"
                              }),
                              // Type C
                              ...(row.class === "DeFi" && {
                                background:
                                  "linear-gradient(90deg, #3B41C5 0%, #988DC4 100%)"
                              }),
                              // Type D
                              ...(row.class === "Design_Pattern" && {
                                background:
                                  "linear-gradient(90deg, #A3BDED 0%, #6991C7 100%)"
                              }),
                              // Type E
                              ...(row.class === "Company" && {
                                background:
                                  "linear-gradient(90deg, #FF5858 0%, #F09819 100%)"
                              }),
                              // Type F
                              ...(row.class === "DSA" && {
                                background:
                                  "linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                              }),
                              // Type G
                              ...(row.class === "Gas_Optim" && {
                                background:
                                  "linear-gradient(90deg, #F093FB 0%, #F5576C 100%)"
                              }),
                              ...(row.class === "Cryptgraphy" && {
                                background:
                                  "linear-gradient(90deg, #F9D423 24.48%, #EB8B8C 100%)"
                              }),
                              // Type H
                              ...(row.class === "EVM" && {
                                background:
                                  "linear-gradient(90deg, #8CB72B 0%, #96E6A1 100%)"
                              }),
                              // Type H
                              ...(row.class === "Scalability" && {
                                background:
                                  "linear-gradient(90deg, #3179A4 0%, #80D0C7 100%)"
                              })
                            }}
                          >
                            {row.class === "Design_Pattern"
                              ? "Design"
                              : row.class}
                          </Button>
                        </TableCell>
                        <TableCell
                          key={row.id}
                          width="50%"
                          // style={{ width: "60%" }}
                          // align={column.align}
                          sx={{
                            borderBottom: "none",
                            color: "white",
                            // width: "30vw",

                            fontSize: { lg: "18px", sm: "12px" }
                          }}
                        >
                          {row.problemNumber}. {row.description}
                        </TableCell>
                        <TableCell
                          key={row.id}
                          width="15%"
                          // style={{ width: "5%" }}
                          sx={{
                            borderBottom: "none",
                            color: "white"
                          }}
                        >
                          {row.difficulty === 1 && (
                            <img src={star} alt="star" width={25} height={25} />
                          )}
                          {row.difficulty === 2 && (
                            <>
                              <img
                                src={star}
                                alt="star"
                                width={25}
                                height={25}
                              />
                              <img
                                src={star}
                                alt="star"
                                width={25}
                                height={25}
                              />
                            </>
                          )}
                          {row.difficulty === 3 && (
                            <>
                              <img
                                src={star}
                                alt="star"
                                width={25}
                                height={25}
                              />
                              <img
                                src={star}
                                alt="star"
                                width={25}
                                height={25}
                              />
                              <img
                                src={star}
                                alt="star"
                                width={25}
                                height={25}
                              />
                            </>
                          )}
                        </TableCell>
                        <TableCell
                          key={row.id}
                          width="15%"
                          align="center"
                          justifyContent="center"
                          sx={{
                            // justifyContent: "center",
                            borderBottom: "none",
                            color: "white"
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            sx={{ height: "3.5vh" }}
                          >
                            {account === "" ? (
                              <img
                                width="80%"
                                height="100%"
                                src={lock}
                                alt="solved"
                              />
                            ) : row.solved ? (
                              <img
                                width="80%"
                                height="100%"
                                src={solved}
                                alt="solved"
                              />
                            ) : (
                              // <img src={lock} alt="Question" />
                              <img
                                width="80%"
                                height="100%"
                                src={trytry}
                                alt="Try"
                              />
                            )}
                          </Stack>
                        </TableCell>
                      </StyledTableRow>
                    )
                  })}

                  {emptyRows > 0 &&
                    emptyarray.slice(0, emptyRows).map((row) => {
                      return (
                        <HideRow
                          key={row}
                          className={classes.root}
                          style={{ height: "5.12vh" }}
                        >
                          <TableCell
                            colSpan={5}
                            sx={{
                              borderBottom: "none"
                            }}
                          ></TableCell>
                        </HideRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              shape="rounded"
              count={Math.floor(problemList.length / 10) + 1}
              sx={{
                mt: 2,
                button: {
                  color: "#000000",
                  backgroundColor: "white",
                  "&:hover": {
                    backgroundColor: "darkgray"
                  }
                },
                "& .Mui-selected": {
                  color: "#ffffff",
                  backgroundColor: "white"
                }
              }}
              defaultPage={1}
              page={page}
              size="medium"
              // { {lg: "large", sm: "small"} }

              // varient="'outlined'"
              onChange={handleChange}
            />
          </Grid>
        </Paper>
      </Container>
    </>
  )
}
