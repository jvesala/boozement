import { RegisterUser } from '../../src/server/domain';

describe('Boozement insert test', () => {
    const now = Date.now();
    const email = `test.email+${now}@example.com`;
    const password = 'passwordPassword';

    before(() => {
        const user: RegisterUser = {
            email,
            gender: 'M',
            password,
            weight: 75000,
        };
        cy.request('POST', 'http://localhost:3000/api/register', user);
    });

    it('Inserts serving', () => {
        cy.visit('http://localhost:3000');
        cy.get('input[name=email]').type(email);
        cy.get('input[name=password]').type(password);
        cy.get('button[type=submit]').click();

        cy.get('.loggedIn').contains(email);
    });
});
