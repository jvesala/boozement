describe('Update weight', () => {
  it('Updates weight', () => {
    cy.registerAndLogin();

    cy.visit('/userdata');

    cy.get('input[name=weight]').clear().type('100');
    cy.get('button[type=submit]:nth(0)').click();

    cy.get('.UserdataForm .result').contains('Päivitetty');
  });
});
