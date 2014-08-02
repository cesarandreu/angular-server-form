'use strict';

exports.config = {
  specs: [
    'test/e2e/*.spec.js',
  ],

  chromeDriver: './node_modules/protractor/selenium/chromedriver',
  capabilities: {
    browserName: 'chrome'
  },

  baseUrl: 'http://127.0.0.1:9999',
  allScriptsTimeout: 11000,
  getPageTimeout: 10000,

  framework: 'jasmine',

  // Options to be passed to minijasminenode.
  //
  // See the full list at https://github.com/juliemr/minijasminenode/tree/jasmine1
  jasmineNodeOpts: {
    // If true, display spec names.
    isVerbose: false,
    // If true, print colors to the terminal.
    showColors: true,
    // If true, include stack traces in failures.
    includeStackTrace: true,
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 30000
  }

};
