'use strict';

exports.config = {
  specs: [
    'test/e2e/*.spec.js',
  ],

  capabilities: {
    browserName: 'phantomjs',
    'phantomjs.binary.path': './node_modules/phantomjs/bin/phantomjs'
  },

  baseUrl: 'http://localhost:9999',
  rootElement: 'body',
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
