const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5176',
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    
    async setupNodeEvents(on, config) {
      // Cucumber preprocessor
      await addCucumberPreprocessorPlugin(on, config);
      
      on('file:preprocessor', createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));
      
      return config;
    },
  },
  
  env: {
    apiUrl: 'https://backend-finanzas-chatbot-production.up.railway.app',
  },
  
  // Configuración de video y screenshots
  video: false,
  screenshotOnRunFailure: true,
  
  // Timeouts
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  
  // Viewport
  viewportWidth: 1280,
  viewportHeight: 720,
});
