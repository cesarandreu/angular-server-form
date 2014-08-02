'use strict';

exports.config = {

  seleniumArgs: [],
  chromeOnly: false,
  specs: [
    'test/e2e/*.spec.js',
  ],

  capabilities: {
    browserName: 'chrome',
    count: 1,
    shardTestFiles: false,
    maxInstances: 1
  },

  baseUrl: 'http://localhost:9999',
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
