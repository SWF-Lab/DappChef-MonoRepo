# Web APP Back-End Internal Documentation

## Connect to the server

- Our server is at 172.105.202.22.
- You need password to ssh to the server. Which you can ask Sen for that if you need.

## APIs

### getSign

Used to collect a Token for a registered User.

**URL** : `API_URL/getSign`

**Method** : `POST`

**Auth required** : basic auth (Ask Sen for it.)

**Data constraints**

```json
{
  "problemSolverAddr": "Solver's addr",
  "problemNumber": "Problem number",
  "problemSolvedTimestamp": "Problem solved time stamp",
  "nonce": "nonce number"
}
```

**Data example**

```json
{
  "problemSolverAddr": "0xDEcf23CbB14972F2e9f91Ce30515ee955a124Css",
  "problemNumber": "997",
  "problemSolvedTimestamp": 1673070080,
  "nonce": "0"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "signature": "0x50adac27645ba6de33aaad368aa6c6c8f53e2a2b770706025b0850b63b86f1aa260e5328fe8f4ad3006436e15aee3d5289dfbdfecc4d3e85166ad970373cc*****"
}
```

**Front-end api function can be written in the form like:**

```javascript
const get_sign = (psa, pn, psts, n) => {
  let data = {
    problemSolverAddr: String(psa),
    problemNumber: String(pn),
    problemSolvedTimestamp: psts,
    nonce: String(n)
  }
  return axios.post(API_URL + "getSign", data, {
    auth: {
      username: "username",
      password: "password"
    }
  })
}
```

### getProbTxt

Used to collect a Token for a registered User.

**URL** : `API_URL/getProbTxt?:probNum`

**Method** : `GET`

**Auth required** : basic auth (Ask Sen for it.)

## Success Response

**Code** : `200 OK`

**Content example**


```txt
// SPDX-License-Identifier: Apache License
pragma solidity ^0.8.17;

// The system will deploy `Called` for you
contract Called {
bool public called = false;

function setCalled() external {
called = true;
}
function getCalled() external view returns (bool) {
return called;
}
}

// TODO: write an interface named `ICalled`, implement the two functions in contract `Called`.


contract problem10 {
Called public calledContract;

constructor() {
calledContract = new Called();
}

function setCalled() external {
// TODO: finish this function by using `ICalled` to call `setCalled()` in contract `Called`.

}

function checkAns() external view returns (bool) {
return ICalled(address(calledContract)).getCalled();
}
}
```

**Front-end api function can be written in the form like:**

```javascript
const getProbTxt = (num) => {
  return axios
    .get(API_URL + "getProbTxt?probNum=" + num, {
      auth: {
        username: "dappcheff",
        password: "cheffdapp"
      }
    })
    .then((res) => {
      return res.data
    })
}
```

### getProbJson

Used to collect a Token for a registered User.

**URL** : `API_URL/getProbJson?:probNum`

**Method** : `GET`

**Auth required** : basic auth (Ask Sen for it.)

## Success Response

**Code** : `200 OK`

**Content example**


```json
{
    "problemNumber": 10,
    "problemVersion": 1,
    "description": "Interface ! Call other functions with interface.",
    "constructorCallData": [],
    "problemSolution": [
        {
            "methodName": "setCalled()",
            "callData": [],
            "expectReturn": []
        },
        {
            "methodName": "checkAns()",
            "callData": [],
            "expectReturn": [
                true
            ]
        }
    ],
    "image": "ipfs://<ipfsPrefix>/10"
}
```

**Front-end api function can be written in the form like:**

```javascript
const getProbJson = (num) => {
  return axios
    .get(API_URL + "getProbJson?probNum=" + num, {
      auth: {
        username: "dappcheff",
        password: "cheffdapp"
      }
    })
    .then((res) => {
      return res.data
    })
}
```

### getProbAns

Used to collect a Token for a registered User.

**URL** : `API_URL/getProbAns?:probNum`

**Method** : `GET`

**Auth required** : basic auth (Ask Sen for it.)

## Success Response

**Code** : `200 OK`

**Content example**


```txt
// SPDX-License-Identifier: Apache License
pragma solidity ^0.8.17;

contract Called {
bool public called = false;

function setCalled() external {
called = true;
}
function getCalled() external view returns (bool) {
return called;
}
}

interface ICalled {
function setCalled() external;
function getCalled() external view returns (bool);
}

contract answer10 {
Called public calledContract;

constructor() {
calledContract = new Called();
}

function setCalled() external {
ICalled(address(calledContract)).setCalled();
}

function checkAns() external view returns (bool) {
return ICalled(address(calledContract)).getCalled();
}
}
```

**Front-end api function can be written in the form like:**

```javascript
const getProbAns = (num) => {
  return axios
    .get(API_URL + "getProbAns?probNum=" + num, {
      auth: {
        username: "dappcheff",
        password: "cheffdapp"
      }
    })
    .then((res) => {
      return res.data
    })
}
```

### getProbInfo

Used to collect a Token for a registered User.

**URL** : `API_URL/getProbInfo`

**Method** : `GET`

**Auth required** : basic auth (Ask Sen for it.)

## Success Response

**Code** : `200 OK`

**Content example**


```json
[
    {
        "probNum": 0,
        "description": "Hello World! The reserved word 'pragma' specifies the compiler version of Solidity.",
        "image": "ipfs://<ipfsPrefix>/0"
    },
    {
        "probNum": 1,
        "description": "State Variables and its default value.",
        "image": "ipfs://<ipfsPrefix>/1"
    },
    {
        "probNum": 2,
        "description": "Functions! View functions do only readings of the state on blockchain, and pure functions do no readings.",
        "image": "ipfs://<ipfsPrefix>/2"
    },
    {
        "probNum": 3,
        "description": "If Else! as simple as it is in other language.",
        "image": "ipfs://<ipfsPrefix>/3"
    },
    {
        "probNum": 4,
        "description": "Mapping! This is how we record balance.",
        "image": "ipfs://<ipfsPrefix>/4"
    },
    {
        "probNum": 5,
        "description": "Modifier! Use modifier to modify functions with repeated steps.",
        "image": "ipfs://<ipfsPrefix>/5"
    },

    ...

    {
        "probNum": 96,
        "description": "Sparse Merkle Tree",
        "image": "ipfs://<ipfsPrefix>/96"
    },
    {
        "probNum": 97,
        "description": "Send Message to Layer2 Optimism Contract",
        "image": "ipfs://<ipfsPrefix>/97"
    }
]
```

**Front-end api function can be written in the form like:**

```javascript
const getProbInfo = () => {
  return axios
    .get(API_URL + "getProbInfo", {
      auth: {
        username: "dappcheff",
        password: "cheffdapp"
      }
    })
    .then((res) => {
      return res.data
    })
}
```