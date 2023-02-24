import { useEffect, useState } from "react"
import { Container } from "./styles"
import { useParams } from "react-router-dom"
import axios from "axios"
import { CodeEditor } from "./CodeEditor"

/* front end*/
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
// import { useHook } from "../useHooks"
import { ResponsiveAppBar } from "../../components/Appbar"
import { Footer } from "../../components/Footer"
import Typography from "@mui/material/Typography"

export const ProblemsInterface = () => {
  const { probNum } = useParams<{ probNum: string | undefined }>()
  const [problemsInfo, setProblemsInfo] = useState<any>()
  const [code, setCode] = useState<string>("")
  const [loading, setLoading] = useState(true)

  /** Problem Information Getter */

  const RewardNFTAddress = process.env.REWARDS_CONTRACT_ADDR
  const PROBLEMS_IPFS_CID = process.env.PROBLEMS_IPFS_CID as string
  const PROBLEMS_CODE_IPFS_CID = `${process.env.PROBLEMS_CODE_IPFS_CID}${probNum}.txt`

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
      <main style={{ background: "#0F0B18", height: "100%" }}>
        <Container
          style={{ flexDirection: "column", height: "100%" }}
          minWidth="xl"
        >
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            sx={{
              py: 2,
              my: 5,
              height: "100%"
            }}
            maxWidth="xl"
          >
            <Paper
              style={{ backgroundColor: "#1C1B29" }}
              sx={{
                py: 2,
                px: 8,
                my: 0,
                width: "88%",
                height: "80%",
                borderRadius: "18px"
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="space-around"
                alignItems="center"
                sx={{ m: 0 }}
              >
                {loading ? (
                  <Typography
                    variant="h4"
                    align="center"
                    color="white"
                    component="p"
                    sx={{ typography: { lg: "h4", sm: "body1" } }}
                  >
                    Loading...
                  </Typography>
                ) : (
                  <>
                    <Paper
                      style={{ backgroundColor: "#1C1B29" }}
                      sx={{
                        py: 2,
                        m: 1,
                        width: "100%",
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
                        {problemsInfo?.problemNumber} -{" "}
                        {problemsInfo?.description}
                      </Typography>
                    </Paper>
                    {/*Ads*/}
                    <Paper
                      style={{ backgroundColor: "#1C1B29" }}
                      sx={{
                        pt: 2,
                        m: 1,
                        mb: 2,
                        width: "100%",
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
                        Ads
                      </Typography>
                    </Paper>
                    <CodeEditor {...{ code, problemsInfo }} />
                  </>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Container>
      </main>
      <Footer />
    </>
  )
}
