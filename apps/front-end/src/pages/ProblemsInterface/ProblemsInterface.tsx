import { useEffect, useState } from "react"
import { Container } from "./styles"
import DonationButton from "../DonationButton/donation"
import { useParams } from "react-router-dom"
import axios from "axios"
import { CodeEditor } from "./CodeEditor"
import * as ENV from "../../const/const"

/* front end*/
import Paper from "@mui/material/Paper"
import { useHook } from "../useHooks"
import { ResponsiveAppBar } from "../../components/Appbar"
import { Footer } from "../../components/Footer"
import Typography from "@mui/material/Typography"

export const ProblemsInterface = () => {
  const { probNum } = useParams<{ probNum: string | undefined }>()
  const [problemsInfo, setProblemsInfo] = useState<any>()
  const [code, setCode] = useState<string>("")
  const [loading, setLoading] = useState(true)

  /** Problem Information Getter */

  const RewardNFTAddress = ENV.REWARDS_CONTRACT_ADDR
  const PROBLEMS_IPFS_CID = ENV.PROBLEMS_IPFS_CID
  const PROBLEMS_CODE_IPFS_CID = `${ENV.PROBLEMS_CODE_IPFS_CID}${probNum}.txt`

  async function getProblems() {
    const problemsResponse = await fetch(PROBLEMS_IPFS_CID)
    const data = await problemsResponse.json()
    const target = data[probNum as string]
    setProblemsInfo(target)

    await axios.get(PROBLEMS_CODE_IPFS_CID).then((res) => {
      setCode(res.data.toString())
      // console.log(res.data.toString())
      return res.data
    })
    setLoading(false)
  }

  useEffect(() => {
    getProblems()
  }, [probNum])

  /*front end*/
  // const { account, onClickConnect, toAbout, toUserProfile } = useHook()

  return (
    <>
      <ResponsiveAppBar
      // account={account}
      // toAbout={toAbout}
      // onClickConnect={onClickConnect}
      // toUserProfile={toUserProfile}
      />
      <main style={{ background: "black", height: "100%" }}>
        <Container style={{ flexDirection: "column" }}>
          <Paper
            style={{ backgroundColor: "#1C1B29" }}
            sx={{
              p: 4,
              my: 5,
              width: "88%",
              borderRadius: "20px"
            }}
          >
            {loading ? (
              <>Loading...</>
            ) : (
              <>
                <Paper
                  style={{ backgroundColor: "black" }}
                  sx={{
                    py: 2,
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
                    {problemsInfo?.problemNumber} - {problemsInfo?.description}
                  </Typography>
                </Paper>
                <CodeEditor {...{ code, problemsInfo }} />
              </>
            )}
          </Paper>
        </Container>
        <DonationButton />
      </main>
      <Footer />
    </>
  )
}
