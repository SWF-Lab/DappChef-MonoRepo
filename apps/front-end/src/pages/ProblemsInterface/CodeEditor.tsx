import { useCallback, useState, useEffect } from "react"
import { ethers } from "ethers"
import styled from "styled-components"
import { Editor } from "../../components/Editor"
import { solidityCompiler } from "@agnostico/browser-solidity-compiler"
import { JudgeInterface } from "./JudgeInterface"

//front-end
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"

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
  padding-right: 10px;
  border-left: 5px solid white;
  border-right: 5px solid white;
  // border-radius: 15px;
`
const EditorTop = styled.div`
  height: 12px;
  width: 100%;
  background-color: #282c34;
  border-top: 5px solid white;
  border-right: 5px solid white;
  border-left: 5px solid white;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const EditorBottom = styled.div`
  height: 12px;
  width: 100%;
  background-color: #282c34;
  border-bottom: 5px solid white;
  border-right: 5px solid white;
  border-left: 5px solid white;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
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
    console.log("compiling")
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
      {/* <div>{account}</div> */}
      {/* <Box
      sx={{
        width: 300,
        height: 300,}}>   */}
      <EditorTop />
      <EditorContainer>
        <Editor value={value} onChange={onChange} />
      </EditorContainer>
      <EditorBottom />
      {/* </Box> */}
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
            <Button
              sx={{
                ml: 15,
                color: "white",
                width: "150px",
                height: "45px",
                fontSize: { lg: "20px", sm: "14px" },
                borderRadius: "8px",
                textTransform: "none",
                background: "linear-gradient(90deg, #F6D365 0%, #FDA085 100%)",
                ":hover": {
                  color: "black"
                }
              }}
              onClick={handleCompile}
              disabled={compiling}
            >
              {compiling ? "Compiling..." : "Compile"}
            </Button>
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
