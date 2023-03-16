import { useState } from "react"
import { ethers } from "ethers"
import { useNavigate } from "react-router-dom"
import DEPLOYER_ABI from "../../../contract-artifacts/deployerABI.json"
import REWARD_ABI from "../../../contract-artifacts/rewardABI.json"
import api from "../../api/api"
import { uploadMetadataToIPFS } from "../../api/upload"

//front end
import Textarea from "@mui/joy/Textarea"
import TextareaAutosize from "@mui/base/TextareaAutosize"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import { MintModal } from "./Modal"

export const JudgeInterface = (judgeObject: any) => {
  const problemInfo = judgeObject.problemsInfo
  const Bytecode = judgeObject.Bytecode
  const ABI = judgeObject.ABI
  const solved = judgeObject.solved

  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  const handleMessageChange = (event: any) => {
    setMessage(event.target.value)
  }

  const [judging, setJudging] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [requestParams, setRequestParams] = useState({
    problemSolverAddr: "",
    problemNumber: "",
    problemSolvedTimestamp: 0,
    difficulty: 0,
    class: ""
  })
  const [minting, setMinting] = useState(0)
  const handleJudge = async () => {
    setJudging(true)
    setAccepted(false)

    try {
      const _return = await judge(problemInfo, "0x" + Bytecode, ABI)
      if (_return) {
        setAccepted(true)
      }
    } catch (e: any) {
      setMessage(e)
    }

    setJudging(false)
  }

  async function judge(JudgeInfo: any, creationCode: string, AnswerABI: any) {
    let msg: string = ""

    /** ---------------------------------------------------------------------------
     * Setting up the basic ethers object
     * --------------------------------------------------------------------------- */

    let provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider
      .send("wallet_switchEthereumChain", [{ chainId: "0x5" }])
      .catch((e) => console.log(e))
    let wallet = provider.getSigner()

    /**  ---------------------------------------------------------------------------
     * Choose the judge problem and construct the answer contract instance
     * --------------------------------------------------------------------------- */

    const problemNumber = JudgeInfo.problemNumber

    // Replace the MSG_SENDER
    const wallet_address = await wallet.getAddress()
    const originalSolution = JudgeInfo.problemSolution
    const stringified = JSON.stringify(originalSolution)
    const replaced = stringified.replace(/"MSG_SENDER"/g, `"${wallet_address}"`)

    const solution = JSON.parse(replaced)

    const constructorCode = ethers.utils.defaultAbiCoder.encode(
      JudgeInfo.constructorCallData.map((e: any) => e[0]),
      JudgeInfo.constructorCallData.map((e: any) => e[1])
    )

    const bytecode = ethers.utils.solidityPack(
      ["bytes", "bytes"],
      [creationCode, constructorCode]
    )

    /** ---------------------------------------------------------------------------
     * User deploer contract to deploy the answer contract
     * --------------------------------------------------------------------------- */

    let DeployerContract = new ethers.Contract(
      process.env.DEPLOYER_CONTRACT_ADDR as string,
      DEPLOYER_ABI.abi,
      wallet
    )

    msg = `Trying to deploy problem ${problemNumber} with Deployer Contract:`
    setMessage(
      `Trying to deploy problem ${problemNumber} with Deployer Contract:`
    )

    const goerli_tx = await DeployerContract.deploy(
      bytecode,
      wallet_address,
      problemNumber
    )
    await goerli_tx.wait()

    /** ---------------------------------------------------------------------------
     * Ganache Judge
     * --------------------------------------------------------------------------- */

    const options = { gasLimit: 80000000000000 }
    provider = new ethers.providers.Web3Provider(
      Ganache.provider(options as any) as any
    )
    const accountsList = await provider.listAccounts()
    wallet = provider.getSigner(accountsList[0])

    const DeployerFactory = new ethers.ContractFactory(
      DEPLOYER_ABI.abi,
      DEPLOYER_ABI.bytecode,
      wallet
    )
    const undeployedDeployerContract = await DeployerFactory.deploy()
    DeployerContract = undeployedDeployerContract.connect(wallet)

    const tx = await DeployerContract.deploy(
      bytecode,
      wallet_address,
      problemNumber
    )
    const receipt = await tx.wait()
    const event = receipt.events.find((e: any) => e.event === "Deploy")
    const [_deployAddr, _solver, _problemNum] = event.args
    msg += "\n" + `    Tx successful with hash: ${receipt.transactionHash}`
    setMessage(msg)
    msg += "\n" + `    Deployed contract address is ${_deployAddr}`
    setMessage(msg)

    /** ---------------------------------------------------------------------------
     * Judge the answer contract with the "problemSolution" in the problem json
     * --------------------------------------------------------------------------- */

    const AnswerContract = new ethers.Contract(_deployAddr, AnswerABI, wallet)
    msg += "\n" + `\nBegin the Judging...`
    setMessage(msg)

    let pastTXInfo: any
    let totalGas = ethers.BigNumber.from("0")

    for (let i = 0; i < solution.length; i++) {
      msg += "\n" + `    \nTesting ${i}: ${solution[i].methodName}`
      setMessage(msg)
      msg += "\n" + `    - Sameple Input: ${solution[i].callData}`
      setMessage(msg)

      try {
        // If this methodName is Check Event Emitted
        if (solution[i].methodName.substring(0, 1) == "#") {
          // Get expectReturn
          const topics0 = ethers.utils.id(solution[i].methodName.substring(1))
          const indexedValue = solution[i].expectReturn[0]
          const nonIndexedValue =
            solution[i].expectReturn[1].length == 0
              ? ""
              : solution[i].expectReturn[1]
          msg +=
            "\n" +
            `    - Sameple Output: ${topics0},${indexedValue},${nonIndexedValue}`
          setMessage(msg)

          // Get the Transaction Log
          const log = AnswerContract.interface.parseLog(pastTXInfo["logs"][0])
          const id = log.topic.toString()
          const eventTopics = log.args.slice(0, indexedValue.length).toString()
          // Pass the non-index event for special target
          const eventData =
            nonIndexedValue.length != 0
              ? log.args
                  .slice(
                    indexedValue.length,
                    indexedValue.length + nonIndexedValue.length
                  )
                  .toString()
              : ""
          msg += "\n" + `    - Your Output: ${id},${eventTopics},${eventData}`
          setMessage(msg)

          // Comparing
          if (
            id == topics0 &&
            eventTopics == indexedValue &&
            eventData == nonIndexedValue
          ) {
            msg += "\n" + `    ...Accepted!`
            setMessage(msg)
          } else {
            msg += "\n" + `    ...Wrong Answer!`
            setMessage(msg)
            return false
          }
          continue
        }
        // expect the calling failed and match the error msg.
        else if (solution[i].methodName.substring(0, 1) == "%") {
          msg += "\n" + `    - Expect Error Msg: ${solution[i].expectReturn}`
          setMessage(msg)
          try {
            const _return = await AnswerContract[
              solution[i].methodName.substring(1)
            ](...solution[i].callData)
            pastTXInfo = await _return.wait()
            msg += "\n" + `    ...Wrong Answer!`
            setMessage(msg)
            return false
          } catch (e: any) {
            msg += "\n" + `    ...Accepted!`
            setMessage(msg)
          }
        }
        // Write Function / Get Function
        else {
          let _return: any

          // call with ether
          if (solution[i].methodName.substring(0, 1) == "$") {
            // call the fallback or receive function
            if (solution[i].methodName.length == 1) {
              const tx =
                solution[i].callData[1].length == 0
                  ? {
                      to: _deployAddr,
                      value: solution[i].callData[0]
                    }
                  : {
                      to: _deployAddr,
                      data: ethers.utils.solidityPack(
                        ["bytes"],
                        [solution[i].callData[1][0]]
                      ),
                      value: solution[i].callData[0]
                    }
              _return = await wallet.sendTransaction(tx)
              pastTXInfo = await _return.wait()
              totalGas = totalGas.add(pastTXInfo.gasUsed)
              msg += "\n" + `    ...Fallback/Receive Function Finished!`
              setMessage(msg)
              continue
            } else {
              _return = await AnswerContract[
                solution[i].methodName.substring(1)
              ](...solution[i].callData[1], { value: solution[i].callData[0] })
            }
          } else {
            _return = await AnswerContract[solution[i].methodName](
              ...solution[i].callData
            )
          }

          if (solution[i].expectReturn.length == 0) {
            pastTXInfo = await _return.wait()
            totalGas = totalGas.add(pastTXInfo.gasUsed)
            msg += "\n" + `    ...Write Function Finished!`
            setMessage(msg)
            continue
          }

          msg += "\n" + `    - Sameple Output: ${solution[i].expectReturn}`
          setMessage(msg)
          msg += "\n" + `    - Your Output: ${_return}`
          setMessage(msg)
          if (_return.toString() == solution[i].expectReturn.toString()) {
            msg += "\n" + `    ...Accepted!`
            setMessage(msg)
          } else {
            msg += "\n" + `    ...Wrong Answer!`
            setMessage(msg)
            return false
          }
        }
      } catch (e: any) {
        msg += "\n" + e.toString()
        setMessage(msg)
        return false
      }
    }
    msg += "\n" + "\nAll Accepted!"
    setMessage(msg)
    msg += "\n" + `Total Used Gas: ${totalGas.toString()}`
    setMessage(msg)

    const problemsResponse = await fetch(
      process.env.PROBLEMS_IPFS_CID as string
    )
    const data = await problemsResponse.json()
    const attributes = data[problemNumber].attributes
    let problemDifficulty: number
    let problemClass: string
    if (attributes != undefined) {
      problemDifficulty = attributes[0].value
      problemClass = attributes[1].value
    } else {
      problemDifficulty = 0
      problemClass = "undefined"
    }

    setRequestParams({
      problemSolverAddr: wallet_address,
      problemNumber: problemNumber,
      problemSolvedTimestamp: Date.now(),
      difficulty: problemDifficulty,
      class: problemClass
    })
    return true
  }

  const handleMint = async () => {
    setMinting(1)
    try {
      const result = await api.getResponse(
        requestParams.problemSolverAddr,
        requestParams.problemNumber,
        requestParams.problemSolvedTimestamp,
        requestParams.difficulty,
        requestParams.class
      )
      console.log(result)

      /** ---------------------------------------------------------------------------
       * Setting up the basic ethers object
       * --------------------------------------------------------------------------- */

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider
        .send("wallet_switchEthereumChain", [{ chainId: "0x5" }])
        .catch((e) => console.log(e))
      const wallet = provider.getSigner()

      const RewardContract = new ethers.Contract(
        process.env.REWARDS_CONTRACT_ADDR as string,
        REWARD_ABI,
        wallet
      )

      const cid = await uploadMetadataToIPFS(
        requestParams.problemSolverAddr,
        requestParams.problemNumber,
        requestParams.problemSolvedTimestamp,
        requestParams.difficulty,
        requestParams.class
      )
      console.log(cid)

      const _return = await RewardContract.mint(
        requestParams.problemSolverAddr,
        requestParams.problemNumber,
        requestParams.problemSolvedTimestamp,
        process.env.SERVER_KEY_ARRR as string,
        0,
        result.data.signsignature,
        cid
      )
      await _return.wait()

      setAccepted(false)
      setMinting(2)
      navigate("/")
    } catch (e: any) {
      console.log(e)
      setMinting(1)
    }
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        {/* Judge Area */}
        <textarea
          style={{
            color: "white",
            backgroundColor: "#1C1B29",
            border: "3px solid white",
            borderRadius: "15px",
            width: "83%",
            height: "40vh",
            resize: "none",
            padding: "5px"
          }}
          value={message}
          onChange={handleMessageChange}
          disabled
        />
        <Button
          sx={{
            color: "white",
            width: "15%",
            height: "45px",
            fontSize: { lg: "20px", sm: "14px" },
            borderRadius: "8px",
            textTransform: "none",
            background:
              "linear-gradient(90deg, #16D9E3 0%, #30C7EC 47%, #46AEF7 100%)",
            ":hover": {
              color: "black"
            }
          }}
          onClick={handleJudge}
          disabled={judging}
        >
          {judging ? "Judging..." : "Judge"}
        </Button>
        {accepted && !solved && (
          <>
            <MintModal mintfunction={handleMint} minting={minting} />
          </>
        )}
      </Grid>
    </>
  )
}
