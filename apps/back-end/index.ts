import express from 'express';
// import {ethers} from "hardhat"

const { ethers } = require("hardhat");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// const bodyParser = require('body-parser');
// app.use(bodyParser);

async function main(probSolAddr: string, probNum: string, probSolTime: number, Pnonce: number ) {

    // Prepare the provider & wallet(signer)
    const provider = ethers.provider
    const wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY as any, provider)

    // The data to sign
    const problemSolverAddr = probSolAddr
    // '0xDEcf23CbB14972F2e9f91Ce30515ee955a124Cba'
    const problemNumber = probNum
    // '997'
    const problemSolvedTimestamp = probSolTime
    // 1673070083

    const approverKeyAddr = process.env.SERVER_KEY_ARRR as string
    const approverIndex = 0
    const nonce = Pnonce

    // console.log(
    //     `Signer Key Address: ${wallet.address}`,
    // )
    // console.log(`    - Problem Solver Address  : ${problemSolverAddr}`)
    // console.log(`    - Problem Number is       : ${problemNumber}`)
    // console.log(`    - Problem Solved Timestamp: ${problemSolvedTimestamp}`)
    // console.log(`    - Signature Approver Key  : ${approverKeyAddr}`)
    // console.log(`    - Signature Approver Index: ${approverIndex}`)
    // console.log(`    - Nonce                   : ${nonce}`)

    // Sign the Msg
    const encode = ethers.utils.solidityPack(
        ["address", "uint256", "uint256", "address", "uint8", "uint256"],
        [problemSolverAddr, problemNumber, problemSolvedTimestamp, approverKeyAddr, approverIndex, nonce]
    )
    const msgHash = ethers.utils.keccak256(encode)

    const messageHash = ethers.utils.solidityKeccak256(["address", "uint256", "uint256", "address", "uint8", "uint256"],
        [problemSolverAddr, problemNumber, problemSolvedTimestamp, approverKeyAddr, approverIndex, nonce])
    const signingHash = ethers.utils.solidityKeccak256(["string", "bytes32"], ["\x19Ethereum Signed Message:\n32", messageHash])
    const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash))
    const verified = ethers.utils.verifyMessage(ethers.utils.arrayify(messageHash), signature)

    // console.log(`\ngetMessageHash: ${msgHash}`)
    // console.log(`getEthSignedMessageHash: ${signingHash}`)
    // console.log(`Signature: ${signature}`)

    // console.log(`\nrecoverSigner(${signingHash},${signature})`)
    // console.log(`\nVerifySignature(${problemSolverAddr},${problemNumber},${problemSolvedTimestamp},${approverKeyAddr},${nonce},${signature})`)

    // Check the Signature is Valid
    // console.log(verified.toLowerCase())
    // console.log(approverKeyAddr.toLowerCase())

    const valid = verified.toLowerCase() == approverKeyAddr.toLowerCase();
    console.log(`\nCheck the Signature is...${valid ? "Approved!" : "Invalid!"}`)
    let data = {
        "signature":signature
    }
    return data
}

app.get('/', (req, res) => {
    res.send('This is a test web page!');
})

app.post('/getSign', (req, res) => {
    let data = req.body
    main(data.problemSolverAddr, data.problemNumber, data.problemSolvedTimestamp, data.nonce).then(addr=>res.send(addr))
    // console.log(m)
    // res.send('hi')
})

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})