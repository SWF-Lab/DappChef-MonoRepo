import { useState, useEffect } from "react"
import { TextExample } from "src/components/TextExample/TextExample"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"
import { Container } from "./styles"
import { ProblemList } from "../ProblemsInterface/ProblemList"
import { ResponsiveAppBar } from "../../components/Appbar"
import { useHook } from "../useHooks"

export const Main = () => {
  const { account, onClickConnect, toAbout, toUserProfile } = useHook()

  const navigate = useNavigate()
  // const [account, setAccount] = useState("")

  // const onClickConnect = () => {
  //   //client side code
  //   if (!window.ethereum) {
  //     console.log("please install MetaMask")
  //     return
  //   }
  //   const provider = new ethers.providers.Web3Provider(window.ethereum)

  //   provider
  //     .send("eth_requestAccounts", [])
  //     .then((accounts) => {
  //       if (accounts.length > 0) setAccount(accounts[0])
  //     })
  //     .catch((e) => console.log(e))
  // }

  // // navigate function
  // const toAbout = () => {
  //   navigate("/About")
  // }
  // const toUserProfile = () => {
  //   navigate("/UserProfile")
  // }

  return (
    <div>
      <Container>
        <ResponsiveAppBar
          account={account}
          onClickConnect={onClickConnect}
          toAbout={toAbout}
          toUserProfile={toUserProfile}
        />
      </Container>
      <Container>
        <TextExample>DappChef</TextExample>
        <button type="button" onClick={() => navigate("/About")}>
          About
        </button>
        {account ? (
          <button type="button" onClick={() => navigate("/UserProfile")}>
            Go to User Profile
          </button>
        ) : (
          <button type="button" onClick={() => onClickConnect()}>
            Log In with Metamask
          </button>
        )}
      </Container>
      <Container>
        <ProblemList />
      </Container>
      {/* TODO: Sponsor Area.... */}
    </div>
  )
}
