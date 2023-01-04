import React, { useState, useEffect, ChangeEvent } from "react"
import { SimpleStorageContact } from "./contract"
import { Button, Spinner, Text } from "sancho"
import Alert from "@mui/material/Alert"
import IconButton from "@mui/material/IconButton"
import Collapse from "@mui/material/Collapse"
import CloseIcon from "@mui/icons-material/Close"
const Web3 = require("web3")
const url = "https://eth-rinkeby.alchemyapi.io/v2/<YourProjectKey>"
const web3 = new Web3(url)

const CompilingSmartContractDemo: React.FC = () => {
  const [compileResult_abi, setCompileResult_abi] = useState<string>("")
  const [compileResult_bytecode, setCompileResult_bytecode] =
    useState<string>("")
  const [ABI, setABI] = useState<string>("")
  const [Bytecode, setBytecode] = useState<string>("")
  const [compiling, setCompiling] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [open, setOpen] = useState(false)
  const [flag, setFlag] = useState(false)
  const [deploybtn, setDeploybtn] = useState(false)
  const [contract, setContract] = useState<string>(SimpleStorageContact)
  const [message, setMessage] = useState<string>("")
  const [deploy_open, setDeployOpen] = useState(false)
  const [deploySuccess, setDeploySuccess] = useState(false)

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

  const handleDeploy = async () => {
    setOpen(false)
    setDeploying(true)
    // const ganacheAccounts = await web3.eth.getAccounts();
    const now_user = await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .catch((err: any) => {
        console.error(err)
      })

    const incrementer = new web3.eth.Contract(JSON.parse(ABI))
    const incrementerTx = incrementer.deploy({
      data: Bytecode,
      arguments: [5]
    })

    const transactionParameters = {
      from: now_user[0], // must match user's active address.
      data: incrementerTx.encodeABI() // Optional, but used for defining smart contract creation and interaction.
    }

    // txHash is a hex string
    // As with any RPC call, it may throw an error
    try {
      const createTransaction = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters]
      })

      setMessage("https://rinkeby.etherscan.io/tx/" + createTransaction)
      setDeploySuccess(true)
    } catch (error: any) {
      setMessage("😥 - Something wrong: " + error.message)
      setDeploySuccess(false)
    }

    setDeployOpen(true)
    setDeploying(false)
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
      content: contract
    })

    if (result.indexOf("errors") === -1) {
      var output = JSON.parse(result)

      for (var contractName in output.contracts["storage.sol"]) {
        bytecode +=
          contractName +
          ": \n" +
          output.contracts["storage.sol"][contractName].evm.bytecode.object +
          "\n\n"
        // console.log(JSON.stringify(output.contracts['storage.sol'][contractName].evm.bytecode.object))
        setBytecode(
          output.contracts["storage.sol"][contractName].evm.bytecode.object
        )

        abi += contractName + ": \n["
        var f = true
        for (var abi_object in output.contracts["storage.sol"][contractName]
          .abi) {
          if (!f) {
            forABI += ","
            abi += ","
          } else {
            forABI += "["
            f = false
          }
          abi += JSON.stringify(
            output.contracts["storage.sol"][contractName].abi[abi_object]
          )
          forABI += JSON.stringify(
            output.contracts["storage.sol"][contractName].abi[abi_object]
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
            <Collapse in={open && !compiling && flag}>
              <Alert
                severity="success"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false)
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                Compile Successfully!
              </Alert>
            </Collapse>
            <Collapse in={open && !compiling && !flag}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false)
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                Compile Failed!
              </Alert>
            </Collapse>
            <Collapse in={deploy_open && deploySuccess && !deploying}>
              <Alert
                severity="success"
                style={{
                  width: "380px"
                }}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setDeployOpen(false)
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                <Text>
                  ✅ - Check your transaction on{" "}
                  <a target="_blank" href={message}>
                    Etherscan
                  </a>
                </Text>
              </Alert>
              <h4 />
            </Collapse>
            <Collapse in={deploy_open && !deploySuccess && !deploying}>
              <Alert
                severity="error"
                style={{
                  width: "380px"
                }}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setDeployOpen(false)
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                <Text>{message}</Text>
              </Alert>
            </Collapse>
          </div>
        </div>
        <div
          style={{
            padding: "1em"
          }}
        >
          <Button
            variant="outline"
            intent="primary"
            className="resource flex"
            onClick={handleCompile}
            disabled={compiling}
          >
            {compiling ? <Spinner label="Compiling..." center /> : "Compile"}
          </Button>
          <h3 />
          {deploybtn && (
            <Button
              variant="outline"
              intent="primary"
              className="resource flex"
              onClick={handleDeploy}
              disabled={deploying}
            >
              {deploying ? <Spinner label="Deploying..." center /> : "Deploy"}
            </Button>
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
          <Text variant="uppercase">
            Code Was Compiled By Latest Solidity Compiler
          </Text>
          <Text variant="uppercase">Please Set Your Internet to Rinkeby!</Text>
          {/* <Text variant="uppercase">Please Open Ganache connecting RPC SERVER HTTP://127.0.0.1:7545</Text> */}
          <h4 />
        </div>
      </div>
    </div>
  )
}

export default CompilingSmartContractDemo
