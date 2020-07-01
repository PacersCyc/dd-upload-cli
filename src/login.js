const chalk = require('chalk')
const axios = require('axios')
const FormData = require('form-data')
const { Base64 } = require('./util')

const login = async ({ username, password }, url) => {
  let form = new FormData()
  form.append('loginName', username)
  form.append('password', Base64.encode(`${username},${password}`))

  try {
    let res = await axios.post(`${url}/back-http/backuser/login`, form, {
      headers: form.getHeaders()
    })
    if (res && res.data.code === 200) {
      console.log(chalk.greenBright('登录成功'))
      return res.data.data.token
    } else {
      console.log(chalk.red(res.data.message))
      // return Promise.reject(res.data.message)
    }
  } catch (error) {
    console.log(chalk.red('登录失败'))
  }
}

module.exports = login