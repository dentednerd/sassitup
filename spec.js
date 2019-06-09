module.exports = `/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const myFunction = require('../index')

describe('myFunction', function () {
  it('is a function', function () {
    expect(myFunction).to.be.a('function')
  })
  it('returns true', function () {
    expect(myFunction()).to.be.true
  })
})
`;