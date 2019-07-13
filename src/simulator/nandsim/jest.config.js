// jest.config.js
const {defaults} = require('jest-config');
module.exports = {
  // testRegex: ".*\\.spec\\.mjs$",
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mjs'],
};
