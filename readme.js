const userInput = process.argv;
const path = userInput[2];

module.exports = `# ${path}

A new project created with SassItUp.

## Usage

\`yarn start\` or \`gulp\`: Starts watching for changes in the Sass directory. On first run, this will create the \`index.css\` file required by \`index.html\`.

## Git setup

This project comes with a \`.gitignore\` file. Create a new empty repository on Github, click "Clone or download", copy your repo's remote URL, then in a new terminal run:

\`\`\`sh
git remote add origin <your-remote-url>
\`\`\`
`;
