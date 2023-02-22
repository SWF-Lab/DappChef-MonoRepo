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
import { useHook } from "../useHooks"

export const UserProfile = () => {
  const RewardNFTAddress = process.env.REWARDS_CONTRACT_ADDR
  const PROBLEMS_IPFS_CID = process.env.PROBLEMS_IPFS_CID

  const [account, setAccount] = useState("")
  const [status, setStatus] = useState([]) // 答對的題目的題號們
  const [nftImageList, setNFTImageList] = useState<Blob[]>([]) // 答對的題目的 NFT Image
  const [problemsInfo, setProblemsInfo] = useState([]) // 所有的題目的資訊
  const [problemList, setProblemList] = useState<any>([]) // 所有的題目
  const [loading, setLoading] = useState(true)

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
    const signerAddress = await signer.getAddress()
    const TargetAccountBalance = await RewardNFTContract.getSolvingStatus(
      signerAddress
    )
    console.log(TargetAccountBalance)
    const nSolvingProb = TargetAccountBalance[0]
    const solvingProb = TargetAccountBalance[1]
    const temp = solvingProb.map(Number)
    setStatus(temp)

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

    setLoading(false)
  }

  useEffect(() => {
    getProblems()
    getTokenInfoOfUser()
  }, [])

  /**  --------------------------------------------------------
   * Front-end
   * -------------------------------------------------------- */
  const { onClickConnect, toAbout } = useHook()

  return (
    <>
      <ResponsiveAppBar
      // account={account}
      // toAbout={toAbout}
      // onClickConnect={onClickConnect}
      />
      <main style={{ background: "black", height: "100%" }}>
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
                          {/* <item justify="center" key={i} xs={10} sm={4}> */}
                          {/* <Typography
                            variant="body2"
                            align="center"
                            color="white"
                          >
                            {i}
                          </Typography> */}
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
              {" "}
              <Typography
                variant="h4"
                align="center"
                color="white"
                component="p"
                sx={{ typography: { lg: "h4", sm: "body1" } }}
              >
                Solved Problem
              </Typography>
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
