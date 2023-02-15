import express, { response } from "express"
import axios from "axios"
import fs from "fs"
import { readFile } from "fs/promises"
import cors from "cors"

const { ethers } = require("hardhat")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const allowedOrigins = ["http://localhost:3000"]

const options: cors.CorsOptions = {
  origin: allowedOrigins
}
app.use(cors(options))

async function main(
  probSolAddr: string,
  probNum: string,
  probSolTime: number,
  Pnonce: number
) {
  // Prepare the provider & wallet(signer)
  const provider = ethers.provider
  const wallet = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY as any,
    provider
  )

  const problemSolverAddr = probSolAddr
  const problemNumber = probNum
  const problemSolvedTimestamp = probSolTime

  const approverKeyAddr = process.env.SERVER_KEY_ARRR as string
  const approverIndex = 0
  const nonce = Pnonce

  // Sign the Msg
  const encode = ethers.utils.solidityPack(
    ["address", "uint256", "uint256", "address", "uint8", "uint256"],
    [
      problemSolverAddr,
      problemNumber,
      problemSolvedTimestamp,
      approverKeyAddr,
      approverIndex,
      nonce
    ]
  )
  const msgHash = ethers.utils.keccak256(encode)

  const messageHash = ethers.utils.solidityKeccak256(
    ["address", "uint256", "uint256", "address", "uint8", "uint256"],
    [
      problemSolverAddr,
      problemNumber,
      problemSolvedTimestamp,
      approverKeyAddr,
      approverIndex,
      nonce
    ]
  )
  const signingHash = ethers.utils.solidityKeccak256(
    ["string", "bytes32"],
    ["\x19Ethereum Signed Message:\n32", messageHash]
  )
  const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash))
  const verified = ethers.utils.verifyMessage(
    ethers.utils.arrayify(messageHash),
    signature
  )

  const valid = verified.toLowerCase() == approverKeyAddr.toLowerCase()
  console.log(`\nCheck the Signature is...${valid ? "Approved!" : "Invalid!"}`)
  let data = {
    signature: signature
  }
  return data
}

const fetchProbList = async () => {
  try {
    axios
      .get(
        "https://api.github.com/repos/SWF-Lab/DappChef-ProblemsDB/contents/problemVersion1/0/problem0.json",
        {
          auth: {
            username: "Cooksen",
            password: String(process.env.GITHUB_TOKEN)
          }
        }
      )
      .then((response) => {
        // if (response.ok) {
        //   return response.json();
        // }
        // console.log(response)
      })

    // handleError( new Error(`${response.status}`) )
  } catch (error) {
    console.log(error)
    // handleError(error)
  }
}

app.get("/", (req, res) => {
  res.send("This is a test web page!")
})

app.post("/getSign", (req, res) => {
  const auth = String(req.headers.authorization).split(" ")[1]
  let data = req.body

  main(
    data.problemSolverAddr,
    data.problemNumber,
    data.problemSolvedTimestamp,
    data.nonce
  ).then((addr) => {
    if (auth === "ZGFwcGNoZWZmOmNoZWZmZGFwcA==") {
      res.send(addr)
    } else {
      res.send("Wrong Auth. QQ")
    }
  })
})

app.post("/getProbList", (req, res) => {
  const b64 =
    "ewogICJwcm9ibGVtTnVtYmVyIjogMiwKICAicHJvYmxlbVZlcnNpb24iOiAx\nLAogICJkZXNjcmlwdGlvbiI6ICJGdW5jdGlvbnMhIFZpZXcgZnVuY3Rpb25z\nIGRvIG9ubHkgcmVhZGluZ3Mgb2YgdGhlIHN0YXRlIG9uIGJsb2NrY2hhaW4s\nIGFuZCBwdXJlIGZ1bmN0aW9ucyBkbyBubyByZWFkaW5ncy4iLAogICJjb25z\ndHJ1Y3RvckNhbGxEYXRhIjogW10sCiAgInByb2JsZW1Tb2x1dGlvbiI6IFsK\nICAgICAgewogICAgICAgICAgIm1ldGhvZE5hbWUiOiAiYWRkTnVtV2l0aFgo\ndWludDI1NikiLAogICAgICAgICAgImNhbGxEYXRhIjogWzEwMDBdLAogICAg\nICAgICAgImV4cGVjdFJldHVybiI6IFsxMDAxXQogICAgICB9LAogICAgICB7\nCiAgICAgICAgICAibWV0aG9kTmFtZSI6ICJhZGRUd29OdW0odWludDI1Nix1\naW50MjU2KSIsCiAgICAgICAgICAiY2FsbERhdGEiOiBbMjAsNjRdLAogICAg\nICAgICAgImV4cGVjdFJldHVybiI6IFs4NF0KICAgICAgfQogIF0sCiAgImF0\ndHJpYnV0ZXMiOiBbCiAgICAgIHsKICAgICAgICAidHJhaXRfdHlwZSI6ICJk\naWZmaWN1bHR5IiwgCiAgICAgICAgInZhbHVlIjogMQogICAgICB9LAogICAg\nICB7CiAgICAgICAgInRyYWl0X3R5cGUiOiAiY2xhc3MiLCAKICAgICAgICAi\ndmFsdWUiOiAiQmVnaW5uZXIiCiAgICAgIH0KICBdLAogICJpbWFnZSI6ICJp\ncGZzOi8vPGlwZnNQcmVmaXg+LzIiCn0K\n"
  const decode = (str: string): string =>
    Buffer.from(str, "base64").toString("binary")
  let data = req.body

  console.log(data.address, data.probNum)

  console.log(decode(b64))

  fetchProbList().then((resp) => {
    res.send(decode(b64))
  })
})

app.get("/getProbTxt", (req, res) => {
  const probNum = req.query.probNum
  const file = fs.readFileSync(
    "./problems/" + probNum + "/" + "problem" + probNum + ".txt"
  )
  res.send(file.toString())
})

app.get("/getProbJson", async (req, res) => {
  const probNum = req.query.probNum
  const file = await readFile(
    "./problems/" + probNum + "/" + "problem" + probNum + ".json",
    "utf8"
  )
  res.send(JSON.parse(file))
})

app.get("/getProbAns", async (req, res) => {
  const probNum = req.query.probNum
  const file = await readFile(
    "./problems/" + probNum + "/" + "answer" + probNum + ".sol",
    "utf8"
  )
  res.send(file.toString())
})

app.get("/getProbInfo", async (req, res) => {
  let infos = []
  for (let x = 0; x < 100; x++) {
    try {
      let t = await readFile(
        "./problems/" + x + "/" + "problem" + x + ".json",
        "utf8"
      )
      let file = JSON.parse(t)
      let data = {
        probNum: x,
        description: file.description,
        image: file.image
      }
      infos.push(data)
    } catch {}
  }
  res.send(infos)
})

app.listen(3001, () => {
  console.log("The application is listening on port 3001!")
})
