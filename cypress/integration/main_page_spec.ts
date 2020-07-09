describe('Boozement main page test', () => {
    it('Opens main page - FI', () => {
        cy.visit('http://localhost:3000');
        cy.get('h3').contains('Kirjaudu sisään');
        cy.get('button').contains('Kirjaudu');
    });

    it('Opens main page - EN', () => {
        cy.visit('http://localhost:3000');
        cy.get('.flagEN').click();
        cy.get('h3').contains('Login');
        cy.get('button').contains('Login');
    });
});
