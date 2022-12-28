// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { RegisterUser } from '../../src/server/domain';

const registerAndLogin = () => {
  const now = Date.now();
  const email = `test.email+${now}@example.com`;
  const password = 'passwordPassword';

  const user: RegisterUser = {
    email,
    gender: 'M',
    password,
    weight: 75000,
  };
  cy.request('POST', '/api/register', user);
  cy.request('POST', '/api/login', {
    email: user.email,
    password: user.password,
  });
};

Cypress.Commands.add('registerAndLogin', registerAndLogin);
