import { NFTStorage, Blob } from "nft.storage"
import num2cid from "./num2cid.json"

function generateMetadata(
  probSolAddr: string,
  probNum: string,
  probSolTime: number,
  difficulty: number,
  classes: String
) {
  const approverKeyAddr = process.env.SERVER_KEY_ARRR as string
  const imageDB = num2cid as any
  let img_cid = imageDB[probNum]
  return {
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
    image:
      "https://nftstorage.link/ipfs/" +
      img_cid +
      "?filename=" +
      probNum +
      ".png"
  }
}

export async function uploadMetadataToIPFS(
  probSolAddr: string,
  probNum: string,
  probSolTime: number,
  difficulty: number,
  classes: String
) {
  const user_answer_metadata = generateMetadata(
    probSolAddr,
    probNum,
    probSolTime,
    difficulty,
    classes
  ) as any
  const token = process.env.NFT_STORAGE_API_TOKEN as string
  const files = new Blob([JSON.stringify(user_answer_metadata)], {
    type: "application/json"
  })
  const client = new NFTStorage({ token: token })
  const _cid = await client.storeBlob(files)
  const status = await client.status(_cid)

  return _cid
}
