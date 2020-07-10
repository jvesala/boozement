describe('Boozement insert test', () => {
    it('Inserts serving', () => {
        cy.registerAndLogin();

        cy.visit('/insert');

        cy.get('input[name=type]').type('Beer');
        cy.get('input[name=amount]').type('33');
        cy.get('input[name=units]').type('1');
        cy.get('button[type=submit]:nth(0)').click();

        cy.get('.result').contains('Beer');
    });
});
