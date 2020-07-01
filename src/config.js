const bucketMap = {
  dev: [
    'dd2019071501',
    'didongpic',
    'didongeffects',
    'didongslim',
  ],
  qa: [
    'dd2019071501',
    'didongpic',
    'didongeffects',
    'didongslim',
  ],
  pre: [
    'dd2019071501',
    'didongpic',
    'didongeffects',
    'didongslim',
  ],
  prod: [
    'didong-music',
    'didong-pic',
    'didong-effects',
    'didong-slim'
  ]
}

const hostnameMap = {
  dev: 'http://eureka.dd.inf:30801',
  qa: 'http://10.113.248.214',
  pre: 'https://newbetaadmin.didongkj.com',
  prod: 'https://newadmin.didongkj.com'
}

const getBucketList = env => {
  return bucketMap[env]
}

const getHostname = env => hostnameMap[env]

module.exports = {
  getBucketList,
  getHostname
}