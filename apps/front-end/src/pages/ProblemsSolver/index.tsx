import React, { useState, ChangeEvent } from "react"
import { SimpleStorageContact } from "./contract"
import { Signer, ContractFactory, ethers } from "ethers"

const ProblemJudgingSys: React.FC = () => {
  /**Provider and Fetch the user wallet in browser(e.g. Metamask)*/
  const [signer, setSigner] = useState<Signer>()
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  setSigner(provider.getSigner())

  /**Contract Information */
  const [contract, setContract] = useState<string>(SimpleStorageContact)
  const [contractFileName, setContractFileName] =
    useState<string>("storage.sol")
  const [compileResult_abi, setCompileResult_abi] = useState<string>("")
  const [compileResult_bytecode, setCompileResult_bytecode] =
    useState<string>("")
  const [ABI, setABI] = useState<string>("")
  const [Bytecode, setBytecode] = useState<string>("")

  /**Contract Status in the Judging System and the return after judging*/
  const [compiling, setCompiling] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [open, setOpen] = useState(false)
  const [flag, setFlag] = useState(false)
  const [message, setMessage] = useState<string>("")
  const [deploybtn, setDeploybtn] = useState(false)
  const [deploy_open, setDeployOpen] = useState(false)
  const [deploySuccess, setDeploySuccess] = useState(false)

  /**Compiler */
  const compileWithWorker = async (data: any) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker("../../SolcJs.worker.ts", {
        type: "module"
      })
      worker.postMessage(data)
      worker.onmessage = function (event: any) {
        resolve(event.data)
      }
      worker.onerror = reject
    })
  }

  const handleCompile = async () => {
    var abi = ""
    var bytecode = ""
    var forABI = ""
    setDeployOpen(false)
    setCompiling(true)
    setCompileResult_abi(abi)
    setCompileResult_bytecode(bytecode)
    let result: any
    result = await compileWithWorker({
      fileName: contractFileName,
      content: contract
    })

    if (result.indexOf("errors") === -1) {
      var output = JSON.parse(result)

      for (var contractName in output.contracts[contractFileName]) {
        bytecode +=
          contractName +
          ": \n" +
          output.contracts[contractFileName][contractName].evm.bytecode.object +
          "\n\n"
        // console.log(JSON.stringify(output.contracts[contractFileName][contractName].evm.bytecode.object))
        setBytecode(
          output.contracts[contractFileName][contractName].evm.bytecode.object
        )

        abi += contractName + ": \n["
        var f = true
        for (var abi_object in output.contracts[contractFileName][contractName]
          .abi) {
          if (!f) {
            forABI += ","
            abi += ","
          } else {
            forABI += "["
            f = false
          }
          abi += JSON.stringify(
            output.contracts[contractFileName][contractName].abi[abi_object]
          )
          forABI += JSON.stringify(
            output.contracts[contractFileName][contractName].abi[abi_object]
          )
        }
        forABI += "]"
        abi += "]\n\n"
        setABI(forABI)
      }
    }

    setCompileResult_abi(abi)
    setCompileResult_bytecode(bytecode)
    setCompiling(false)
    setOpen(true)
    if (abi.length > 25) {
      setDeploybtn(true)
      setFlag(true)
    } else {
      setDeploybtn(false)
      setFlag(false)
    }
  }

  /** Deployer */

  const handleDeploy = async () => {
    if (contract || !signer) {
      return
    }
    setOpen(false)
    setDeploying(true)

    const factory = new ContractFactory(ABI, Bytecode)

    try {
      const contract = await factory.deploy([5])
      await contract.deployed()

      console.log(contract.address)
      console.log(contract.deployTransaction)

      setMessage("https://goerli.etherscan.io/tx/" + contract.deployTransaction)
      setDeploySuccess(true)
    } catch (error: any) {
      setMessage("😥 - Something wrong: " + error.message)
      setDeploySuccess(false)
    }

    setDeployOpen(true)
    setDeploying(false)
  }

  /**Problem Solver */

  /**Others */

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContract(event.currentTarget.value)
    console.log(contract)
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <h3>Solidity Source Code</h3>
          <div>
            <textarea
              value={contract}
              onChange={onChange}
              style={{
                width: "400px",
                height: "450px",
                resize: "none"
              }}
            ></textarea>
            {open && !compiling && flag ? (
              window.alert("Compile Successfully!")
            ) : (
              <div />
            )}
            {open && !compiling && !flag ? (
              window.alert("Compile Failed!")
            ) : (
              <div />
            )}
            {deploy_open && deploySuccess && !deploying ? (
              <h4>message</h4>
            ) : (
              <div />
            )}
            {deploy_open && !deploySuccess && !deploying ? (
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
        <div
          style={{
            padding: "1em"
          }}
        >
          <button
            className="resource flex"
            onClick={handleCompile}
            disabled={compiling}
          >
            {compiling ? "Compiling..." : "Compile"}
          </button>
          <h3 />
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
        <div>
          <h3>ABI</h3>
          <div>
            <textarea
              defaultValue={compileResult_abi}
              style={{
                width: "400px",
                height: "200px",
                resize: "none"
              }}
            ></textarea>
          </div>
          <h3>Bytecode</h3>
          <div>
            <textarea
              defaultValue={compileResult_bytecode}
              style={{
                width: "400px",
                height: "200px",
                resize: "none"
              }}
            ></textarea>
          </div>
          <h3 />
          <h4 />
        </div>
      </div>
    </div>
  )
}

export default ProblemJudgingSys
