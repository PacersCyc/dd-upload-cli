const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const OSS = require('ali-oss')
const axios = require('axios')
const ProgressBar = require('progress')

// const baseUrl = 'http://eureka.dd.inf:30801'

const ossUpload = async (filePath, ossOptions) => {
  console.log(filePath)
  let client = new OSS(ossOptions)
  const fileName = path.basename(filePath)
  let tick = 0
  let bar = new ProgressBar('上传中: [:bar]', {
    total: 100,
    width: 100,
    complete: '*'
  })

  try {
    let result = await client.multipartUpload(fileName, filePath, {
      progress: (percentage, checkpoint, res) => {
        // console.log(percentage, checkpoint, res)
        tick = percentage * 100 - tick
        bar.tick(tick)
      }
    })
    // console.log(result.res)
    if (result && result.res.status === 200 && result.res.requestUrls.length) {
      console.log(`上传成功:  ${chalk.green(result.res.requestUrls[0])}`)
    }
  } catch (error) {
    console.log(chalk.red('阿里云文件上传失败'))
  }
}

module.exports = async function (filePath, url, options) {
  try {
    let stsRes = await axios.get(`${url}/back-http/video/getAliStsResponse`, {
      headers: {
        auth: options.token
      }
    })
    if (stsRes && stsRes.data.code === 200) {
      console.log(chalk.green('获取stsToken成功'))
      let { accessKeyId, accessKeySecret, securityToken } = stsRes.data.data
      let ossOptions = {
        accessKeyId,
        accessKeySecret,
        stsToken: securityToken,
        bucket: options.bucket,
        endpoint: options.endpoint
      }
      let res = await ossUpload(filePath, ossOptions)
    } else {
      console.log(chalk.red(stsRes.data.message))
    }
  } catch (error) {
    console.log(chalk.red('获取阿里云 stsToken失败'))
  }
}
