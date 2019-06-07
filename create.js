const fs = require('fs');
const { exec } = require('child_process');
const userInput = process.argv;
const packageJS = require('./package.js');
const specFile = require('./spec.js');

const createSpec = (path) => {
  fs.mkdir(path + '/spec', (err) => {
    if (err) {
      console.log(`FAILED: create /${path}/spec`, err);
    } else {
      console.log(`Created /${path}/spec`);
      fs.writeFile(path + '/spec/index.spec.js', specFile, function (err) {
        if (err) {
          console.log('FAILED:  create index.spec.js');
        } else {
          console.log(`Created /${path}/spec/index.spec.js`);
        }
      });
    }
  });
}

const createSrc = (path) => {
  fs.mkdir(path + '/src', (err) => {
    if (err) {
      console.log(`FAILED: create /${path}/src`, err);
    } else {
      console.log(`Created /${path}/src`);
    }
  });
}

const createPath = (path) => {
  if (!path) {
    return console.log('Please provide a path.');
  }
  fs.mkdir(path, (err) => {
    if (err) {
      console.log(`FAILED: create /${path}`, err);
    } else {
      console.log(`Created /${path}`);
    }
  });
}

const createGitignore = (path) => {
  fs.writeFile(path + '/.gitignore', '# Dependency directories \nnode_modules/\n# Optional npm cache directory \n.npm\n# Optional eslint cache\n.eslintcache', (err) => {
    if (err) {
      console.log(`FAILED: create /${path}/.gitignore`, err);
    } else {
      console.log(`Created /${path}/.gitignore`);
    }
  });
}

const createFile = (path, data) => {
  fs.writeFile(path + '/index.js', data, (err) => {
    if (err) {
      console.log(`FAILED: create ${path}/index.js`, err);
    } else {
      console.log(`Created /${path}/index.js`);
    }
  });
}

const createPackageJson = (path) => {
  fs.writeFile(path + '/' + 'package.json', packageJS, (err) => {
    if (err) {
      console.log(`FAILED: create /${path}/package.json`, err);
    } else {
      console.log(`Created /${path}/package.json`);
    }
  });
}

const npmInstall = (path) => {
  exec('cd ' + path + ' && npm install && npm audit fix', (error, stdout, stderr) => {
    if (error) {
      console.error('FAILED: npm install', stderr);
      throw error;
    } else {
      exec('cd ' + path + ' npm audit fix --force', (error, stdout, stderr) => {
        if (error) {
          console.error('FAILED: npm audit fix', stderr);
          throw error;
        } else {
          exec('cd ' + path + ' && code .', (error, stdout, stderr) => {
            if (error) {
              console.error('FAILED: open directory in VSCode', stderr);
              throw error;
            } else {
              console.log(`Opened /${path} in VSCode`);
              console.log(`\n${path} created! Happy coding!`);
            }
          });
        }
      })
    }
  });
}

const newProject = () => {
  const path = userInput[2];
  const data = userInput[3];
  if (!path) {
    return console.log('Please provide a path.');
  }
  if (fs.existsSync(path)) {
    console.log(`The directory ${path} already exists.`);
  }
  else {
    createPath(path);
    createSpec(path);
    createSrc(path);
    createGitignore(path);
    createFile(path, data);
    createPackageJson(path);
    npmInstall(path);
  }
};

newProject();