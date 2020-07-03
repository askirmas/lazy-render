/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const browserify = require('@cypress/browserify-preprocessor')

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const options = browserify.defaultOptions

  options.typescript = require.resolve('typescript')
  on('file:preprocessor', browserify(options))
  
  const {viewportWidth: w, viewportHeight: h} = config

  on('before:browser:launch', (browser = {}, launchOptions) => {
    switch (browser.name) {
    //browser.family === 'chromium' && browser.name !== 'electron')
      case 'chrome':
        launchOptions.args.push(`--window-size=${w},${h}`)
        /*
        launchOptions.push('--cast-initial-screen-width=1600')
        launchOptions.push('--cast-initial-screen-height=900')
         */
        break
      case 'electron':
        launchOptions.preferences.width = w
        launchOptions.preferences.height = h
        break
    }

    return launchOptions
  })

  return config
}
