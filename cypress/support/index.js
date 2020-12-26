// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************


import './commands'

// add method to cy object instead of a custom command to avoid returning a promise
cy.generateRandomString = (length = 32) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let string = '',
        tmp;

    for (let i = 0; i < length; i++) {
        tmp = chars.charAt(Math.round(chars.length * Math.random()));
        string = string + tmp;
    }
    return string;
}
// get base url without basic auth credentials
cy.baseUrlNoAuth = () => {
    return Cypress.config().baseUrl.replace(
        /(http.:\/\/).*:.*@(.*)$/,
        "$1$2"
    )
}
