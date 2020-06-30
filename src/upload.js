const fs = require('fs')
const path = require('path')
const OSS = require('ali-oss')
const axios = require('axios')
const FormData = require('form-data')
const ProgressBar = require('progress')
const { Base64 } = require('./util')

const baseUrl = 'http://eureka.dd.inf:30801'

module.exports = async function(filePath, options) {
  const data = new FormData()
  data.append('loginName', options.username)
  data.append('password', Base64.encode(`${options.username},${options.password}`))
  let headers = data.getHeaders()
  let res = await axios.post(`${baseUrl}/back-http/backuser/login`, data, {
    headers
  })
  // console.log(res)
  let token
  if (res) {
    if (res.data.code === 200) {
      token = res.data.data.token
    }
  }

  if (token) {
    let stsRes = await axios.get(`${baseUrl}/back-http/video/getAliStsResponse`, {
      headers: {
        auth: token
      }
    })
    // console.log(stsRes)
    let stsToken
    if (stsRes) {
      if (stsRes.data.code === 200) {
        stsToken = stsRes.data.data

        let { accessKeyId, accessKeySecret, securityToken } = stsToken
        // console.log(accessKeyId, accessKeySecret, securityToken)
        let client =  new OSS({
          accessKeyId,
          accessKeySecret,
          stsToken: securityToken,
          bucket: options.bucket,
          endpoint: options.endpoint
        })
        const fileName = path.basename(filePath)
        // console.log(fileName)
        let tick = 0
        let bar = new ProgressBar('progress: [:bar]', {
          total: 100,
          width: 100,
          complete: '*'
        })
        let result = await client.multipartUpload(fileName, filePath, {
          progress: (percentage, checkpoint, res) => {
            // console.log(percentage, checkpoint, res)
            tick = percentage * 100 - tick
            bar.tick(tick)
          }
        })

        if (result && result.res.status === 200) {
          if (result.res.requestUrls.length) {
            console.log(result.res.requestUrls[0])
          }
        }
      }
    }
  }
  
}
