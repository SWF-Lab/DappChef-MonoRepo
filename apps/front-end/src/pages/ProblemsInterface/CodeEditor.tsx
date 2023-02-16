import { useCallback, useState, useEffect } from "react"
import { ethers } from "ethers"
import styled from "styled-components"
import { Editor } from "../../components/Editor"
import { solidityCompiler } from "@agnostico/browser-solidity-compiler"
import { JudgeInterface } from "./JudgeInterface"

/** ---------------------------------------------------
 * Provider and Fetch the user wallet in browser(e.g. Metamask)
 * --------------------------------------------------- */

type BuildType = { version: string; path: string }
type VersionType = { [version: string]: string }

/** ---------------------------------------------------
 * Styled Components
 * --------------------------------------------------- */

const EditorContainer = styled.div`
  height: 100%;
  width: 100%;
`
const EditorTop = styled.div`
  height: 40px;
  width: 100%;
  background-color: black;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

/** ---------------------------------------------------
 * Export Components
 * --------------------------------------------------- */

export const CodeEditor = ({
  code,
  problemsInfo
}: {
  code: string
  problemsInfo: any
}) => {
  /** ---------------------------------------------------
   * Provider and Fetch the user wallet in browser(e.g. Metamask)
   * --------------------------------------------------- */

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const [account, setAccount] = useState("")
  useEffect(() => {
    if (window.ethereum) {
      provider.send("eth_requestAccounts", []).then(async () => {
        await accountChangedHandler(provider.getSigner())
      })
      window.ethereum.on(
        "accountsChanged",
        async () => await accountChangedHandler(provider.getSigner())
      )
      window.ethereum.on("chainChanged", () => window.location.reload())
    }
  }, [account])

  const accountChangedHandler = async (newAccount: any) => {
    const address = await newAccount.getAddress()
    setAccount(address)
  }

  /** ---------------------------------------------------
   * Editor Status
   * --------------------------------------------------- */

  const [value, setValue] = useState(code)
  const onChange = useCallback((_value: string) => {
    setValue(_value)
  }, [])

  /** ---------------------------------------------------
   * Contract Information
   * --------------------------------------------------- */

  const [ABI, setABI] = useState<string>("")
  const [Bytecode, setBytecode] = useState<any>("")

  /** ---------------------------------------------------
   * Contract Status in the Judging System and the return after judging
   * --------------------------------------------------- */

  const [compiling, setCompiling] = useState(false)
  const [judgebtn, setJudgebtn] = useState(false)

  /** ---------------------------------------------------
     * Compiler Status
    --------------------------------------------------- */

  const [compiledContract, setCompiledContract] = useState<{
    errors: { formattedMessage: string }[]
    sources: any
    contracts: any
  }>({ errors: [], sources: null, contracts: null })
  const [optimizeOption, setOptimizer] = useState({
    optimize: true,
    runs: 200
  })
  const [usingVersion, setUsingVersion] = useState(
    "soljson-v0.8.17+commit.8df45f5f.js"
  )

  /** ---------------------------------------------------
     * Handle Compile
    --------------------------------------------------- */

  const handleCompile = async () => {
    let temp_array: string[] = []
    let temp = value.split("\n")
    temp.forEach((element) => {
      if (!element.includes("//") && !element.includes("pragma")) {
        temp_array.push(element)
      }
    })
    const code = temp_array.join("\n")

    let options = {} as any
    setCompiling(true)
    if (optimizeOption.optimize) {
      options.optimizer = {
        enabled: optimizeOption.optimize,
        runs: optimizeOption.runs
      }
    }

    let trimContent = code.trim()

    const contractsAvailable = trimContent.match(/contract/g)?.length || 0

    if (contractsAvailable > 0) {
      const contractNames: string[] = []

      let index = trimContent.match(/contract/)?.index

      while (typeof index != "undefined") {
        trimContent = trimContent.slice(index + 1)
        const fromContract = trimContent.slice(index)
        const contractSelector = trimContent.slice(
          trimContent.indexOf(fromContract),
          fromContract.indexOf("{")
        )
        contractNames.push(contractSelector.trim().split(" ")[1])
        index = trimContent.match(/contract/)?.index
      }

      try {
        const compiled = (await solidityCompiler({
          version: `https://binaries.soliditylang.org/bin/${usingVersion}`,
          contractBody: code,
          options
        })) as any

        console.log(compiled)
        setJudgebtn(true)
        setCompiledContract(() => compiled)
        const obj = compiled?.contracts?.Compiled_Contracts
        // const targetKey = Object.keys(obj)[Object.keys(obj).length - 1]

        setBytecode(
          obj[`answer${problemsInfo?.problemNumber}`]?.evm?.bytecode?.object
        )
        setABI(obj[`answer${problemsInfo?.problemNumber}`]?.abi)
      } catch (e: any) {
        if (e.message.includes("failed to load")) {
          setCompiledContract((prev) => ({
            ...prev,
            errors: [
              {
                formattedMessage: `Error: Failed To Load This Compiler's versions`
              }
            ]
          }))
        }
      }

      setCompiling(false)
    }
  }

  /** ---------------------------------------------------
     * Return Components
     --------------------------------------------------- */

  return (
    <>
      <div>{account}</div>
      <EditorTop>
        <div
          style={{
            marginLeft: "10px",
            display: "flex"
          }}
        ></div>
      </EditorTop>
      <EditorContainer>
        <Editor value={value} onChange={onChange} />
      </EditorContainer>

      {/**Compile Result */}
      <div className="compiled">
        <div
          className="errors"
          style={{
            width: "400px",
            height: "400px",
            resize: "none"
          }}
        >
          <h2>Errors</h2>
          {compiledContract.errors.length > 0 && (
            <ul>
              {compiledContract?.errors.map((err) => (
                <li key={err.formattedMessage}>{err.formattedMessage}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/**Judge Result */}

      <div
        className="settings"
        style={{
          width: "400px",
          height: "200px",
          resize: "none"
        }}
      >
        <div
          className="select-version"
          style={{
            padding: "1em"
          }}
        >
          <div className="compile">
            <button onClick={handleCompile} disabled={compiling}>
              {compiling ? "Compiling..." : "Compile"}
            </button>
          </div>
          <div className="deploy">
            {judgebtn && (
              <JudgeInterface {...{ problemsInfo, Bytecode, ABI }} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
