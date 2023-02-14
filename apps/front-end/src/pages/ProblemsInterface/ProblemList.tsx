import { useEffect, useState } from "react"
import { TextExample } from "src/components/TextExample/TextExample"
import { Container } from "./styles"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers" // 主要使用 ethers.js 這個套件
import REWARD_NFT_ABI from "../../../contract-artifacts/rewardABI.json"
import problems from "../../api/problems"

export default function ProblemList() {
  interface result {
    TargetAccountBalance: String
    TargetAccount_TargetProblem_TokenID: String
    TargetAccount_TargetProblem_TokenURI: String
  }

  // 所謂的 ABI 就是我們要呼叫合約函式時，ABI 會讓我們的 js/ts 知道怎麼呼叫
  const navigate = useNavigate()
  const [data, setData] = useState<result>()
  const [account, setAccount] = useState("")
  const [solProbList, setSolProbList] = useState([])
  const [probs, setProbs] = useState([])
  const [status, setStatus] = useState([])

  async function getTokenInfoOfUser() {
    /** --------------------------------------------------------
     * Setting up the basic ethers object
     * -------------------------------------------------------- */

    // 這幾個操作目的在於取得當前 Browser 中錢包（Metamask）的登入者資訊
    await window.ethereum.enable()
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum,
      "goerli"
    )
    // Signer 就會存我們的使用者資訊，例如 signer.address 可以得到當前登入者的地址

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

    const RewardNFTAddress = "0xaFAD4dC9C0f1D05bcB6a2dfa5123bbd27284C8d3"
    // process.env.REWARDS_CONTRACT_ADDR as string
    // 取得合約物件，就可以直接使用 RewardNFTContract 這個合約物件的 Member Function 來
    //     讀取變數、資料結構（Mapping）、或者 GetFunction（getSolvingStatus）

    const RewardNFTContract = new ethers.Contract(
      RewardNFTAddress,
      REWARD_NFT_ABI,
      signer
    )

    /**  --------------------------------------------------------
     * Get User Answer Status
     * -------------------------------------------------------- */

    // Get the User's finished problems
    const TargetAccountBalance = await RewardNFTContract.getSolvingStatus(
      await signer.getAddress()
      // 去抓這個 ERIC 寫對過哪些題目
      // 按照上面的例子應該是 [2, [2, 49, 0, 0, 0,...]]
    )
    console.log(TargetAccountBalance[1][0]._hex)
    setStatus(TargetAccountBalance[1])
    setProbs(await problems.getProbInfo())

    // Get the Target Problem TokenID of the User
    // const TargetAccount_TargetProblem_TokenID =
    //   await RewardNFTContract.getTokenID(
    //     await signer.getAddress(),
    //     49 // 去抓這個 ERIC 的第四十九題的 TokenID
    //     // 按照上面的例子應該是 6
    //   )

    // Get the Target Problem TokenURI of the User
    // const TargetAccount_TargetProblem_TokenURI =
    //   await RewardNFTContract.tokenURI(
    //     TargetAccount_TargetProblem_TokenID
    //     // 去抓這個 ERIC 的第四十九題的 TokenURI
    //     // 按照上面的例子應該是 ipfs://2f9…y2z
    //   )
    // return {
    //   TargetAccountBalance: TargetAccountBalance,
    //   TargetAccount_TargetProblem_TokenID: TargetAccount_TargetProblem_TokenID,
    //   TargetAccount_TargetProblem_TokenURI: TargetAccount_TargetProblem_TokenURI
    // }
    // Go to IPFS to get Image or others information with TokenURI
  }

  useEffect(() => {
    getTokenInfoOfUser()
    // problems.getProbInfo()
    // problems.getProbInfo().then((res)=>{
    //     console.log(res)
    // })
    // setData(problems.getProbInfo())
    // console.log(data)

    // await window.ethereum.enable()
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // // Signer 就會存我們的使用者資訊，例如 signer.address 可以得到當前登入者的地址
    // const signer = provider.getSigner()
  }, [])

  return (
    <div>
      <Container style={{ flexDirection: "column" }}>
        <TextExample>Problem List Page</TextExample>
        <br />
        <p>Address:{account}</p>
        {probs.map(
          (t: {
            probNum: number
            description: String
            image: String
            status?: number
          }) => {
            if (t.probNum)
              return (
                <p
                  style={{ cursor: "pointer", marginTop: "10px" }}
                  onClick={() => navigate("/ProblemsInterface/" + t.probNum)}
                >
                  {parseInt(status[t.probNum], 16) === 0 ? (
                    <>[Unsolved]</>
                  ) : (
                    <>[Solved]</>
                  )}
                  {t.probNum}. {t.description}
                </p>
              )
          }
        )}
      </Container>
      <Container>{/* <div>TODO: User Profile</div> */}</Container>
    </div>
  )
}
