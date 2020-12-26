import signUpPage from '../pageobjects/signUpPage';
/* Page Object model is generally discouraged by Cypress devs,
   see for example: https://www.cypress.io/blog/2019/01/03/stop-using-page-objects-and-start-using-app-action
   but as it is popular in various other frameworks,
   I'll demonstrate it here */

describe('Sign-up', function () {
    const signup = new signUpPage();

    beforeEach(function () {
        signup.visitAuthenticationPage();
    })
    context('Failed register', function () {
        it('fails when empty form is submitted', function () {
      
            signup.submitButton().click();

            // error message should be visible
            signup.accountCreationError()
                .should('be.visible')
        })

    })
    context('Successful register', function () {
        beforeEach(function () {
            cy.fixture('signup').then(function (signup) {
                this.userData = signup;
            })
        })

        it('registers with required data', function () {
            const randomUsername = cy.generateRandomString();
            const randomEmail = signup.generateRandomEmail();

            signup.usernameInput().type(randomUsername);
            signup.emailInput().type(randomEmail);
            signup.passwordInput().type(`${this.userData.password}{enter}`);
            signup.submitButton().click();
           
            // expect user to be registered and logged in after signup
            signup.myAccountName().should('contain', `${randomUsername}`);
        })

    })

})
