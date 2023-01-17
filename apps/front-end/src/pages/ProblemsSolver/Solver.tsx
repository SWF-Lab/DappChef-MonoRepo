import { useState, useEffect } from "react"
import { Signer, ContractFactory, ethers } from "ethers"
import {
  solidityCompiler,
  getCompilerVersions
} from "@agnostico/browser-solidity-compiler"

type BuildType = { version: string; path: string }
type VersionType = { [version: string]: string }

export default function Solver({ value }: { value: any }) {
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
  const [contract, setContract] = useState<string>(value)
  const [ABI, setABI] = useState<string>("")
  const [Bytecode, setBytecode] = useState<any>("")

  /**Contract Status in the Judging System and the return after judging*/
  const [compiling, setCompiling] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [message, setMessage] = useState<string>("")
  const [deploybtn, setDeploybtn] = useState(false)
  const [deploy_open, setDeployOpen] = useState(false)
  const [deploySuccess, setDeploySuccess] = useState(false)

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

  const createContractFactory = async () => {
    await window.ethereum.enable()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(account)

    if (!compiledContract || !signer) {
      return
    }
    const factory = new ContractFactory(ABI, Bytecode, signer)

    console.log(signer)
    console.log(ABI)
    console.log(Bytecode)

    return factory
  }

  const handleDeploy = async () => {
    const factory: any = await createContractFactory()

    setDeploying(true)

    try {
      const contract = await factory.deploy()
      await contract.deployTransaction.wait()

      console.log(contract.address)
      console.log(contract.deployTransaction)

      setMessage(
        "https://goerli.etherscan.io/tx/" + contract.deployTransaction.hash
      )
      setDeploySuccess(true)
    } catch (error: any) {
      setMessage("😥 - Something wrong: " + error.message)
      setDeploySuccess(false)
    }

    setDeployOpen(true)
    setDeploying(false)
  }

  /**Problem Solver */

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