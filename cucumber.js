/**
 * Cucumber.js configuration file
 * This file exports the configuration object for Cucumber.js test runner.
 */
module.exports = {
  
  /**
   * Default configuration for Cucumber.js
   */
  default: {
    
    /**
     * Number of parallel workers to use for running tests
     * @type {number}
     */
    parallel: 2,

    /**
     * Glob patterns for locating feature files
     * @type {string[]}
     */
    paths: ["./features/**/*.feature"],

    /**
     * Modules to require before running tests
     * ts-node/register is required for TypeScript support
     * @type {string[]}
     */
    requireModule: ['ts-node/register'],

    /**
     * Glob patterns for step definitions and hooks
     * @type {string[]}
     */
    require: ["./steps/**/*.ts", "./hooks/**/*.ts"],

    /**
     * Output formats for test results
     * @type {string[]}
     */
    format: [
      "progress-bar",                         // Console output
      "json:reports/cucumber-report.json",    // JSON report
      "html:reports/cucumber-report.html",    // HTML report
    ],

    /**
     * Formatting options for test output
     * @type {Object}
     */
    formatOptions: { 
      /**
       * Interface style for generated step definition snippets
       * @type {string}
       */
      snippetInterface: "async-await" 
    },

    /**
     * Parameters to be passed to the world object
     * Spreads all environment variables into world parameters
     * @type {Object}
     */
    worldParameters: {
      ...process.env,
    },
  },
}