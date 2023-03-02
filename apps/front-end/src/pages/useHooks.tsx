import { createContext, useContext, useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"
import MetaMaskOnboarding from "@metamask/onboarding"

const HookContext = createContext({
  onClickConnect: () => {},
  toAbout: () => {},
  toUserProfile: () => {},
  toMain: () => {}
})

const HookProvider = (props) => {
  const navigate = useNavigate()
  const [account, setAccount] = useState("")

  const onboarding: any = useRef()

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", function (accounts: any) {
        if (accounts.length > 0) setAccount(accounts[0])
      })
    }
  }, [])

  const onClickConnect = () => {
    //client side code
    if (!window.ethereum) {
      console.log("please install MetaMask")
      onboarding.current = new MetaMaskOnboarding()
      onboarding.current.startOnboarding()
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any")

    provider
      .send("eth_requestAccounts", [])
      .then((accounts) => {
        if (accounts.length > 0) setAccount(accounts[0])
      })
      .catch((e) => console.log(e))

    provider
      .send("wallet_switchEthereumChain", [{ chainId: "0x5" }])
      .catch((e) => console.log(e))
  }

  // navigate function
  const toAbout = () => {
    navigate("/About")
  }
  const toUserProfile = () => {
    navigate("/UserProfile")
  }
  const toMain = () => {
    navigate("/")
  }

  return (
    <HookContext.Provider
      value={{
        account,
        setAccount,
        onClickConnect,
        toAbout,
        toUserProfile,
        toMain
      }}
      {...props}
    />
  )
}

function useHook() {
  return useContext(HookContext)
}

export { HookProvider, useHook }
