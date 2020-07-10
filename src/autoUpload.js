const upload = require('./upload')
const login = require('./login')
const { getBucketList, getHostname } = require('./config')

module.exports = async (filePath, options, uploadPath) => {
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
  let token = await login({username, password}, url)
  await upload(filePath, url, {token, bucket, endpoint}, uploadPath)
}
