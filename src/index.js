const commander = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const autoUpload = require('./autoUpload')
const upload = require('./upload')
const login = require('./login')
const { getBucketList, getHostname } = require('./config')

const program = new commander.Command()

program
  .option('-e, --env <env>', '环境变量')
  .option('-u, --username <username>', '系统用户名')
  .option('-p, --password <password>', '系统密码')
  .option('-b, --bucket <bucketName>', 'bucket name')
  .option('-e, --endpoint <endpoint>', 'oss endpoint', 'didongkj.com')

program
  .version(require('../package.json').version, '-v --version')
  .arguments('<file>')
  .action(async function (file) {
    let args = program.opts()
    // console.log(args)
    if (!args.env || !args.username || !args.password || !args.bucket) {
      let options = {}
      inquirer.prompt([

        {
          type: 'list',
          name: 'env',
          message: '请选择上传环境',
          choices: [
            'dev',
            'qa',
            'pre',
            'prod'
          ]
        }
      ])
        .then(async (answer) => {
          // console.log(answer)
          let host = getHostname(answer.env)
          console.log(`你要上传的服务域名为 ${chalk.blue(host)}`)
          options = { ...answer, host }

          return inquirer.prompt([
            {
              name: 'username',
              message: '请输入系统用户名'
            },
            {
              type: 'password',
              name: 'password',
              message: '请输入系统密码'
            }
          ])
        })
        .then(async (answer) => {
          options = { ...options, ...answer }
          // console.log(options)
          let token = await login({
            username: options.username,
            password: options.password
          }, options.host)
          // console.log(token)
          options.token = token

          if (token) {
            let bucketList = getBucketList(options.env)
            return inquirer.prompt([
              {
                type: 'list',
                name: 'bucket',
                message: '请选择要上传的OSS的存储bucket',
                choices: bucketList
              }
            ])
          } else {
            return Promise.reject('登录失败')
          }
        })
        .then(async (answer) => {
          options = { ...options, ...answer }
          // console.log(options)
          await upload(file, options.host, {
            ...options,
            endpoint: args.endpoint
          })
        })
        .catch(err => {
          console.log(chalk.red(err))
        })
    } else {
      await autoUpload(file, args)
    }

  })

// console.log(process.argv)

program.parse(process.argv)
