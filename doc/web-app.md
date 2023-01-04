# Web APP Internal Documentation

## Website

### Arch
- UI/UX and web visual
- Adsense Area: It there are some Sponsors & Angel Investors, we will design a area to list them.

### Dapp
- LoginSystem: Provide user login with one of many wallet providers (Now only support Metamask).
- DonationButton: It just a button link to DappChef account(EOA), let the people who wnat to cheer up us use.
- Mint Button: User could mint a NFT when they complete the problem well.

## Core Funcationality

### Problem Interface
- Problems Database: Construct the problem database in the Repo, which will be invoked by DappChef Front-End ProblemSystem with Github API.
- User Profile: A profile which will display user answer statistics and their NFT of completed problems.
- Discussion System: Import Github Issues Area as problem forums.

### Problem System
- Online Compiler: Use [solc](https://github.com/ethereum/solc-js) to let user compile their code in DappChef.
- Problem-TestData Solver: Use mocha, chai and waffle to test the user code which is sent to coding problems. (Or user shold run the Ganache in their localhost).