/* eslint-disable no-restricted-globals */
import sha256 from "js-sha256"

console.log("Loading mint worker.")

self.addEventListener("message", ({ data }) => {
  const { difficulty, transactionHash } = data
  console.log("Worker - Start mining with difficulty: ", difficulty)
  let nonce = 0
  const prefix = "0".repeat(difficulty)
  let currentHash = sha256.sha256(String(transactionHash + nonce))
  while (!hexToBinary(currentHash).startsWith(prefix)) {
    nonce++
    currentHash = sha256.sha256(String(transactionHash + nonce))
  }

  console.log("Worker - Finished")
  self.postMessage({
    nonce: nonce,
    hash: currentHash
  })
})

function hexToBinary(hashHex: string): string {
  let hashBinary = ""
  const lookupTable: Record<string, string> = {
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    a: "1010",
    b: "1011",
    c: "1100",
    d: "1101",
    e: "1110",
    f: "1111"
  }

  for (let i = 0; i < hashHex.length; i = i + 1) {
    if (lookupTable[hashHex[i]]) {
      hashBinary += lookupTable[hashHex[i]]
    } else {
      return ""
    }
  }
  return hashBinary
}
