# Web APP Back-End Internal Documentation

## Connect to the server

- Our server is at 172.105.202.22.
- You need password to ssh to the server. Which you can ask Sen for that if you need.

## APIs

### getSign

Used to collect a Token for a registered User.

**URL** : `172.105.202.22:3000/getSign`

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
