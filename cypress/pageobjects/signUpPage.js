export default class signUpPage {

    usernameInput = () => cy.get('.form-control[placeholder="Username"][type="text"]')
    emailInput = () => cy.get('.form-control[placeholder="Email"][type="text"]')
    passwordInput = () => cy.get('.form-control[placeholder="Password"][type="password"]')
    submitButton = () => cy.get('button[type="submit"]')
    accountCreationError = () => cy.get('.error-messages')
    accountCreationForm = () => cy.get('.dynamic-form')
    myAccountName = () => cy.get('[routerlinkactive="active"]')

    visitAuthenticationPage() {
        
        cy.visit('/register')
        this.accountCreationForm().should('be.visible');
        this.submitButton().should('be.visible');
    }

    generateRandomEmail = () => {
        return cy.generateRandomString() + '@' + cy.generateRandomString() + '.com'
    }

}

