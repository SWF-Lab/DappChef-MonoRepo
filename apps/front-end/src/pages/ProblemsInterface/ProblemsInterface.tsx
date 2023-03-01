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
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Ads from "../../components/Ads.tsx"
import star from "../../components/Img/DappChef-Asset-star.png"

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
      <ResponsiveAppBar />
      <main style={{ background: "#0F0B18", height: "100%" }}>
        <Container
          style={{ flexDirection: "column", height: "100%" }}
          // minWidth="xl"
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
              // style={{ backgroundColor: "white" }}
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
                        px: 3,
                        m: 1,
                        width: "100%",
                        borderRadius: "15px",
                        border: "3px solid white"
                      }}
                    >
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Stack
                          direction="column"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                          spacing={3}
                          sx={{ width: "70%" }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={5}
                            // sx={{ width: "50%" }}
                          >
                            <Typography
                              variant="h4"
                              align="center"
                              color="white"
                              component="p"
                              sx={{ typography: { lg: "h4", sm: "body1" } }}
                            >
                              No. {problemsInfo?.problemNumber}
                            </Typography>
                            <Button
                              sx={{
                                "&:hover": {
                                  cursor: "default"
                                },
                                color: "white",
                                width: "10vw",
                                height: "6vh",
                                textTransform: "none",
                                fontSize: { lg: "20px", sm: "14px" },
                                borderRadius: "20px",
                                // Type A
                                background:
                                  "linear-gradient(90deg, #43E97B 0%, #38F9D7 100%)",
                                // Type B
                                ...(problemsInfo.attributes[1].value ===
                                  "Token" && {
                                  background:
                                    "linear-gradient(90deg, #F78CA0 0%, #F9748F 19%, #FD868C 60%)"
                                }),
                                // Type C
                                ...(problemsInfo.attributes[1].value ===
                                  "DeFi" && {
                                  background:
                                    "linear-gradient(90deg, #3B41C5 0%, #988DC4 100%)"
                                }),
                                // Type D
                                ...(problemsInfo.attributes[1].value ===
                                  "Design_Pattern" && {
                                  background:
                                    "linear-gradient(90deg, #A3BDED 0%, #6991C7 100%)"
                                }),
                                // Type E
                                ...(problemsInfo.attributes[1].value ===
                                  "Company" && {
                                  background:
                                    "linear-gradient(90deg, #FF5858 0%, #F09819 100%)"
                                }),
                                // Type F
                                ...(problemsInfo.attributes[1].value ===
                                  "DSA" && {
                                  background:
                                    "linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                                }),
                                // Type G
                                ...(problemsInfo.attributes[1].value ===
                                  "Gas_Optim" && {
                                  background:
                                    "linear-gradient(90deg, #F093FB 0%, #F5576C 100%)"
                                }),
                                ...(problemsInfo.attributes[1].value ===
                                  "Cryptgraphy" && {
                                  background:
                                    "linear-gradient(90deg, #F9D423 24.48%, #EB8B8C 100%)"
                                }),
                                // Type H
                                ...(problemsInfo.attributes[1].value ===
                                  "EVM" && {
                                  background:
                                    "linear-gradient(90deg, #8CB72B 0%, #96E6A1 100%)"
                                }),
                                // Type H
                                ...(problemsInfo.attributes[1].value ===
                                  "Scalability" && {
                                  background:
                                    "linear-gradient(90deg, #3179A4 0%, #80D0C7 100%)"
                                })
                              }}
                            >
                              {problemsInfo.attributes[1].value}
                            </Button>
                            {problemsInfo.attributes[0].value === 1 && (
                              <img
                                src={star}
                                alt="star"
                                width={45}
                                height={45}
                              />
                            )}
                            {problemsInfo.attributes[0].value === 2 && (
                              <>
                                <img
                                  src={star}
                                  alt="star"
                                  width={45}
                                  height={45}
                                />
                                <img
                                  src={star}
                                  alt="star"
                                  width={45}
                                  height={45}
                                />
                              </>
                            )}
                            {problemsInfo.attributes[0].value === 3 && (
                              <>
                                <img
                                  src={star}
                                  alt="star"
                                  width={45}
                                  height={45}
                                />
                                <img
                                  src={star}
                                  alt="star"
                                  width={45}
                                  height={45}
                                />
                                <img
                                  src={star}
                                  alt="star"
                                  width={45}
                                  height={45}
                                />
                              </>
                            )}
                          </Stack>
                          <Typography
                            variant="h4"
                            align="flex-start"
                            color="white"
                            component="p"
                            sx={{ typography: { lg: "h5", sm: "body2" } }}
                          >
                            {problemsInfo?.description}
                          </Typography>
                        </Stack>
                        <img
                          alt="acdf"
                          style={{ borderRadius: "50%" }}
                          src="http://cdn.shopify.com/s/files/1/0577/1254/1891/collections/BbuhVewRthymtZ6p.jpg?v=1666354012"
                          width="15%"
                          height="15%"
                        />
                      </Grid>
                    </Paper>
                    {/*Ads*/}
                    <Paper
                      style={{ backgroundColor: "#1C1B29" }}
                      sx={{
                        pt: 2,
                        m: 1,
                        mb: 2,
                        width: "100%",
                        borderRadius: "15px",
                        border: "3px solid white"
                      }}
                    >
                      <Typography
                        variant="h4"
                        align="center"
                        color="white"
                        component="p"
                        sx={{ typography: { lg: "h4", sm: "body1" } }}
                      >
                        <Ads />
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
