import { NFTStorage, Blob } from "nft.storage"

export async function uploadMetadataToIPFS(user_answer_metadata) {
  // TODO: 你要先針對當前的使用者答題資訊去對 user_answer_metadata 這個 object 的內容作更改
  // e.g. 答對的是哪一題、時間、使用者地址等資訊
  const token = "ipfs token"
  const files = new Blob([user_answer_metadata], { type: "application/json" })
  const client = new NFTStorage({ token: token })
  const _cid = await client.storeBlob(files)
  const status = await client.status(_cid)

  return _cid
}
