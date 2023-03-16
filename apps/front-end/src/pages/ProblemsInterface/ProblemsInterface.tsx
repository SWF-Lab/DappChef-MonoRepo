import { useEffect, useState } from "react"
import { Container } from "./styles"
import { useParams } from "react-router-dom"
import axios from "axios"
import { CodeEditor } from "./CodeEditor"
import { ethers } from "ethers"
import REWARD_NFT_ABI from "../../../contract-artifacts/rewardABI.json"

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
import LinearProgress from "@mui/material/LinearProgress"
import Box from "@mui/material/Box"
import lock from "../../components/Img/DappChef-Asset-lock-2.png"

export const ProblemsInterface = () => {
  const { probNum } = useParams<{ probNum: string | undefined }>()
  const [problemsInfo, setProblemsInfo] = useState<any>()
  const [code, setCode] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [solved, setSolved] = useState(false)
  const [nftImage, setNFTImage] = useState<Blob>() // 答對的題目的 NFT Image

  /** Problem Information Getter */

  const RewardNFTAddress = process.env.REWARDS_CONTRACT_ADDR as string
  const PROBLEMS_IPFS_CID = process.env.PROBLEMS_IPFS_CID as string
  const PROBLEMS_CODE_IPFS_CID = `${process.env.PROBLEMS_CODE_IPFS_CID}${probNum}.txt`

  async function getProblems() {
    /**  --------------------------------------------------------
     * Get Problem Info
     * -------------------------------------------------------- */

    const problemsResponse = await fetch(PROBLEMS_IPFS_CID)
    const data = await problemsResponse.json()
    const target = data[probNum as string]
    setProblemsInfo(target)

    await axios.get(PROBLEMS_CODE_IPFS_CID).then((res) => {
      setCode(res.data.toString())
      return res.data
    })

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

    provider.send("eth_requestAccounts", []).catch((e) => console.log(e))

    const signer = provider.getSigner()

    const RewardNFTContract = new ethers.Contract(
      RewardNFTAddress,
      REWARD_NFT_ABI,
      signer
    )

    try {
      const TargetAccountBalance = await RewardNFTContract.getSolvingStatus(
        await signer.getAddress()
      )
      const len = TargetAccountBalance[0].toNumber()
      let _solved = false
      TargetAccountBalance[1].map((element: any, index: number) => {
        if (index < len && element.toNumber() == probNum) {
          setSolved(true)
          _solved = true
          console.log("This problem has been solved!")
        }
      })

      if (!_solved) {
        setLoading(false)
        console.log("This problem has not been solved!")
        return
      }

      /**  --------------------------------------------------------
       * Get Problem Image
       * -------------------------------------------------------- */

      const TargetAccount_TargetProblem_TokenID =
        await RewardNFTContract.getTokenID(await signer.getAddress(), probNum)

      // Get the Target Problem TokenURI of the User
      const TargetAccount_TargetProblem_TokenURI =
        await RewardNFTContract.tokenURI(TargetAccount_TargetProblem_TokenID)

      const tokenResponse = await fetch(
        "https://nftstorage.link/ipfs/" + TargetAccount_TargetProblem_TokenURI
      )
      const token = await tokenResponse.json()
      const imageCID = token.image.toString()
      const imageResponse = await fetch(imageCID)
      const image = await imageResponse.blob()
      setNFTImage(image)
    } catch (e: any) {
      console.log(e)
    }

    setLoading(false)
  }

  useEffect(() => {
    const setLockImage = async () => {
      const lock = await fetch("https://i.imgur.com/nQhWIQHs.png").then((r) =>
        r.blob()
      )
      setNFTImage(lock)
    }
    setLockImage()
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
                  <>
                    <Typography
                      variant="h4"
                      align="center"
                      color="white"
                      component="p"
                      sx={{ typography: { lg: "h4", sm: "body1" } }}
                    >
                      Loading...
                    </Typography>
                    <Box sx={{ width: "20%", my: 3 }}>
                      <LinearProgress
                        sx={{
                          borderRadius: 5,
                          backgroundColor: `rgb(255, 255, 255,0.4)`,
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 5,
                            backgroundColor: `rgb(255, 255, 255)`
                          }
                        }}
                      />
                    </Box>
                  </>
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
                        // spacing={2}
                      >
                        <Stack
                          direction="column"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                          spacing={3}
                          sx={{ width: "75%" }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={{ lg: 5, md: 3, sm: 1 }}
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
                                height: "23px",
                                textTransform: "none",
                                fontSize: {
                                  lg: "20px",
                                  md: "14px",
                                  sm: "12px"
                                },
                                borderRadius: "20px",
                                // Type A
                                background:
                                  "linear-gradient(90deg, #8ADABB 0%, #3CBA92 50.52%, #0BA360 100%)",
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
                              {problemsInfo.attributes[1].value ===
                              "Design_Pattern"
                                ? "Design"
                                : problemsInfo.attributes[1].value}
                              {/* {problemsInfo.attributes[1].value} */}
                            </Button>

                            <Stack
                              direction="row"
                              justifyContent="space-evenly"
                              alignItems="flex-start"
                              // sx={{ width: largeWidth >= 1300 ? '9vw' : '7vw' }}
                              sx={{
                                width: { lg: "6vw", md: "6vw", sm: "6vw" },
                                // display:{sm:"none", md:"inline-block"}
                                flexWrap: "nowrap",
                                display: {
                                  xs: "none",
                                  sm: "none",
                                  md: "inline-block",
                                  lg: "inline-block"
                                }
                              }}
                            >
                              {problemsInfo.attributes[0].value === 1 && (
                                <img
                                  src={star}
                                  alt="star"
                                  width="45%"
                                  height="45%"
                                />
                              )}
                              {problemsInfo.attributes[0].value === 2 && (
                                <>
                                  <img
                                    src={star}
                                    alt="star"
                                    width="45%"
                                    height="45%"
                                    // width={45}
                                    // height={45}
                                  />
                                  <img
                                    src={star}
                                    alt="star"
                                    // width={45}
                                    // height={45}
                                    width="45%"
                                    height="45%"
                                  />
                                </>
                              )}
                              {problemsInfo.attributes[0].value === 3 && (
                                <>
                                  <img
                                    src={star}
                                    alt="star"
                                    width="45%"
                                    height="45%"
                                  />
                                  <img
                                    src={star}
                                    alt="star"
                                    width="45%"
                                    height="45%"
                                  />
                                  <img
                                    src={star}
                                    alt="star"
                                    width="45%"
                                    height="45%"
                                  />
                                </>
                              )}
                            </Stack>
                            <Button
                              sx={{
                                "&:hover": {
                                  cursor: "pointer",
                                  color: "black"
                                },
                                color: "white",
                                width: "12vw",
                                height: "23px",
                                textTransform: "none",
                                fontSize: {
                                  lg: "20px",
                                  md: "14px",
                                  sm: "12px"
                                },
                                borderRadius: "20px",
                                // Type A
                                background:
                                  "linear-gradient(90deg, #16D9E3 0%, #30C7EC 56.25%, #46AEF7 100%)"
                              }}
                              target="_blank"
                              href="https://github.com/SWF-Lab/DappChef/discussions"
                            >
                              {" "}
                              Discussion
                            </Button>
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
                        <Stack
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center"
                          spacing={5}
                          // sx={{ width: "50%" }}
                        ></Stack>
                        <img
                          alt="acdf"
                          style={{ borderRadius: "50%" }}
                          src={URL.createObjectURL(nftImage as Blob)}
                          width="15%"
                          height="15%"
                        />
                      </Grid>
                    </Paper>
                    {/*Ads*/}
                    <Paper
                      style={{ backgroundColor: "#1C1B29" }}
                      sx={{
                        m: 1,
                        mb: 2,
                        width: "100%",
                        borderRadius: "15px",
                        border: "3px solid white"
                      }}
                    >
                      <div style={{ borderRadius: "15px", overflow: "hidden" }}>
                        <Ads />
                      </div>
                    </Paper>
                    <CodeEditor {...{ code, problemsInfo, solved }} />
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
