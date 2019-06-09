const userInput = process.argv;
const path = userInput[2];

module.exports = `# ${path}

A new project created with NodeItUp.

## Usage

\`npm run start\`: Runs \`index.js\` in Node.

\`npm test\`: Runs \`spec/index.spec.js\` in Mocha, using Chai assertions, to test \`index.js\`.

\`npm run lint\`: Runs ESLint with Standard config across the entire project. You can find the ESLint config in \`package.json\`.

## Git setup

This project comes with a \`.gitignore\` file. Create a new empty repository on Github, click "Clone or download", copy your repo's remote URL, then in a new terminal run:

\`\`\`sh
git remote add origin <your-remote-url>
\`\`\`
`;