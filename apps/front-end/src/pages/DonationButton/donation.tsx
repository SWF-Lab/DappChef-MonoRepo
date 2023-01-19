import { useEffect, useState } from "react"
import { ethers } from "ethers"

export default function DonationButton() {
  const [amount, setAmount] = useState("")

  const handleChange = (event: any) => {
    // 👇 Get input value from "event"
    setAmount(event.target.value)
  }

  /**Provider and Fetch the user wallet in browser(e.g. Metamask)*/
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const [account, setAccount] = useState("")

  useEffect(() => {
    if (window.ethereum) {
      provider.send("eth_requestAccounts", []).then(async () => {
        await accountChangedHandler(provider.getSigner())
      })
      window.ethereum.on(
        "accountsChanged",
        async () => await accountChangedHandler(provider.getSigner())
      )
      window.ethereum.on("chainChanged", () => window.location.reload())
    }
  }, [account])

  const accountChangedHandler = async (newAccount: any) => {
    const address = await newAccount.getAddress()
    setAccount(address)
  }

  const donate = async (ethAmount: string) => {
    await window.ethereum.enable()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(account)
    const receiptAddr = process.env.LAB_KEY_ARRR as string

    const tx = {
      from: account[0],
      to: receiptAddr,
      value: ethers.utils.parseEther(ethAmount)
    }

    signer.sendTransaction(tx).then((transaction) => {
      console.dir(transaction)
      alert("Send finished!")
    })
  }

  return (
    <div>
      <input type="text" id="amount" name="amount" onChange={handleChange} />
      <button onClick={() => donate(amount)}>Donate DappChef</button>
    </div>
  )
}
