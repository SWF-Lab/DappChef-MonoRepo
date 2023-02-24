import { useEffect, useState } from "react"
import { TextExample } from "src/components/TextExample/TextExample"
import { Container } from "./styles"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"
import REWARD_NFT_ABI from "../../../contract-artifacts/rewardABI.json"

//front end
import { makeStyles } from "@material-ui/core/styles"
import * as React from "react"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import Pagination from "@mui/material/Pagination"
import TableRow from "@mui/material/TableRow"


// const useStyles = makeStyles((theme) => ({
//   // table: {
//   //   minWidth: 400
//   // },
//   thead: {
//     backgroundColor: "lightgray",
//     "& th:first-child": {
//       borderRadius: "1em 0 0 1em"
//     },
//     "& th:last-child": {
//       borderRadius: "0 1em 1em 0"
//     }
//   },
//   MuiTableCell: {
//     root: {
//       backgroundColor: "#fff",
//       paddingTop: 0,
//       paddingBottom: 0,
//       paddingLeft: "0.2rem",
//       paddingRight: "0.2rem",
//       borderBottom: 0,
//       overflow: "hidden",
//       textOverflow: "ellipsis",
//       "&:first-child": {
//         borderTopLeftRadius: "0.7rem",
//         borderBottomLeftRadius: "0.7rem"
//       },
//       "&:last-child": {
//         borderTopRightRadius: "0.7rem",
//         borderBottomRightRadius: "0.7rem"
//       }
//     }
//   }
// }))

// const useStyles = makeStyles({
//   root: {
//     '& td:first-child': {
//       borderTopLeftRadius: '10px',
//       borderBottomLeftRadius: '10px',
//     },
//     '& td:last-child': {
//       borderTopRightRadius: '10px',
//       borderBottomRightRadius: '10px',
//     },
//   },
// });
const useStyles = makeStyles({
  table: {
    minWidth: 650,
    borderCollapse: 'separate',
    borderSpacing: '0px 4px'
  },
  tableRow: {
    cursor: "pointer",
    borderLeft: "8px solid #9a031e",
    marginTop: "8px"
  },
  tableCell: {
    marginTop: "8px"
  }
})

interface Column {
  id: "name" | "code" | "population" | "size" | "density"
  label: string
  minWidth?: number
  align?: "right"
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "code", label: "ISO\u00a0Code", minWidth: 100 },
  {
    id: "population",
    label: "Population",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US")
  },
  {
    id: "size",
    label: "Size\u00a0(km\u00b2)",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US")
  },
  {
    id: "density",
    label: "Density",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(2)
  }
]

interface Data {
  name: string
  code: string
  population: number
  size: number
  density: number
}

function createData(
  name: string,
  code: string,
  population: number,
  size: number
): Data {
  const density = population / size
  return { name, code, population, size, density }
}

const rows = [
  createData("India", "IN", 1324171354, 3287263),
  createData("China", "CN", 1403500365, 9596961),
  createData("Italy", "IT", 60483973, 301340),
  createData("United States", "US", 327167434, 9833520),
  createData("Canada", "CA", 37602103, 9984670),
  createData("Australia", "AU", 25475400, 7692024),
  createData("Germany", "DE", 83019200, 357578),
  createData("Ireland", "IE", 4857000, 70273),
  createData("Mexico", "MX", 126577691, 1972550),
  createData("Japan", "JP", 126317000, 377973)
]



/*------------------------------------------------------ */
export const ProblemList = () => {
  const RewardNFTAddress = process.env.REWARDS_CONTRACT_ADDR as string
  const PROBLEMS_IPFS_CID = process.env.PROBLEMS_IPFS_CID as string

  const navigate = useNavigate()
  const [account, setAccount] = useState("")
  const [status, setStatus] = useState([])
  const [problemsInfo, setProblemsInfo] = useState([])
  const [problemList, setProblemList] = useState<any>([])

  const getProblems = async () => {
    const problemsResponse = await fetch(PROBLEMS_IPFS_CID)
    const data = await problemsResponse.json()
    setProblemsInfo(data)
    // console.log(data)
    const pList = Object.values(data)
    setProblemList(pList)
    // console.log(pList)
  }

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

    const TargetAccountBalance = await RewardNFTContract.getSolvingStatus(
      await signer.getAddress()
    )
    setStatus(TargetAccountBalance[1])
  }

  useEffect(() => {
    getProblems()
    getTokenInfoOfUser()
  }, [])

  /*front end */
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const classes = useStyles()

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <div>
      <Container style={{ flexDirection: "column" }}>
        {/*ji3*/}
        <Paper sx={{ width: "100%", overflow: "hidden", backgroundColor:"#1C1B29" }}>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table"   >
              <TableHead>
                <TableRow sx={{backgroundColor:"#1C1B29" , color: "white"}}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{backgroundColor:"#1C1B29" , color: "white"}}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        // className={classes.root}
                        // classes={{ root: classes.overrides }}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                        sx={{ borderRadius: '50%', backgroundColor: "red"  }}
                      // sx={{
                      //   ".MuiDataGrid-root": {
                      //     borderRadius: "50px"
                      //   },
                      //   ".MuiDataGrid-columnHeaders": {
                      //     display: "none"
                      //   },


                      // }}

                      >
                        {columns.map((column) => {
                          const value = row[column.id]
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <TextExample color="white">Problem List Page</TextExample>
        <br />
        <p style={{ color: "white" }}>Address:{account}</p>
        {problemList.map(
          (t: {
            attributes: { trait_type: string; value: number }[]
            problemNumber: number
            description: string
          }) => {
            return (
              <p
                style={{ cursor: "pointer", marginTop: "10px", color: "white" }}
                onClick={() => navigate("/" + t.problemNumber)}
              >
                {t.problemNumber} - {t.description}
              </p>
            )
          }
        )}
      </Container>
    </div>
  )
}
