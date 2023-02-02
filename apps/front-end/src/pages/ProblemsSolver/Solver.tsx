import { useState, useEffect } from "react"
import { errors, ethers } from "ethers"
import {
  solidityCompiler,
  getCompilerVersions
} from "@agnostico/browser-solidity-compiler"
import deployerABI from "../../../contract-artifacts/deployerABI.json"

type BuildType = { version: string; path: string }
type VersionType = { [version: string]: string }

export default function Solver({
  code,
  solution,
  problemNo
}: {
  code: any
  solution: any
  problemNo: number
}) {
  /**Provider and Fetch the user wallet in browser(e.g. Metamask)*/
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

  /**Contract Information */
  const [contract, setContract] = useState<string>(code)
  const [ABI, setABI] = useState<string>("")
  const [Bytecode, setBytecode] = useState<any>("")

  /**Contract Status in the Judging System and the return after judging*/
  const [compiling, setCompiling] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [message, setMessage] = useState<string>("")
  const [deploybtn, setDeploybtn] = useState(false)
  const [deploy_open, setDeployOpen] = useState(false)
  const [deploySuccess, setDeploySuccess] = useState(false)
  const [deployAddr, setDeployAddr] = useState("")
  const [accepted, setAccepted] = useState(false)

  /**Compiler Status*/
  const [solcVersions, setSolcVersions] = useState<any>(null)
  const [compiledContract, setCompiledContract] = useState<{
    errors: { formattedMessage: string }[]
    sources: any
    contracts: any
  }>({ errors: [], sources: null, contracts: null })
  const [optimizeOption, setOptimizer] = useState({
    optimize: true,
    runs: 200
  })
  const [usingVersion, setUsingVersion] = useState("")

  /**Compiler */

  // loads the available versions of solidity compilers from https://binaries.soliditylang.org/bin/list.json
  const loadVersions = async () => {
    const { releases, latestRelease, builds } =
      (await getCompilerVersions()) as {
        releases: VersionType
        latestRelease: string
        builds: BuildType[]
      }

    setSolcVersions({
      releases,
      latestRelease,
      builds: builds.map(({ version, path }) => ({ [version]: path }))
    })
    setUsingVersion(releases[latestRelease])
  }

  useEffect(() => {
    ;(async () => {
      await loadVersions()
    })()
  }, [])

  const handleCompile = async () => {
    let options = {} as any
    setCompiling(true)
    if (optimizeOption.optimize) {
      options.optimizer = {
        enabled: optimizeOption.optimize,
        runs: optimizeOption.runs
      }
    }

    let trimContent = contract.trim()

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
          contractBody: contract,
          options
        })) as any

        console.log(compiled)
        setDeploybtn(true)
        setCompiledContract(() => compiled)
        const obj = compiled?.contracts?.Compiled_Contracts
        const targetKey = Object.keys(obj)[Object.keys(obj).length - 1]
        setBytecode(obj[targetKey]?.evm?.bytecode?.object)
        setABI(obj[targetKey]?.abi)
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

  /** Deployer */

  const handleDeploy = async () => {
    await window.ethereum.enable()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(account)

    if (!compiledContract || !signer) {
      return
    }

    const deployerAddress = process.env.DEPLOYER_CONTRACT_ADDR as string

    const DeployerContract = new ethers.Contract(
      deployerAddress,
      deployerABI,
      signer
    )

    setDeploying(true)
    try {
      const tx = await DeployerContract.deploy(Bytecode, account[0], problemNo)
      const receipt = await tx.wait()
      console.log(`    Tx successful with hash: ${receipt.transactionHash}`)
      const event = receipt.events.find((e: any) => e.event === "Deploy")
      const [_deployAddr, _solver, _problemNum] = event.args
      console.log(
        `Solver ${_solver} is trying problem ${_problemNum}, deployed contract address is ${_deployAddr}`
      )

      setMessage("https://goerli.etherscan.io/tx/" + receipt.transactionHash)
      setDeploySuccess(true)
      setDeployAddr(_deployAddr)
    } catch (error: any) {
      setMessage("😥 - Something wrong: " + error.message)
      setDeploySuccess(false)
    }

    setDeployOpen(true)
    setDeploying(false)
  }

  /**Problem Solver */

  const handleMint = async () => {
    await window.ethereum.enable()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(account)

    if (!compiledContract || !signer) {
      return
    }

    // Interact with signing server in the backend here, and get the signature here!

    const RewardContract = new ethers.Contract(
      process.env.REWARDS_CONTRACT_ADDR as string,
      deployerABI,
      signer
    )

    RewardContract.mint()
  }

  const handleJudge = async (_provider: any, _signer: any) => {
    setAccepted(false)
    const AnswerContract = new ethers.Contract(deployAddr, ABI, _signer)

    for (let i = 0; i < solution.length; i++) {
      const _return = await AnswerContract[solution[i].methodName](
        solution[i].callData
      )
      if (!(_return == solution[i].expectReturn)) {
        setAccepted(false)
        throw new Error(
          `Calling ${solution[i].methodName} failed!` || "Assertion failed"
        )
      }
    }
    setAccepted(true)
  }

  return (
    <main>
      <div
        className="app"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div className="compiled">
          <div
            className="contracts"
            style={{
              width: "400px",
              height: "400px",
              resize: "none"
            }}
          >
            <h2>Compiled</h2>
            {compiledContract?.contracts?.Compiled_Contracts &&
              Object.keys(compiledContract?.contracts?.Compiled_Contracts).map(
                (cont) => (
                  <div key={cont}>
                    <h3>Contract: {cont}</h3>
                    <h4>Bytecode</h4>{" "}
                    <small>
                      {
                        compiledContract?.contracts?.Compiled_Contracts[cont]
                          ?.evm?.bytecode?.object
                      }
                    </small>
                    <h4>ABI</h4>{" "}
                    <small>
                      {JSON.stringify(
                        compiledContract?.contracts?.Compiled_Contracts[cont]
                          ?.abi
                      )}
                    </small>
                  </div>
                )
              )}
          </div>
          <div
            className="errors"
            style={{
              width: "400px",
              height: "75px",
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
      </div>

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
          <p>Select Solidity Version</p>
          {solcVersions?.releases && (
            <select
              name="version"
              onChange={(e) =>
                setUsingVersion(solcVersions.releases[e.target.value])
              }
            >
              {Object.keys(solcVersions?.releases).map((option) => (
                <option key={option} value={option}>
                  {option} ({solcVersions.releases[option]})
                </option>
              ))}
            </select>
          )}
          <div className="compile">
            <button onClick={handleCompile} disabled={compiling}>
              {compiling ? "Compiling..." : "Compile"}
            </button>
          </div>
          <h3 />
          <div className="deploy">
            {deploybtn && (
              <button
                className="resource flex"
                onClick={handleDeploy}
                disabled={deploying}
              >
                {deploying ? "Deploying..." : "Deploy"}
              </button>
            )}
          </div>
        </div>
        <div>{account}</div>
        <div>
          {deploy_open && !deploySuccess && !deploying ? (
            <h4>{message}</h4>
          ) : (
            <div />
          )}
          {deploy_open && deploySuccess && !deploying ? (
            <h4>
              ✅ - Check your transaction on{" "}
              <a target="_blank" href={message}>
                Etherscan
              </a>
            </h4>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  )
}
