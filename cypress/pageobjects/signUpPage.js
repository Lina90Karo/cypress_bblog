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
       // const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
        // let
        //     email = '',
        //     tmp;

        // for (let i = 0; i < 32; i++) {
        //     tmp = chars.charAt(Math.round(chars.length * Math.random()));
        //     email = email + tmp;
        // }
        // tmp = '';
        return cy.generateRandomString() + '@' + cy.generateRandomString() + '.com'
        // const email = this.generateRandomString() + '@' + this.generateRandomString() + '.com'
        // email = email + "@";
        // for (let i = 0; i < 64; i++) {
        //     tmp = chars.charAt(Math.round(chars.length * Math.random()));
        //     email = email + tmp;
        // }
        // return email + ".com";
    }

}

