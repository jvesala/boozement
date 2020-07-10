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
        cy.request('POST', '/api/register', user);
        cy.request('POST', '/api/login', {
            email: user.email,
            password: user.password,
        });
    });

    it('Inserts serving', () => {
        cy.visit('/insert');

        cy.get('input[name=type]').type('Beer');
        cy.get('input[name=amount]').type('33');
        cy.get('input[name=units]').type('1');
        cy.get('button[type=submit]:nth(0)').click();

        cy.get('.result').contains('Beer');
    });
});
