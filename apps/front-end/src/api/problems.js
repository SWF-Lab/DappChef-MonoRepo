import axios from "axios"

const API_URL = "http://localhost:3001/"

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

export default { getProbTxt, getProbJson, getProbInfo, getProbAns }
