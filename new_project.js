const fs = require('fs');
const exec = require('child_process').exec;
const userInput = process.argv;
const packageJS = require('./package.js');
const specFile = require('./spec.js');

function newProject() {
    const path = userInput[2];
    const filename = userInput[3];
    const data = userInput[4];
    if (userInput.length < 3) {
        return console.log('Can you provide a path and filename?');
    }
    fs.exists(path, function (exists) {
        if (exists === true) {
            console.log('This directory exists');
        }
        else {
            fs.mkdir(path, function (err) {
                if (err) {
                    console.log('FAILED to create directory', err);
                } else {
                    console.log('YAY');
                    fs.mkdir(path + '/spec', function (err) {
                        if (err) {
                            console.log('ERROR creating spec folder', err);
                        } else {
                            console.log('spec folder created');
                            // read and write spec
                            fs.writeFile(path + '/spec/' + filename.substring(0, filename.length - 3) + '.spec.js', specFile, function (err) {
                                if (err) {
                                    console.log('ERROR writing ' + filename.substring(0, filename.length - 3) + '.spec.js');
                                } else {
                                    console.log(filename.substring(0, filename.length - 3) + '.spec.js created');
                                }
                            });
                        }
                    });
                    fs.mkdir(path + '/src', function (err) {
                        if (err) {
                            console.log('ERROR creating src folder', err);
                        } else {
                            console.log('src folder created');
                        }
                    });
                }
            });
        }
        // gitignore
        fs.writeFile(path + '/.gitignore', '# Dependency directories \nnode_modules/\n# Optional npm cache directory \n.npm\n# Optional eslint cache\n.eslintcache', function (err) {
            if (err) {
                console.log('ERROR creating .gitignore', err);
            } else {
                console.log('.gitignore created');
            }
        });
        // index.js or whatever we pass it
        fs.writeFile(path + '/' + filename, data, function (err) {
            if (err) {
                console.log('ERROR creating ' + filename, err);
            } else {
                console.log(filename + ' created');
            }
        });
        // read and write package.JSON
        fs.writeFile(path + '/' + 'package.json', packageJS, function (err) {
            if (err) {
                console.log('ERROR writing package');
            } else {
                console.log('package.json created');
            }
        });
        // install npm
        exec('cd ' + path + ' && npm install', function (error, stdout, stderr) {
            if (error) {
                console.error('stderr', stderr);
                throw error;
            }
            console.log('stdout', stdout);
        });

        exec('cd ' + path + ' && code .', function (error, stdout, stderr) {
            if (error) {
                console.error('stderr', stderr);
                throw error;
            }
            console.log('stdout', stdout);
        });
    });
}

newProject();