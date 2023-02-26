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
// import Grid from "@mui/material/Grid"
import { styled } from "@mui/material/styles"
// import Typography from "@mui/material/Typography"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import Button from "@mui/material/Button"

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
    minWidth: "22%",
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
    backgroundColor: "red",
    //  borderColor: 'yellow',
    borderBottom: "5px solid white",
    borderBottomWidth: "5px",
    borderBottomStyle: "solid",
    borderBottomColor: "white"
  },
  "&:hover": {
    borderBottom: "5px solid white",
    borderBottomWidth: "5px",
    borderBottomStyle: "solid",
    borderBottomColor: "white"
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
      console.log(solvingProb[i].toNumber())
      // Get the Target Problem TokenID of the User
      const TargetAccount_TargetProblem_TokenID =
        await RewardNFTContract.getTokenID(
          signerAddress,
          solvingProb[i].toNumber()
        )

      // Get the Target Problem TokenURI of the User
      const TargetAccount_TargetProblem_TokenURI =
        await RewardNFTContract.tokenURI(TargetAccount_TargetProblem_TokenID)

      const problemsResponse = await fetch(TargetAccount_TargetProblem_TokenURI)
      const data = await problemsResponse.json()
      const imageCID = data.image.toString()

      const imageResponse = await fetch(imageCID)
      const image = await imageResponse.blob()

      setNFTImageList((nftImageList) => [...nftImageList, image])
      console.log(image)
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
    console.log(pList)

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

  return (
    <>
      <ResponsiveAppBar />
      <main style={{ background: "#0F0B18", height: "100%" }}>
        <Grid sx={{ py: 5, height: "100%" }} maxWidth="xl">
          <Grid
            m={0}
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="flex-start"
          >
            <Paper
              style={{ backgroundColor: "black" }}
              sx={{
                py: 2,

                width: "25%",
                height: "77vh",
                borderRadius: "20px",
                border: "5px solid white"
              }}
            >
              <Typography
                variant="h4"
                align="center"
                color="white"
                component="p"
                sx={{ typography: { lg: "h4", sm: "body1" } }}
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
                  <Typography
                    variant="h6"
                    align="center"
                    color="white"
                    component="p"
                  >
                    Loading...
                  </Typography>
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
              style={{ backgroundColor: "black" }}
              sx={{
                py: 2,

                width: "25%",
                height: "77vh",
                borderRadius: "20px",
                border: "5px solid white"
              }}
            >
              <Typography
                variant="h4"
                align="center"
                color="white"
                component="p"
                sx={{ typography: { lg: "h4", sm: "body1" } }}
              >
                Solved Problem
              </Typography>
              <Grid
                container
                direction="row"
                justifyContent="center"
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
                <TableContainer>
                  <Table
                    stickyHeader
                    aria-label="sticky table"
                    className={classes.table}
                  >
                    <TableBody>
                      {problemList.map((row) => {
                        return (
                          <StyledTableRow
                            hover
                            tabIndex={-1}
                            key={row}
                            className={classes.root}
                          >
                            <TableCell
                              key={row.id}
                              // width="5vw"
                              align="center"
                              sx={{
                                borderBottom: "none",
                                color: "white",
                                justifyContent: "center",
                                fontSize: { lg: "18px", sm: "12px" }
                              }}
                            >
                              No. {row.problemNumber}
                            </TableCell>
                            <TableCell
                              key={row.id}
                              sx={{
                                borderBottom: "none",
                                color: "white",
                                fontSize: { lg: "18px", sm: "12px" }
                              }}
                            >
                              <Button
                                //  disabled
                                sx={{
                                  color: "white",
                                  width: "8vw",
                                  height: "4vh",
                                  fontSize: { lg: "16px", sm: "12px" },
                                  borderRadius: "20px",
                                  cursor: "auto",
                                  background:
                                    "linear-gradient(90deg, #43E97B 0%, #38F9D7 100%)"
                                }}
                              >
                                Type A
                              </Button>
                            </TableCell>
                            <TableCell
                              key={row.id}
                              width="5vw"
                              // align={column.align}
                              sx={{
                                borderBottom: "none",
                                color: "white"
                              }}
                            >
                              {"star"}
                            </TableCell>
                          </StyledTableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Paper>
            <Paper
              style={{ backgroundColor: "black" }}
              sx={{
                py: 2,
                px: 4,
                width: "25%",
                height: "77vh",
                borderRadius: "20px",
                border: "5px solid white"
              }}
            >
              <Typography
                variant="h4"
                align="center"
                color="white"
                component="p"
                sx={{ typography: { lg: "h4", sm: "body1" } }}
              >
                User Info
              </Typography>

              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{ mt: 2 }}
              >
                <img
                  alt="acdf"
                  style={{ borderRadius: "50%" }}
                  src="http://cdn.shopify.com/s/files/1/0577/1254/1891/collections/CqG1bnp9Gy89e1Hl.jpg?v=1666354550"
                  width="50%"
                  height="50%"
                />
              </Stack>

              <Typography
                align="center"
                variant="h5"
                style={{ color: "white" }}
                sx={{ mt: 2, typography: { lg: "h5", sm: "body2" } }}
              >
                {account.substring(0, 5)}...{account.slice(-5)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </main>
      <Footer />
    </>
  )
}
