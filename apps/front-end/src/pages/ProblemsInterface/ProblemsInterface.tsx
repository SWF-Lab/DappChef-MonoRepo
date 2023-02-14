import { useEffect, useState, useRef } from "react"
import { Container } from "./styles"
import Solver from "../ProblemsSolver/Solver"
import DonationButton from "../DonationButton/donation"
import { contractDoc } from "./codemirror-solidity/const"
import { useParams } from "react-router-dom"

import { solidity } from "./codemirror-solidity"
import { basicSetup } from "codemirror"
import { EditorView, keymap } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { indentWithTab } from "@codemirror/commands"

function Editor({ value, onChange }: { value: any; onChange: any }) {
  const editor = useRef<any>()
  const ref = useRef()

  useEffect(() => {
    editor.current = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          solidity,
          EditorView.updateListener.of(({ state }) => {
            onChange({ target: { value: state.doc.toString() } })
          })
        ]
      }),
      parent: ref.current
    })

    return () => {
      editor.current.destroy()
      editor.current = null
    }
  }, [])

  useEffect(() => {
    if (editor.current && editor.current.state.doc.toString() !== value) {
      editor.current.dispatch({
        changes: { from: 0, to: editor.current.state.doc.length, insert: "" }
      })
    }
  }, [value])

  return <div ref={ref as any} />
}

export const ProblemsInterface = () => {
  const { probNum } = useParams<{ probNum: string | undefined }>()
  const [problemsInfo, setProblemsInfo] = useState<any>()
  const [code, setCode] = useState(contractDoc)
  const [ans, setAns] = useState<any>()

  /** Problem Information Getter */

  const RewardNFTAddress = "0xaFAD4dC9C0f1D05bcB6a2dfa5123bbd27284C8d3"
  const PROBLEMS_IPFS_CID =
    "https://nftstorage.link/ipfs/bafkreias5uyk5qwoh2iwzgxriavjvlntzhkig6c7m7ygipislddf4slvqi"
  const PROBLEMS_CODE_IPFS_CID = `https://nftstorage.link/ipfs/bafybeih3xtj4u6wqu4rib6xrwkmozvrqcrfccmz3pn7cr535khthkzgu4i/${probNum}.txt`

  async function getProblems() {
    const problemsCodeResponse = await fetch(PROBLEMS_CODE_IPFS_CID)
    const codeData = await problemsCodeResponse.text()
    setCode(codeData)
    console.log(codeData)

    const problemsResponse = await fetch(PROBLEMS_IPFS_CID)
    const data = await problemsResponse.json()
    const target = data[probNum as string]
    setProblemsInfo(target)
    setAns(target.problemSolution)
  }

  useEffect(() => {
    getProblems()
  }, [probNum])

  return (
    <div>
      <Container style={{ flexDirection: "column" }}>
        <p>
          {problemsInfo?.problemNumber} - {problemsInfo?.description}
        </p>
        <p>{code}</p>
        <button onClick={() => setCode("")}>Clear</button>
        <Editor value={code} onChange={(e: any) => setCode(e.target.value)} />
        <Solver code={code} solution={ans} problemNo={Number(probNum)} />
      </Container>
      <DonationButton />
    </div>
  )
}
