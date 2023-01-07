import { useState, useEffect } from "react"
import { TextExample } from "src/components/TextExample/TextExample"
import { useNavigate } from "react-router-dom"
import { Signer, ContractFactory, ethers } from "ethers"
import { Container } from "./styles"

export const Example = () => {
  const navigate = useNavigate()
  const [account, setAccount] = useState("")

  const onClickConnect = () => {
    //client side code
    if (!window.ethereum) {
      console.log("please install MetaMask")
      return
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    provider
      .send("eth_requestAccounts", [])
      .then((accounts) => {
        if (accounts.length > 0) setAccount(accounts[0])
      })
      .catch((e) => console.log(e))
  }

  return (
    <Container>
      <TextExample>Example</TextExample>
      <button type="button" onClick={() => onClickConnect()}>
        Log In with Metamask
      </button>
      <p>Connected Account: {account}</p>
      <button type="button" onClick={() => navigate("/ProblemsInterface")}>
        Go to ProblemsInterface
      </button>
    </Container>
  )
}
