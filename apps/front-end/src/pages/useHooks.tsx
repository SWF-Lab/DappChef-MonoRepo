import { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"

const HookContext = createContext({
  onClickConnect: () => {},
  toAbout: () => {},
  toUserProfile: () => {}
})

const HookProvider = (props) => {
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

  // navigate function
  const toAbout = () => {
    navigate("/About")
  }
  const toUserProfile = () => {
    navigate("/UserProfile")
  }

  return (
    <HookContext.Provider
      value={{
        account,
        setAccount,
        onClickConnect,
        toAbout,
        toUserProfile
      }}
      {...props}
    />
  )
}

function useHook() {
  return useContext(HookContext)
}

export { HookProvider, useHook }
