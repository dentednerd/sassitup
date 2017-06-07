module.exports = `{
  "name": "TEST",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "mocha ./spec",
    "lint": "eslint ./",
    "precommit": "npm run lint && npm test"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "chai": "^4.0.2",
    "eslint": "^3.19.0",
    "husky": "^0.13.4",
    "mocha": "^3.4.2"
  }
}`;

