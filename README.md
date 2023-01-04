<p align="center">
    <h1 align="center">
        DappChef
    </h1>
</p>

| The repository is divided into two components: [web app](./apps/web-app) and [contracts](./apps/contracts). The app allows users to do some coding problems, which is similar to Leetcode & Codility, for Smart Contract Construction. |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## 📜 Usage

### Repo Tree
- [`web app`](./apps/web-app) folder holds the whole front-end client, including:
    - [**Main Website**](./apps/web-app):
    - [**User Profile**](./apps/web-app):
    - [**Answer Interface**](./apps/web-app):
    - [**Online-Compiler & Problem Solver**](./apps/web-app):
- [`contracts`](./apps/contracts)
    - [**Reward Contract**](./apps/contracts): As a users' answer status DB, this contract constructs the users' NFT at the same time.

### Project Link

- [Project Plan](https://docs.google.com/spreadsheets/d/1JHpkHeemQ1i-WCXACzaRqulWoGvU9uJ2xneoW05S42A/edit?usp=sharing)
- [Problems Database](https://github.com/SWF-Lab/DappChef-ProblemsDB)
- [Contract Address(Mainnet): `0x`]()
- [Contract Address(Goerli): `0x`]()


## 🛠 Start Your Journey

### Start the App

1. Clone the repository:
```bash
$ git clone https://github.com/SWF-Lab/DappChef-MonoRepo.git
```
2. Install the dependencies:
```bash
$ cd DappChef-MonoRepo && yarn
```
3. Start the app locally
```bash
$ yarn start
```

> Make sure the `.env` arguments are same as your image.

### Start the App-Development
1. Create new branch:
```bash
$ git checkout main # Change to the main branch
$ git pull # Make sure the local code is same with the remote
$ git checkout -b add-my-context # Create new branch
```
> Reference: [SWF-Lab/github_practice](https://github.com/SWF-Lab/github_practice)
2. Write your code...
3. Code quality and formatting. Run [Prettier](https://prettier.io/) to automatically format the code:
```bash
$ yarn prettier:write
```
4. Push the code to remote repo
```bash
$ git add .
$ git commit -m "add a new funcationality"
$ git push
```