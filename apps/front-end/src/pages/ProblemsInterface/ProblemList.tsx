import { useEffect, useState } from "react"
import { TextExample } from "src/components/TextExample/TextExample"
import { Container } from "./styles"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"
import REWARD_NFT_ABI from "../../../contract-artifacts/rewardABI.json"

export default function ProblemList() {
  const RewardNFTAddress = "0xaFAD4dC9C0f1D05bcB6a2dfa5123bbd27284C8d3"
  const PROBLEMS_IPFS_CID =
    "https://nftstorage.link/ipfs/bafkreias5uyk5qwoh2iwzgxriavjvlntzhkig6c7m7ygipislddf4slvqi"

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
    console.log(TargetAccountBalance[1][0]._hex)
    setStatus(TargetAccountBalance[1])
  }

  useEffect(() => {
    getProblems()
    getTokenInfoOfUser()
  }, [])

  return (
    <div>
      <Container style={{ flexDirection: "column" }}>
        <TextExample>Problem List Page</TextExample>
        <br />
        <p>Address:{account}</p>
        {problemList.map(
          (t: {
            attributes: { trait_type: string; value: number }[]
            problemNumber: number
            description: string
          }) => {
            return (
              <p
                style={{ cursor: "pointer", marginTop: "10px" }}
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
