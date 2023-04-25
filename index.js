#!/usr/bin/env node

const program = require('commander')
const inquirer = require("inquirer")
const download = require("download-git-repo")
const path = require("path")
const fs = require("fs")
const ora = require("ora")
const chalk = require("chalk")


program.version('1.0.0')
    .command('init <name>')
    .action(name=>{
        inquirer.prompt([
            {
                name: 'author',
                message: '你的名字是：',
                default: ''
            },
            {
                type: "list",
                name: "gitName",
                message: "你想拉取的项目模版是：",
                choices: [
                  {
                    name: "react-vite",
                    value: "cattlechow/vite-react-ts-template",
                  },
                  {
                    name: "react-webpack",
                    value: "cattlechow/webpack-react-ts-template",
                  }
                ]
              },
            {
                name: 'version',
                message: '版本号',
                default: '1.0.0'
            },
            {
                name: 'description',
                message: '项目描述',
                default: 'a web project template with Babel & ESLint'
            }
        ]).then(res => {
            // 拿到信息参数
            const { author, version, description, gitName } = res
            const beginTime = new Date().getTime()
            // process.cwd()当前目录的绝对路径
            const downloadPath = path.join(process.cwd(), name);
            const loading = ora("template downloading...");
            loading.start();
            download(gitName, downloadPath, err => {
                if(!err) {
                    loading.succeed();
                    const time = (new Date().getTime() - beginTime) / 1000
                    console.log(chalk.green(`create project finish in ${time}s`));
                    // 替换 package.json 信息
                    const packagePath = path.join(downloadPath, "package.json");
                    const packageJson = JSON.parse(
                        fs.readFileSync(packagePath).toString()
                    );
                    Object.assign(packageJson, { name, author, version, description });
                    fs.writeFileSync(
                        packagePath,
                        JSON.stringify(packageJson, null, "\t")
                    );
                }else{
                    console.error(err);
                    loading.stop();
                }
               
            })
        })
    })
program.parse(process.argv)