import { useEffect, useState } from "react"
import { TextExample } from "src/components/TextExample/TextExample"
import { Container } from "./styles"
import CodeMirror from "./useCodeMirror"
import ProblemList from "./ProblemList"
import { contractDoc } from "./codemirror-solidity/const"
import Solver from "../ProblemsSolver/Solver"
import DonationButton from "../DonationButton/donation"
import { useParams } from "react-router-dom"
import problems from "../../api/problems"

export const ProblemsInterface = () => {
  const { probNum } = useParams<{ probNum: string | undefined }>()
  const [found, setFound] = useState(false)
  const [code, setCode] = useState("dapp")
  const [info, setInfo] = useState<{
    description?: String
    image?: String
  }>({})

  const [ans, setAns] = useState("")

  async function getProb(probNum: string | undefined) {
    if (probNum !== undefined) {
      setCode(await problems.getProbTxt(probNum))
      setInfo(await problems.getProbJson(probNum))
      setAns(await problems.getProbAns(probNum))
      setFound(true)
    } else {
      setFound(false)
    }
  }

  useEffect(() => {
    getProb(probNum)
    if (probNum === undefined) {
      setFound(false)
    }
  }, [probNum])

  return probNum === undefined ? (
    <>
      <Container>
        <TextExample>Problems Interface</TextExample>
      </Container>
      <Container>
        <ProblemList />
      </Container>
    </>
  ) : found ? (
    <div>
      <Container style={{ flexDirection: "column" }}>
        <p>{info.description}</p>
        <button onClick={() => setCode("")}>Clear</button>
        <CodeMirror
          value={code}
          onChange={(e: any) => setCode(e.target.value)}
        />
        <Solver code={code} solution={ans} problemNo={Number(probNum)} />
      </Container>
      <DonationButton />
    </div>
  ) : (
    <>載入中</>
  )
}
