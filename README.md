<p align="center">
    <h1 align="center">
        🍩 DappChef Website
    </h1>
</p>

| The repository is divided into two components: [front-end](./apps/front-end) and [back-end](./apps/back-end). The app allows users to do some coding problems, which is similar to Leetcode & Codility, for Smart Contract Construction. |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## 📜 Usage

### Core Functionality

- [`Front-End`](./apps/front-end)
  - [**Main Website**](./apps/front-end/src)
  - [**User Profile**](./apps/front-end/src/components/UserProfile/)
  - [**Answer Interface**](./apps/front-end/src/components/ProblemsInterface/)
  - [**Online-Compiler & Problem Solver**](./apps/front-end/src/components/ProblemsSolver/)
- [`Back-End`](./apps/back-end)
  - [**Signing Server**](./apps/back-end/)

### Project Link Tree

- [Project Plan](https://docs.google.com/spreadsheets/d/1JHpkHeemQ1i-WCXACzaRqulWoGvU9uJ2xneoW05S42A/edit?usp=sharing)
- [Problems Database](https://github.com/SWF-Lab/DappChef-ProblemsDB)
- [Reward Contract Address(Goerli): `0xaFAD4dC9C0f1D05bcB6a2dfa5123bbd27284C8d3`](https://goerli.etherscan.io/address/0xaFAD4dC9C0f1D05bcB6a2dfa5123bbd27284C8d3)
- [Deployer Contract Address(Goerli): `0x70D71426fC44759f11a5Ffd5472459259267Ed83`](https://goerli.etherscan.io/address/0x70D71426fC44759f11a5Ffd5472459259267Ed83)

## 🛠 Start Your Journey

### Start the App

1. Clone the repository:

```bash
$ git clone https://github.com/SWF-Lab/DappChef-MonoRepo.git
```

2. Install the dependencies, make sure your node version is `>= v16.0.0`:

```bash
$ node -v
>
v18.13.0

$ cd DappChef-MonoRepo && yarn
```

3. Start the app locally

```bash
$ yarn start
```

> Make sure the `apps/front-end/const/const` arguments are same as your image.

### Start the Development

1. Create new branch, reference with [SWF-Lab/github_practice](https://github.com/SWF-Lab/github_practice):

```bash
$ git checkout main # Change to the main branch
$ git pull # Make sure the local code is same with the remote
$ git checkout -b add-my-context # Create new branch
```

2. Write your code...
3. Code quality and formatting. Run [Prettier](https://prettier.io/) to automatically format the code:

```bash
$ yarn format
```

4. Push the code to remote repo

```bash
$ git add .
$ git commit -m "add a new funcationality"
$ git push
```
