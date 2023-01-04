import { expect } from "chai"
import { formatBytes32String, solidityKeccak256 } from "ethers/lib/utils"
import { run } from "hardhat"
import { config } from "../package.json"

describe("Reward", () => {
  let rewardContract: any

  const users: any = []

  before(async () => {
    rewardContract = await run("deploy", {})
  })

  describe("", () => {
    it("", async () => {})

    it("", async () => {})
  })

  describe("", () => {
    it("", async () => {})

    it("", async () => {})
  })
})
