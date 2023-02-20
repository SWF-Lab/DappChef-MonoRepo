import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { TextExample } from "src/components/TextExample/TextExample"
import { Container } from "./styles"
import REWARD_NFT_ABI from "../../../contract-artifacts/rewardABI.json"
import * as ENV from "../../const/const"

//frontend
import { ResponsiveAppBar } from "../../components/Appbar"
import { Footer } from "../../components/Footer"
import { useHook } from "../useHooks"

export const UserProfile = () => {
  const RewardNFTAddress = ENV.REWARDS_CONTRACT_ADDR
  const PROBLEMS_IPFS_CID = ENV.PROBLEMS_IPFS_CID

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
        account={account}
        toAbout={toAbout}
        onClickConnect={onClickConnect}
      />
      <main style={{ background: "black" }}>
        <Container>
          <p style={{ color: "white" }}>{account}</p>
          {loading ? (
            <>Loading...</>
          ) : (
            <>
              {nftImageList.map((image, i) => (
                <div>
                  <p>{i}</p>
                  <img
                    alt="abcdefg"
                    src={URL.createObjectURL(image)}
                    width="50"
                    height="58"
                  />
                </div>
              ))}
            </>
          )}
        </Container>
      </main>
      <Footer />
    </>
  )
}
