import express, { response } from "express"
import axios from "axios"
import fs from "fs"
import cors from "cors"
import num2cid from "./num2cid.json"
import { NFTStorage, File, Blob } from "nft.storage"
import { uploadMetadataToIPFS } from "./upload"
// import { Blob } from "buffer"

const someObj: any = num2cid
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
  probSolTime: number
  // metadata: any
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

  // Sign the Msg
  const encode = ethers.utils.solidityPack(
    ["address", "uint256", "uint256", "address", "uint8"],
    [
      problemSolverAddr,
      problemNumber,
      problemSolvedTimestamp,
      approverKeyAddr,
      approverIndex
    ]
  )
  const msgHash = ethers.utils.keccak256(encode)

  const messageHash = ethers.utils.solidityKeccak256(
    ["address", "uint256", "uint256", "address", "uint8"],
    [
      problemSolverAddr,
      problemNumber,
      problemSolvedTimestamp,
      approverKeyAddr,
      approverIndex
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
  let data = {
    signature: signature
  }
  return data
}

async function generateMetadata(
  sign: string,
  probSolAddr: string,
  probNum: number,
  probSolTime: number,
  difficulty: number,
  classes: String
) {
  const approverKeyAddr = process.env.SERVER_KEY_ARRR as string
  let img_cid = await getImageCID(probNum)
  let temp = {
    name: "DappChef Rewards NFT #" + probNum,
    description:
      "DappChef is a Ethereum Smart Contract Development Learning platform. Solve the coding problem, then you can mint the Reward NFT!",
    solver: probSolAddr,
    approver: approverKeyAddr,
    problemSolvedTimestamp: probSolTime,
    attributes: [
      {
        display_type: "number",
        trait_type: "problemNumber",
        value: probNum
      },
      {
        trait_type: "difficulty",
        value: difficulty
      },
      {
        trait_type: "class",
        value: classes
      }
    ],
    image: "ipfs://" + img_cid + "/" + probNum
  }

  let cid = await uploadMetadataToIPFS(temp)
  return {
    signsignature: sign,
    cid: cid
  }
}
async function getImageCID(num: number) {
  const image_cid = someObj[num]
  return image_cid
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
      .then((response) => {})

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
    data.problemSolvedTimestamp
  ).then((addr) => {
    if (auth === "ZGFwcGNoZWZmOmNoZWZmZGFwcA==") {
      res.send(addr)
    } else {
      res.send("Wrong Auth. QQ")
    }
  })
})

app.post("/getCID", (req, res) => {
  const auth = String(req.headers.authorization).split(" ")[1]
  let data = req.body
  main(
    data.problemSolverAddr,
    data.problemNumber,
    data.problemSolvedTimestamp
  ).then((addr) => {
    generateMetadata(
      addr.signature,
      String(data.problemSolverAddr),
      Number(data.problemNumber),
      Number(data.problemSolvedTimestamp),
      Number(data.difficulty),
      String(data.class)
    ).then((resp) => {
      if (auth === "ZGFwcGNoZWZmOmNoZWZmZGFwcA==") {
        res.send(resp)
      } else {
        res.send("Wrong Auth. QQ")
      }
    })
  })
})

app.post("/getProbList", (req, res) => {
  const b64 =
    "ewogICJwcm9ibGVtTnVtYmVyIjogMiwKICAicHJvYmxlbVZlcnNpb24iOiAx\nLAogICJkZXNjcmlwdGlvbiI6ICJGdW5jdGlvbnMhIFZpZXcgZnVuY3Rpb25z\nIGRvIG9ubHkgcmVhZGluZ3Mgb2YgdGhlIHN0YXRlIG9uIGJsb2NrY2hhaW4s\nIGFuZCBwdXJlIGZ1bmN0aW9ucyBkbyBubyByZWFkaW5ncy4iLAogICJjb25z\ndHJ1Y3RvckNhbGxEYXRhIjogW10sCiAgInByb2JsZW1Tb2x1dGlvbiI6IFsK\nICAgICAgewogICAgICAgICAgIm1ldGhvZE5hbWUiOiAiYWRkTnVtV2l0aFgo\ndWludDI1NikiLAogICAgICAgICAgImNhbGxEYXRhIjogWzEwMDBdLAogICAg\nICAgICAgImV4cGVjdFJldHVybiI6IFsxMDAxXQogICAgICB9LAogICAgICB7\nCiAgICAgICAgICAibWV0aG9kTmFtZSI6ICJhZGRUd29OdW0odWludDI1Nix1\naW50MjU2KSIsCiAgICAgICAgICAiY2FsbERhdGEiOiBbMjAsNjRdLAogICAg\nICAgICAgImV4cGVjdFJldHVybiI6IFs4NF0KICAgICAgfQogIF0sCiAgImF0\ndHJpYnV0ZXMiOiBbCiAgICAgIHsKICAgICAgICAidHJhaXRfdHlwZSI6ICJk\naWZmaWN1bHR5IiwgCiAgICAgICAgInZhbHVlIjogMQogICAgICB9LAogICAg\nICB7CiAgICAgICAgInRyYWl0X3R5cGUiOiAiY2xhc3MiLCAKICAgICAgICAi\ndmFsdWUiOiAiQmVnaW5uZXIiCiAgICAgIH0KICBdLAogICJpbWFnZSI6ICJp\ncGZzOi8vPGlwZnNQcmVmaXg+LzIiCn0K\n"
  const decode = (str: string): string =>
    Buffer.from(str, "base64").toString("binary")
  let data = req.body

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

// app.get("/getProbJson", async (req, res) => {
//   const probNum = req.query.probNum
//   const file = await readFile(
//     "./problems/" + probNum + "/" + "problem" + probNum + ".json",
//     "utf8"
//   )
//   res.send(JSON.parse(file))
// })

// app.get("/getProbAns", async (req, res) => {
//   const probNum = req.query.probNum
//   const file = await readFile(
//     "./problems/" + probNum + "/" + "answer" + probNum + ".sol",
//     "utf8"
//   )
//   res.send(file.toString())
// })

// app.get("/getProbInfo", async (req, res) => {
//   let infos = []
//   for (let x = 0; x < 100; x++) {
//     try {
//       let t = await readFile(
//         "./problems/" + x + "/" + "problem" + x + ".json",
//         "utf8"
//       )
//       let file = JSON.parse(t)
//       let data = {
//         probNum: x,
//         description: file.description,
//         image: file.image
//       }
//       infos.push(data)
//     } catch {}
//   }
//   res.send(infos)
// })

app.listen(3001, () => {
  console.log("The application is listening on port 3001!")
})
