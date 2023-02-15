import { useEffect, useState } from "react"
import { Container } from "./styles"
import DonationButton from "../DonationButton/donation"
import { useParams } from "react-router-dom"

import axios from "axios"
import { CodeEditor } from "./CodeEditor"

export const ProblemsInterface = () => {
  const { probNum } = useParams<{ probNum: string | undefined }>()
  const [problemsInfo, setProblemsInfo] = useState<any>()
  const [code, setCode] = useState<string>("")
  const [ans, setAns] = useState<any>()
  const [loading, setLoading] = useState(true)

  /** Problem Information Getter */

  const RewardNFTAddress = "0xaFAD4dC9C0f1D05bcB6a2dfa5123bbd27284C8d3"
  const PROBLEMS_IPFS_CID =
    "https://nftstorage.link/ipfs/bafkreias5uyk5qwoh2iwzgxriavjvlntzhkig6c7m7ygipislddf4slvqi"
  const PROBLEMS_CODE_IPFS_CID = `https://nftstorage.link/ipfs/bafybeih3xtj4u6wqu4rib6xrwkmozvrqcrfccmz3pn7cr535khthkzgu4i/${probNum}.txt`

  async function getProblems() {
    const problemsResponse = await fetch(PROBLEMS_IPFS_CID)
    const data = await problemsResponse.json()
    const target = data[probNum as string]
    setProblemsInfo(target)
    setAns(target.problemSolution)

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
            <CodeEditor {...{ code }} />
          </>
        )}
      </Container>
      <DonationButton />
    </div>
  )
}
