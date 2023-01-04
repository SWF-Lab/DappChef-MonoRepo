<p align="center">
    <h1 align="center">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
            <img width="40" alt="Semaphore icon." src="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
        </picture>
        DappChef
    </h1>
</p>

| The repository is divided into two components: [web app](./web-app) and [contracts](./contracts). The app allows users to do some coding problems, which is similar to Leetcode & Codility, for Smart Contract Construction. |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## Start the app

1. Clone the repository:
```bash
$ git clone https://github.com/SWF-Lab/DappChef-MonoRepo.git
```
2. Install the dependencies:
```bash
$ cd <your-repo> && yarn
```
3. Start the app locally
```bash
$ yarn start
```

> Make sure the `.env` arguments are same as your image.

## Start the app-development
1. Create new branch:
```bash
$ git checkout main # Change to the main branch
$ git pull # Make sure the local code is same with the remote
$ git checkout -b add-my-context # Create new branch
```
> Reference: [SWF-Lab/github_practice](https://github.com/SWF-Lab/github_practice)
2. <----- Write your code... ----->
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