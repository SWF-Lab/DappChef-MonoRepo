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
import { styled } from "@mui/material/styles"
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
    minWidth: 650,
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

const columns: readonly Column[] = [
  { id: "tag", label: "Tag", align: "center" },
  { id: "title", label: "Title", minWidth: 350 },
  {
    id: "difficulty",
    label: "Difficulty"
  },
  {
    id: "status",
    label: "Status",
    align: "center"
  }
]

/*------------------------------------------------------ */
export const ProblemList = () => {
  const RewardNFTAddress = process.env.REWARDS_CONTRACT_ADDR as string
  const PROBLEMS_IPFS_CID = process.env.PROBLEMS_IPFS_CID as string

  const navigate = useNavigate()
  const [account, setAccount] = useState("")
  const [problemsInfo, setProblemsInfo] = useState([])
  const [problemList, setProblemList] = useState<any>([])

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
  }

  useEffect(() => {
    getTokenInfoOfUser()
  }, [])

  /*front end */
  const [page, setPage] = React.useState(1)
  const classes = useStyles()

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  return (
    <>
      <Container style={{ flexDirection: "column" }}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ m: -3, zIndex: "fab" }}
        >
          <img src={question} alt="Question" />

          <Typography
            variant="h4"
            align="center"
            color="white"
            component="p"
            sx={{ typography: { lg: "h4", sm: "h6", sx: "h6" }, mx: 4 }}
          >
            Problems
          </Typography>
          <img src={question} alt="Question" />
        </Stack>

        <Paper
          component={Stack}
          direction="column"
          justifyContent="center"
          sx={{
            pt: 0,
            pb: 2,
            px: 4,
            // width: "95%",
            overflow: "hidden",
            backgroundColor: "#1C1B29"
          }}
        >
          <Grid
            m={0}
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="flex-start"
          >
            <TableContainer>
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
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{
                          backgroundColor: "#1C1B29",
                          color: "white",
                          borderBottom: "5px solid white"
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
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
                        className={classes.root}
                        onClick={() =>
                          account ? navigate("/" + row.problemNumber) : null
                        }
                      >
                        <TableCell
                          key={row.id}
                          width="5vw"
                          align="center"
                          sx={{
                            borderBottom: "none",
                            color: "white",
                            justifyContent: "center",
                            "&:hover": {
                              borderBottom: "5px solid white",
                              borderBottomWidth: "5px",
                              borderBottomStyle: "solid",
                              borderBottomColor: "white"
                            }
                          }}
                        >
                          <Button
                            sx={{
                              color: "white",
                              width: "8vw",
                              height: "4vh",
                              fontSize: { lg: "16px", sm: "12px" },
                              borderRadius: "20px",

                              background:
                                "linear-gradient(90deg, #43E97B 0%, #38F9D7 100%)"
                            }}
                          >
                            Type A
                          </Button>
                        </TableCell>
                        <TableCell
                          key={row.id}
                          style={{ width: "90vh" }}
                          // align={column.align}
                          sx={{
                            borderBottom: "none",
                            color: "white",
                            width: "50vw",

                            fontSize: { lg: "18px", sm: "12px" }
                          }}
                        >
                          {row.problemNumber}. {row.description}
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
                        <TableCell
                          key={row.id}
                          width="5vw"
                          align="center"
                          sx={{
                            justifyContent: "center",
                            borderBottom: "none",
                            color: "white"
                          }}
                        >
                          {account ? (
                            <img src={trytry} alt="Try" />
                          ) : (
                            <img src={lock} alt="Question" />
                          )}
                        </TableCell>
                      </StyledTableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={Math.floor(problemList.length / 10)}
              sx={{ button: { color: "#ffffff" } }}
              defaultPage={1}
              page={page}
              size="large"
              onChange={handleChange}
            />
          </Grid>
        </Paper>
      </Container>
    </>
  )
}
