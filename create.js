#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');
const colors = require('colors');
const userInput = process.argv;
const packageJS = require('./package.js');
const specFile = require('./spec.js');
const gitIgnore = require('./gitignore.js');
const backupData = require('./data.js');
const readme = require('./readme.js');

const setupFiles = (path, data) => {
  if (!path) {
    return console.log(colors.red('Please provide a path.'));
  }
  fs.mkdir(path, (err) => {
    if (err) {
      console.log(colors.red(`FAILED: create /${path}`, err));
    } else {
      fs.mkdir(path + '/spec', (err) => {
        if (err) {
          console.log(colors.red(`FAILED: create /${path}/spec`, err));
        } else {
          fs.writeFile(path + '/spec/index.spec.js', specFile, function (err) {
            if (err) {
              console.log(colors.red('FAILED:  create index.spec.js'));
            } else {
              fs.writeFile(path + '/index.js', data, (err) => {
                if (err) {
                  console.log(colors.red(`FAILED: create ${path}/index.js`, err));
                } else {
                  fs.writeFile(path + '/.gitignore', gitIgnore, (err) => {
                    if (err) {
                      console.log(colors.red(`FAILED: create /${path}/.gitignore`, err));
                    } else {
                      fs.writeFile(path + '/' + 'package.json', packageJS, (err) => {
                        if (err) {
                          console.log(colors.red(`FAILED: create /${path}/package.json`, err));
                        } else {
                          fs.writeFile(path + '/README.md', readme, (err) => {
                            if (err) {
                              console.log(colors.red(`FAILED: create ${path}/README.md`, err));
                            } else {
                              console.log(colors.yellow(`\nCreated ${path} directory. Running npm install...`));
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}

const npmInstall = (path) => {
  exec('cd ' + path + ' && npm install && npm audit fix', (error, stdout, stderr) => {
    if (error) {
      console.error(colors.red('FAILED: npm install'), stderr);
      throw error;
    } else {
      exec('cd ' + path + ' npm audit fix --force', (error, stdout, stderr) => {
        if (error) {
          console.error(colors.red('FAILED: npm audit fix'), stderr);
          throw error;
        } else {
          exec('cd ' + path + ' && code .', (error, stdout, stderr) => {
            if (error) {
              console.error(colors.red('FAILED: open directory in VSCode'), stderr);
              throw error;
            } else {
              console.log(colors.yellow(`\nOpened ${path} in VSCode.`));
              console.log(colors.cyan(`\nYour project ${path} is ready! Happy coding!\n`));
            }
          });
        }
      })
    }
  });
}

const newProject = () => {
  const path = userInput[2];
  let data = userInput[3];
  if (!path) {
    return console.log('Please provide a path.');
  }
  if (!data) {
    data = backupData;
  }
  if (fs.existsSync(path)) {
    console.log(`The directory ${path} already exists.`);
  }
  else {
    setupFiles(path, data);
    npmInstall(path);
  }
};

newProject();