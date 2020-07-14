const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const upload = require('./upload')
const login = require('./login')
const { getBucketList, getHostname } = require('./config')

const CDNExtNames = [
  '.js',
  '.css'
]

module.exports = async (filePath, options, uploadPath, mode) => {
  console.log('自动上传')
  const {
    env,
    username,
    password,
    bucket,
    endpoint
  } = options
  let url = getHostname(env)
  let bucketList = getBucketList(env)
  let token = await login({ username, password }, url)

  filePath = path.isAbsolute(filePath) ? filePath : path.resolve(__dirname, filePath)
  console.log(filePath)
  let stat
  try {
    stat = fs.lstatSync(filePath)
    // console.log('是文件', stat.isFile())
    // console.log('是目录', stat.isDirectory())

    if (stat.isFile()) {
      await upload(filePath, url, { token, bucket, endpoint }, uploadPath)
    } else if (stat.isDirectory()) {
      let files = fs.readdirSync(filePath)
      if (mode === 'cdn') {
        files = files.filter(filename => CDNExtNames.indexOf(path.extname(filename)) > -1)
      }
      console.log(files)
      files.map(async (fileName) => {
        let aFilePath = path.resolve(filePath, fileName)
        console.log(aFilePath)
        await upload(aFilePath, url, { token, bucket, endpoint }, uploadPath)
      })
    } else {
      console.log(chalk.red('上传路径出错'))
    }
  } catch (error) {
    console.log(chalk.red('上传路径出错'))
  }

}
