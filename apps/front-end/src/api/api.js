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
      username: process.env.BACKEND_USERNAME,
      password: process.env.BACKEND_PASSWORD
    }
  })
}

export default { getResponse }
