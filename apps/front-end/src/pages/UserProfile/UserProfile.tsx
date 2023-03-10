import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { TextExample } from "src/components/TextExample/TextExample"
import { Container } from "./styles"
import REWARD_NFT_ABI from "../../../contract-artifacts/rewardABI.json"

//frontend
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import List from "@mui/material/List"
import Stack from "@mui/material/Stack"
import { ResponsiveAppBar } from "../../components/Appbar"
import { Footer } from "../../components/Footer"
import { makeStyles } from "@material-ui/core/styles"
import TableRow, { tableRowClasses } from "@mui/material/TableRow"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import { styled } from "@mui/material/styles"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import LinearProgress from "@mui/material/LinearProgress"
import Box from "@mui/material/Box"
import star from "../../components/Img/DappChef-Asset-star.png"
import Button from "@mui/material/Button"
import lock from "../../components/Img/DappChef-Asset-lock-2.png"
import egg from "../../components/Img/egg.png"
import { CircularStatic } from "./CircleProgressBar"
import { LinearBar } from "./LinearProgressBar"
import { LinearBarText } from "./LinearBarText"

const useStyles = makeStyles({
  root: {
    "& td:first-child": {
      borderTopLeftRadius: "10px",
      borderBottomLeftRadius: "10px"
    },
    "& td:last-child": {
      borderTopRightRadius: "10px",
      borderBottomRightRadius: "10px"
    },
    position: "relative"
    // backgroundColor: "rgba(0, 0, 0, .5)"
  },
  table: {
    minWidth: "22%",
    borderCollapse: "separate",
    borderSpacing: "0px 3px",
    "& .MuiTableCell-body": {
      padding: "2px"
    }
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 0, 0.012)",
    zIndex: 2000
  },
  overlaycontent: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 2000
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
  }
}))

export const UserProfile = () => {
  const RewardNFTAddress = process.env.REWARDS_CONTRACT_ADDR as string
  const PROBLEMS_IPFS_CID = process.env.PROBLEMS_IPFS_CID as string

  const [account, setAccount] = useState("")
  const [statistics, setStatistics] = useState({
    totalAC: 0,
    totalHardAC: 0,
    totalMediumAC: 0,
    totalEasyAC: 0
  }) // 答對的題目的題號們
  const [nftImageList, setNFTImageList] = useState<Blob[]>([]) // 答對的題目的 NFT Image
  const [problemsInfo, setProblemsInfo] = useState([]) // 所有的題目的資訊
  const [problemList, setProblemList] = useState<any>([]) // 所有的題目
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.ethereum.on("accountsChanged", function (accounts: any) {
      if (accounts.length > 0) setAccount(accounts[0])
      getTokenInfoOfUser()
    })
  }, [])

  async function getTokenInfoOfUser() {
    /** --------------------------------------------------------
     * Setting up the basic ethers object
     * -------------------------------------------------------- */

    await window.ethereum.enable()
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum,
      "goerli"
    )

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
    const signerAddress = await signer.getAddress()
    const TargetAccountBalance = await RewardNFTContract.getSolvingStatus(
      signerAddress
    )
    console.log(TargetAccountBalance)
    const nSolvingProb = TargetAccountBalance[0]
    const solvingProb = TargetAccountBalance[1]
    const temp = solvingProb.map(Number)

    for (let i = 0; i < nSolvingProb; i++) {
      // Get the Target Problem TokenID of the User
      const TargetAccount_TargetProblem_TokenID =
        await RewardNFTContract.getTokenID(
          signerAddress,
          solvingProb[i].toNumber()
        )

      // Get the Target Problem TokenURI of the User
      const TargetAccount_TargetProblem_TokenURI =
        await RewardNFTContract.tokenURI(TargetAccount_TargetProblem_TokenID)

      try {
        const problemsResponse = await fetch(
          "https://nftstorage.link/ipfs/" + TargetAccount_TargetProblem_TokenURI
        )
        const data = await problemsResponse.json()
        console.log(data)
        const imageCID = data.image.toString()

        const gateway = [
          "https://ipfs.io/ipfs/",
          "https://gateway.ipfs.io/ipfs/",
          "https://gateway.pinata.cloud/ipfs/",
          "https://cloudflare-ipfs.com/ipfs/"
        ]

        try {
          const imageResponse = await fetch(imageCID)
          const image = await imageResponse.blob()
          setNFTImageList((nftImageList) => [...nftImageList, image])
        } catch {
          for (let i = 0; i < gateway.length; i++) {
            try {
              const newImageCID = imageCID.replace(
                "https://nftstorage.link/ipfs/",
                gateway[i]
              )
              const imageResponse = await fetch(newImageCID)
              const image = await imageResponse.blob()
              setNFTImageList((nftImageList) => [...nftImageList, image])
              break
            } catch {
              continue
            }
          }
        }
      } catch (e: any) {
        console.log(e)
        continue
      }
    }

    /**  --------------------------------------------------------
     * Get Problem Info
     * -------------------------------------------------------- */

    let t: Array<number> = []
    const len = TargetAccountBalance[0].toNumber()
    TargetAccountBalance[1].map((element: any, index: number) => {
      if (index < len) t.push(element.toNumber())
    })

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
    // console.log(pList)

    /**  --------------------------------------------------------
     * Get User Statistics
     * -------------------------------------------------------- */

    const totalAC = len
    let totalHardAC = 0
    let totalMediumAC = 0
    let totalEasyAC = 0
    pList.map((element: any) => {
      if (element.solved) {
        if (element.difficulty === 1) totalEasyAC += 1
        else if (element.difficulty === 2) totalMediumAC += 1
        else if (element.difficulty === 3) totalHardAC += 1
      }
    })

    setStatistics({
      totalAC: totalAC,
      totalHardAC: totalHardAC,
      totalMediumAC: totalMediumAC,
      totalEasyAC: totalEasyAC
    })

    setLoading(false)
  }

  useEffect(() => {
    getTokenInfoOfUser()
  }, [])

  /**  --------------------------------------------------------
   * Front-end
   * -------------------------------------------------------- */
  const classes = useStyles()

  console.log(statistics)

  /* Fake Data */
  const allAC = { totalEasy: 33, totalMedium: 14, totalHard: 4 }

  const [easypercent, setEasypercentt] = useState(true)
  const [mediumpercent, setMediumpercent] = useState(true)
  const [hardpercent, setHardpercent] = useState(true)

  const changeEasypercent = () => {
    if (easypercent) {
      setEasypercentt(false)
    } else {
      setEasypercentt(true)
    }
  }

  const changeMediumpercent = () => {
    if (mediumpercent) {
      setMediumpercent(false)
    } else {
      setMediumpercent(true)
    }
  }

  const changeHardpercent = () => {
    if (hardpercent) {
      setHardpercent(false)
    } else {
      setHardpercent(true)
    }
  }

  return (
    <>
      <ResponsiveAppBar />
      <main style={{ background: "#0F0B18", height: "100vh" }}>
        <Grid sx={{ py: 5, height: "100%" }} container>
          <Grid
            m={0}
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Paper
              style={{ backgroundColor: "#0F0B18" }}
              sx={{
                py: 2,

                width: "25%",
                height: "77vh",
                borderRadius: "20px",
                border: "3px solid white"
              }}
            >
              <Typography
                variant="h4"
                align="center"
                color="white"
                component="p"
                sx={{ typography: { lg: "h4", sm: "caption", sx: "caption" } }}
              >
                Badges
              </Typography>
              <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                sx={{
                  pl: 2,
                  mt: 4,
                  height: "60vh",
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: 15
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#323232",
                    borderRadius: 2
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#D9D9D9",
                    borderRadius: 2
                  }
                }}
                spacing={2}
              >
                {loading ? (
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ width: "20vw" }}
                  >
                    <Typography
                      variant="h6"
                      align="center"
                      color="white"
                      component="p"
                    >
                      Loading...
                    </Typography>
                    <Box sx={{ width: "30%", my: 3 }}>
                      <LinearProgress
                        sx={{
                          backgroundColor: `rgb(255, 255, 255,0.4)`,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: `rgb(255, 255, 255)`
                          }
                        }}
                      />
                    </Box>
                  </Stack>
                ) : (
                  <>
                    {nftImageList.map((image, i) => (
                      <>
                        <Stack
                          direction="row"
                          sx={{ width: "30%", height: "28%", m: 1 }}
                          justifyContent="flex-start"
                          alignItems="flex-start"
                          xs={10}
                          sm={4}
                          spacing={4}
                        >
                          <img
                            alt="acdf"
                            style={{ borderRadius: "50%" }}
                            src={URL.createObjectURL(image)}
                            width="100%"
                            height="100%"
                          />
                        </Stack>
                      </>
                    ))}
                  </>
                )}
              </Grid>
            </Paper>
            <Paper
              style={{ backgroundColor: "#0F0B18" }}
              sx={{
                py: 2,

                width: "25%",
                height: "77vh",
                borderRadius: "20px",
                border: "3px solid white"
              }}
            >
              <Typography
                variant="h4"
                align="center"
                color="white"
                component="p"
                sx={{ typography: { lg: "h4", sm: "caption" } }}
              >
                Solved Problem
              </Typography>
              <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                sx={{
                  pl: 3,
                  mt: 4,
                  height: "60vh",
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: 15
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#323232",
                    borderRadius: 2
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#D9D9D9",
                    borderRadius: 2
                  }
                }}
                spacing={2}
              >
                {loading ? (
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ width: "20vw" }}
                  >
                    <Typography
                      variant="h6"
                      align="center"
                      color="white"
                      component="p"
                    >
                      Loading...
                    </Typography>
                    <Box sx={{ width: "30%", my: 3 }}>
                      <LinearProgress
                        sx={{
                          backgroundColor: `rgb(255, 255, 255,0.4)`,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: `rgb(255, 255, 255)`
                          }
                        }}
                      />
                    </Box>
                  </Stack>
                ) : (
                  <TableContainer>
                    <Table
                      stickyHeader
                      aria-label="sticky table"
                      className={classes.table}
                    >
                      <TableBody>
                        {problemList.map((row) => {
                          // console.log(row)
                          return (
                            <>
                              <StyledTableRow
                                tabIndex={-1}
                                className={classes.root}
                                sx={{
                                  m: 5,
                                  "&.MuiTableRow-root:hover": {
                                    backgroundColor: row.solved
                                      ? "#0F0B18"
                                      : null
                                  }
                                }}
                              >
                                <TableCell
                                  key={row.id}
                                  align="center"
                                  style={{ width: "10%" }}
                                  sx={{
                                    mr: 2,
                                    borderBottom: "none",
                                    color: "white",
                                    justifyContent: "center",
                                    fontSize: {
                                      lg: "18px",
                                      md: "10px",
                                      xs: "10px"
                                    }
                                  }}
                                >
                                  {row.solved === false && (
                                    <div className={classes.overlay}>
                                      <div className={classes.overlaycontent}>
                                        <img
                                          src={lock}
                                          alt="lock"
                                          width={25}
                                          height={25}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  No. {row.problemNumber}
                                </TableCell>
                                <TableCell
                                  key={row.id}
                                  align="center"
                                  style={{ width: "10%" }}
                                  sx={{
                                    borderBottom: "none",
                                    color: "white",
                                    fontSize: { lg: "14px", sm: "10px" }
                                  }}
                                >
                                  <Button
                                    sx={{
                                      "&:hover": {
                                        cursor: "default"
                                      },
                                      color: "white",
                                      width: "7vw",
                                      height: "4vh",
                                      textTransform: "none",
                                      fontSize: { lg: "15px", md: "12px" },
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
                                      }),
                                      ...(row.class === "undefined" && {
                                        background: "red"
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
                                  // width="5vw"
                                  style={{ width: "10%" }}
                                  align="center"
                                  sx={{
                                    borderBottom: "none",
                                    color: "white",
                                    p: 0
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                  >
                                    <img
                                      src={star}
                                      alt="star"
                                      width={25}
                                      height={25}
                                    />
                                    {row.difficulty}
                                  </Stack>
                                </TableCell>
                              </StyledTableRow>
                            </>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Grid>
            </Paper>
            <Paper
              style={{ backgroundColor: "#0F0B18" }}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "1rem",
                py: 2,
                px: 4,
                width: "25%",
                height: "77vh",
                borderRadius: "20px",
                border: "3px solid white"
              }}
            >
              <Typography
                variant="h4"
                align="center"
                color="white"
                component="p"
                sx={{ typography: { lg: "h4", sm: "caption" } }}
              >
                User Info
              </Typography>
              <Stack
                direction="row"
                sx={{ width: "34%", height: "22%", m: 1 }}
                justifyContent="flex-start"
                alignItems="flex-start"
                xs={10}
                sm={4}
              >
                <img
                  alt="acdf"
                  style={{ borderRadius: "50%" }}
                  src={egg}
                  width="100%"
                  height="100%"
                />
              </Stack>

              <Typography
                align="center"
                variant="h5"
                style={{ color: "white" }}
                sx={{ typography: { lg: "h5", sm: "body2" } }}
              >
                {account.substring(0, 5)}...{account.slice(-5)}
              </Typography>
              <Paper
                style={{ backgroundColor: "#0F0B18", color: "#FFFFFF" }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "90%",
                  height: "10%",
                  border: "3px solid white"
                }}
              >
                <Typography
                  align="center"
                  color="white"
                  component="p"
                  sx={{ typography: { lg: "h5", sm: "caption" } }}
                >
                  Answer Record
                </Typography>
              </Paper>
              <Paper
                style={{ backgroundColor: "#0F0B18" }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  px: 1.5,
                  py: 1,
                  width: "100%",
                  height: "35%",
                  borderRadius: "20px",
                  border: "3px solid white"
                }}
              >
                {/* <Stack
                  flexDirection="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  spacing={2}
                > */}
                {loading ? (
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ width: "100%", mt: 5 }}
                  >
                    <Typography
                      variant="h6"
                      align="center"
                      color="white"
                      component="p"
                    >
                      Loading...
                    </Typography>
                    <Box sx={{ width: "30%", my: 3 }}>
                      <LinearProgress
                        sx={{
                          backgroundColor: `rgb(255, 255, 255,0.4)`,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: `rgb(255, 255, 255)`
                          }
                        }}
                      />
                    </Box>
                  </Stack>
                ) : (
                  //   <Stack
                  //   direction="column"
                  //   justifyContent="flex-start"
                  //   alignItems="flex-start"
                  //   // sx={{ width: "10%" , mt:5}}
                  // >
                  <>
                    <Typography
                      align="center"
                      color="white"
                      component="p"
                      // onClick={myFunction}
                      sx={{
                        typography: {
                          lg: "subtitle1",
                          sm: "caption",
                          xs: "caption"
                        },
                        mb: 0.5
                      }}
                    >
                      Solved Data
                    </Typography>
                    <Stack
                      direction="row"
                      // justifyContent="center"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={2}
                    >
                      <CircularStatic
                        totalAC={statistics.totalAC}
                        totalProblem={problemList.length}
                      />
                      <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        // spacing={2}
                      >
                        <Stack
                          direction="column"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ width: "10vw" }}
                        >
                          {/** 11111111111111111111 */}
                          <LinearBarText
                            difficulty="1"
                            totalAC={statistics.totalEasyAC}
                            totalProblem={allAC.totalEasy}
                            percent={easypercent}
                            changepercent={changeEasypercent}
                          />
                          <LinearBar
                            clr="41, 204, 106"
                            totalAC={statistics.totalEasyAC}
                            totalProblem={allAC.totalEasy}
                          />
                          {/** 22222222222222222222 */}
                          <LinearBarText
                            difficulty="2"
                            totalAC={statistics.totalMediumAC}
                            totalProblem={allAC.totalMedium}
                            percent={mediumpercent}
                            changepercent={changeMediumpercent}
                          />
                          <LinearBar
                            clr="204, 158, 41"
                            totalAC={statistics.totalMediumAC}
                            totalProblem={allAC.totalMedium}
                          />
                          {/** 33333333333333333333333 */}
                          <LinearBarText
                            difficulty="3"
                            totalAC={statistics.totalHardAC}
                            totalProblem={allAC.totalHard}
                            percent={hardpercent}
                            changepercent={changeHardpercent}
                          />
                          <LinearBar
                            clr="235, 109, 55"
                            totalAC={statistics.totalHardAC}
                            totalProblem={allAC.totalHard}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  </>
                  // </Stack>
                )}
                {/* totalHardAC,
      totalMediumAC: totalMediumAC,
      totalEasyAC: totalEasyAC*/}
              </Paper>

              {/* </Paper> */}
              {/* </Grid> */}
            </Paper>
          </Grid>
        </Grid>
      </main>
      <Footer />
    </>
  )
}
