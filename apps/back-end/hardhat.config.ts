import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"
import "tsconfig-paths/register"

import dotenv from "dotenv"
dotenv.config()

import chai from "chai"
import chaiAsPromised from "chai-as-promised"
chai.use(chaiAsPromised)

const accounts = {
  mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk",
}
const provuderURL = process.env.ETHEREUM_URL || ""

module.exports = {
  networks: {
    localhost: {
      url: "http://localhost:8545",
      accounts,
    },
    hardhat: {
      // chainId: 1,
      // accounts,
      // forking: {
      //     url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_TOKEN}`,
      //     blockNumber: 12650600,
      // },
    },
    mainnet: {
      chainId: 1,
      url: provuderURL,
      accounts,
    },
    goerli: {
      chainId: 5,
      url: provuderURL,
      accounts,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 4000,
  },
}