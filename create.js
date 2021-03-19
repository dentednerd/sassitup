#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const colors = require('colors');
const userInput = process.argv;
const gitIgnore = require('./gitignore.js');
const readme = require('./readme.js');
const html = require('./html.js');
const gulp = require('./gulp.js');

const sassDirs = ['abstracts', 'base', 'components', 'layout', 'pages', 'themes', 'vendors'];

const errorLog = (e) => {
  return console.log(colors.red(`Failed to create /${path}`, e));
}

const setupFiles = async (path) => {
  console.log(colors.yellow(`\nCreating ${path} directory...`));
  await fs.mkdir(path, (e) => e && errorLog(e));
  await fs.mkdir(`${path}/sass`, (e) => e && errorLog(e));
  sassDirs.forEach(async (dir) => {
    await fs.mkdir(`${path}/sass/${dir}`, (e) => e && errorLog(e));
  });
  await fs.writeFile(`${path}/sass/index.sass`, '', (e) => e && errorLog(e));
  await fs.writeFile(`${path}/index.html`, html, (e) => e && errorLog(e));
  await fs.writeFile(`${path}/gulpfile.js`, gulp, (e) => e && errorLog(e));
  await fs.writeFile(`${path}/.gitignore`, gitIgnore, (e) => e && errorLog(e));
  await fs.writeFile(`${path}/README.md`, readme, (e) => e && errorLog(e));
  return;
}

const yarnInstall = (path) => {
  console.log(colors.yellow(`\nCreated ${path} directory. Installing packages...`));
  execSync(`cd ${path} && yarn init -y && yarn add gulp gulp-sass gulp-sourcemaps gulp-uglifycss`, (error, stdout, stderr) => {
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

  console.log(colors.yellow(`\nPackages installed. Updating package.json...`));

  const packageToUpdate = fs.readFileSync(`${path}/package.json`);
  const packageContent = JSON.parse(packageToUpdate);
  packageContent.description = "A new project created with SassItUp.";
  packageContent.scripts = {
    "start": "gulp",
  };

  fs.writeFile(
    `${path}/package.json`,
    JSON.stringify(packageContent, null, 2),
    (e) => e && console.log('FAILED: package.json update', e)
  );
  console.log(colors.yellow(`\npackage.json updated. Opening in VSCode...`));
  return;
}

const newProject = async () => {
  const path = userInput[2];
  if (!path) {
    return console.log('Please provide a path.');
  }
  if (fs.existsSync(path)) {
    console.log(`The directory ${path} already exists.`);
  }
  else {
    await setupFiles(path).then(async () => await yarnInstall(path)).then(() => {
      execSync(`cd ${path} && code .`, (error, stdout, stderr) => {
        if (error) {
          console.error(colors.red('Failed to open directory in VSCode\n'), stderr);
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
