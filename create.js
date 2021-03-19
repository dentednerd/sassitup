#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const colors = require('colors');
const userInput = process.argv;
const specFile = require('./spec.js');
const gitIgnore = require('./gitignore.js');
const backupData = require('./data.js');
const readme = require('./readme.js');

const setupFiles = async (path, data) => {
  console.log(colors.yellow(`\nCreating ${path} directory...`));
  await fs.mkdir(path, (e) => e && console.log(colors.red(`FAILED: create /${path}`, e)));
  await fs.mkdir(`${path}/spec`, (e) => e && console.log(colors.red(`FAILED: create /${path}/spec`, e)));
  await fs.writeFile(`${path}/spec/index.spec.js`, specFile, (e) => e && console.log(colors.red('FAILED:  create index.spec.js')));
  await fs.writeFile(`${path}/index.js`, data, (e) => e && console.log(colors.red(`FAILED: create ${path}/index.js`, e)));
  await fs.writeFile(`${path}/.gitignore`, gitIgnore, (e) => e && console.log(colors.red(`FAILED: create /${path}/.gitignore`, e)));
  await fs.writeFile(`${path}/README.md`, readme, (e) => e && console.log(colors.red(`FAILED: create ${path}/README.md`, e)));
  return;
}

const npmInstall = (path) => {
  console.log(colors.yellow(`\nCreated ${path} directory. Installing packages...`));
  execSync(`cd ${path} && npm init -y && npm install chai eslint eslint-config-standard eslint-plugin-import eslint-plugin-node eslint-plugin-promise husky mocha`, (error, stdout, stderr) => {
    if (error) {
      console.log(`Error during NPM install: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`Error during NPM install: ${stderr}`);
      return;
    }
    console.log(`NPM install: ${stdout}`);
  });

  console.log(colors.yellow(`Packages installed. Updating package.json...`));

  const packageToUpdate = fs.readFileSync(`${path}/package.json`);
  const packageContent = JSON.parse(packageToUpdate);
  packageContent.description = "A new project created with NodeItUp.";
  packageContent.scripts = {
    "start": "node index.js",
    "test": "mocha ./spec",
    "lint": "eslint ./",
    "precommit": "npm run lint && npm test"
  };
  packageContent.eslintConfig = {
    "extends": "standard",
    "env": {
      "browser": true,
      "node": true,
      "mocha": true
    }
  };

  fs.writeFile(
    `${path}/package.json`,
    JSON.stringify(packageContent, null, 2),
    (e) => e && console.log('FAILED: package.json update', e)
  );
  console.log(colors.yellow(`package.json updated. Opening in VSCode...`));
  return;
}

const newProject = async () => {
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
    await setupFiles(path, data).then(async () => await npmInstall(path)).then(() => {
      execSync(`cd ${path} && code .`, (error, stdout, stderr) => {
        if (error) {
          console.error(colors.red('FAILED: open directory in VSCode'), stderr);
          throw error;
        }}
      );
    }).finally(() => {
      console.log(colors.cyan(`\nYour project ${path} is ready! Happy coding!\n`));
      return;
    });
  }
};

newProject().catch(e => {
  console.log('There has been a problem creating this project: ' + e.message);
});
