import { RegisterUser } from '../../src/server/domain';

describe('Main page test', () => {
  it('Opens main page - FI', () => {
    cy.visit('/');
    cy.get('h3').contains('Kirjaudu sisään');
    cy.get('button').contains('Kirjaudu');
  });

  it('Opens main page - EN', () => {
    cy.visit('/');
    cy.get('.flagEN').click();
    cy.get('h3').contains('Login');
    cy.get('button').contains('Login');
  });

  it('Logs in to system', () => {
    const now = Date.now();
    const email = `test.email.login+${now}@example.com`;
    const password = 'passwordPassword';

    const user: RegisterUser = {
      email,
      gender: 'M',
      password,
      weight: 75000,
    };
    cy.request('POST', '/api/register', user);

    cy.visit('/');
    cy.get('input[name=email]').type(email);
    cy.get('input[name=password]').type(password);
    cy.get('button[type=submit]').click();

    cy.get('.loggedIn').contains(email);
  });
});
