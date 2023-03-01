# Web APP Back-End Internal Documentation

## Connect to the server

- Our server is at 172.105.202.22.
- You need password to ssh to the server. Which you can ask Sen for that if you need.

## APIs

### getCID

Used to collect a Token for a registered User.

**URL** : `172.105.202.22:3001/getCID`

**Method** : `POST`

**Auth required** : basic auth (Ask Sen for it.)

**Data constraints**

```json
{
  "problemSolverAddr": "Solver's addr",
  "problemNumber": "Problem number",
  "problemSolvedTimestamp": "Problem solved time stamp",
  "difficulty": "Difficulty of the problem",
  "class": "Problem class"
}
```

**Data example**

```json
{
  "problemSolverAddr": "0xDEcf23CbB14972F2e9f91Ce30515ee955a124***",
  "problemNumber": 979,
  "problemSolvedTimestamp": 1673070080,
  "difficulty": 2,
  "class": "type1"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "signsignature": "0x0ba50d6766ba710ac590a25ce3204c362eff6c1501491d8120162557e9618fc200dd925068b224b6bf4fd6b4956e0eabb2e157efc914f3c9632f971704c206****",
  "cid": "bafkreifsrsklegk4r3jft4fucwvo4pzzwczjecsfg5qrjgp2arevne****"
}
```

**Front-end api function can be written in the form like:**

```javascript
import axios from "axios"

const getResponse = (psa, pn, psts, difficulty, cla) => {
  let data = {
    problemSolverAddr: String(psa),
    problemNumber: String(pn),
    problemSolvedTimestamp: psts,
    difficulty: difficulty,
    class: String(cla)
  }

  return axios.post(process.env.BACKEND_API_URL + "getCID", data, {
    auth: {
      username: "dappcheff",
      password: "cheffdapp"
    }
  })
}
```
