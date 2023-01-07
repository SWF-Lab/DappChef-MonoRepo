import { useState } from "react"
import { TextExample } from "src/components/TextExample/TextExample"
import { Container } from "./styles"
import CodeMirror from "./useCodeMirror"
import { contractDoc } from "./codemirror-solidity/const"
import Solver from "../ProblemsSolver/Solver"

export const ProblemsInterface = () => {
  const [code, setCode] = useState(contractDoc)

  return (
    <div>
      <Container>
        <TextExample>Problems Interface</TextExample>
      </Container>
      <Container>
        <button onClick={() => setCode("")}>Clear</button>
        <CodeMirror
          value={code}
          onChange={(e: any) => setCode(e.target.value)}
        />
        <Solver value={code} />
      </Container>
    </div>
  )
}
