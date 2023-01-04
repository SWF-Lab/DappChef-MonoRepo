import { task, types } from "hardhat/config"

task("deploy", "Deploy a Reward contract")
  .addOptionalParam(
    "reward",
    "Reward Contract address",
    undefined,
    types.string
  )
  .setAction(async ({ reward: rewardAddress }, { ethers, run }) => {
    if (!rewardAddress) {
      const { address } = await run("deploy:reward", {})

      rewardAddress = address
    }

    const RewardFactory = await ethers.getContractFactory("Reward")

    const RewardContract = await RewardFactory.deploy(rewardAddress)

    await RewardContract.deployed()

    console.info(
      `Reward contract has been deployed to: ${RewardContract.address}`
    )

    return RewardContract
  })
