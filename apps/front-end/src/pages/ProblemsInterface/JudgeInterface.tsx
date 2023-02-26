import { useState } from "react"
import { ethers } from "ethers"
import { useNavigate } from "react-router-dom"
import DEPLOYER_ABI from "../../../contract-artifacts/deployerABI.json"

//front end
import Textarea from "@mui/joy/Textarea"
import TextareaAutosize from "@mui/base/TextareaAutosize"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"

export const JudgeInterface = (judgeObject: any) => {
  const problemInfo = judgeObject.problemsInfo
  const Bytecode = judgeObject.Bytecode
  const ABI = judgeObject.ABI

  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  const handleMessageChange = (event: any) => {
    setMessage(event.target.value)
  }

  const [judging, setJudging] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [minting, setMinting] = useState(false)
  const handleJudge = async () => {
    setJudging(true)
    setAccepted(false)

    console.log(ABI)
    console.log(Bytecode)
    console.log(problemInfo)

    const _return = await judge(problemInfo, "0x" + Bytecode, ABI)
    if (_return) {
      setAccepted(true)
    } else {
      setAccepted(false)
    }

    setJudging(false)
  }

  async function judge(JudgeInfo: any, creationCode: string, AnswerABI: any) {
    let msg: string = ""

    /** ---------------------------------------------------------------------------
     * Setting up the basic ethers object
     * --------------------------------------------------------------------------- */

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const wallet = provider.getSigner()

    /**  ---------------------------------------------------------------------------
     * Choose the judge problem and construct the answer contract instance
     * --------------------------------------------------------------------------- */

    const problemNumber = JudgeInfo.problemNumber

    // Replace the MSG_SENDER
    const wallet_address = await wallet.getAddress()
    const originalSolution = JudgeInfo.problemSolution
    const stringified = JSON.stringify(originalSolution)
    const replaced = stringified.replace(/"MSG_SENDER"/g, `"${wallet_address}"`)
    console.log(wallet_address)

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

    const DeployerContract = new ethers.Contract(
      process.env.DEPLOYER_CONTRACT_ADDR as string,
      DEPLOYER_ABI,
      wallet
    )

    msg = `Trying to deploy problem ${problemNumber} with Deployer Contract:`
    setMessage(
      `Trying to deploy problem ${problemNumber} with Deployer Contract:`
    )

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
          const nonIndexedValue = solution[i].expectReturn[1]
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
            nonIndexedValue.length == 0
              ? log.args
                  .slice(
                    indexedValue.length,
                    indexedValue.length + nonIndexedValue.length
                  )
                  .toString()
              : []
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
    return true
  }

  const handleMint = async () => {
    setMinting(true)
    await sleep(5000)
    setAccepted(false)
    setMinting(false)
    navigate("/")
  }

  const sleep = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
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
            border: "5px solid white",
            borderRadius: "15px",
            width: "83%",
            height: "20vh",
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
        {accepted && (
          <button
            className="resource flex"
            onClick={handleMint}
            disabled={minting}
          >
            {minting ? "Minting..." : "Mint"}
          </button>
        )}
      </Grid>
    </>
  )
}
