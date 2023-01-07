import { useState } from "react"
import { TextExample } from "src/components/TextExample/TextExample"
import { Container } from "./styles"
import CodeMirror from "./useCodeMirror"
import { contractDoc } from "./codemirror-solidity/const"

export const ProblemsInterface = () => {
  const [code, setCode] = useState(contractDoc)

  return (
    <div>
      <Container>
        <TextExample>Problems Interface</TextExample>
      </Container>
      <Container>
        <CodeMirror
          value={code}
          onChange={(e: any) => setCode(e.target.value)}
        />
      </Container>
      <Container>
        <h3>Result</h3>
        {/* <pre>{code}</pre> */}
        <button onClick={() => setCode("")}>Clear</button>
        <button onClick={() => setCode("")}>Compile</button>
      </Container>
    </div>
  )
}
