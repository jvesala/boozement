describe('Update password', () => {
    it('Updates password', () => {
        cy.registerAndLogin();

        cy.visit('/userdata');

        cy.get('input[name=current]').clear().type('passwordPassword');
        cy.get('input[name=new]').clear().type('passwordPassword');
        cy.get('input[name=copy]').clear().type('passwordPassword');
        cy.get('button[type=submit]:nth(1)').click();

        cy.get('.PasswordForm .result').contains('Salasana vaihdettu');
    });
});
