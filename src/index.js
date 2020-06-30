const commander = require('commander')
const inquirer = require('inquirer')
const upload = require('./upload')

const program = new commander.Command()

program
  .option('-u, --username <username>', '系统用户名')
  .option('-p, --password <password>', '系统密码')
  .option('-b, --bucket <bucketName>', 'bucket name')
  .option('-e, --endpoint <endpoint>', 'oss endpoint', 'didongkj.com')

program
  .version(require('../package.json').version, '-v --version')
  .arguments('<file> [env]')
  .action(function(file, env) {
    // console.log(file, env)
    // console.log(program.opts())
    let args = program.opts()
    inquirer.prompt([
      {
        name: 'username',
        message: '请输入系统用户名'
      },
      {
        type: 'password',
        name: 'password',
        message: '请输入系统密码'
      },
      {
        type: 'list',
        name: 'bucket',
        message: '请选择要上传的OSS的存储bucket',
        choices: [
          'dd2019071501',
          'didongpic',
          'didongeffects',
          'didongslim',
          'didong-music',
          'didong-pic',
          'didong-effects',
          'didong-slim'
        ]
      }
    ]).then(async (answer) => {
      // console.log(answer)
      await upload(file, {
        ...answer,
        endpoint: args.endpoint
      })
    })
  })

// console.log(process.argv)

program.parse(process.argv)
