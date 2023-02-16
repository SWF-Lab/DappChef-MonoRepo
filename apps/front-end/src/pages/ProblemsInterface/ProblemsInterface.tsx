import { useEffect, useState } from "react"
import { Container } from "./styles"
import DonationButton from "../DonationButton/donation"
import { useParams } from "react-router-dom"
import axios from "axios"
import { CodeEditor } from "./CodeEditor"
import * as ENV from "../../const/const"

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

  return (
    <div>
      <Container style={{ flexDirection: "column" }}>
        {loading ? (
          <>Loading...</>
        ) : (
          <>
            <p>
              {problemsInfo?.problemNumber} - {problemsInfo?.description}
            </p>
            <CodeEditor {...{ code, problemsInfo }} />
          </>
        )}
      </Container>
      <DonationButton />
    </div>
  )
}
