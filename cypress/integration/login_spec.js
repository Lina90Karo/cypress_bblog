describe('Logging In - HTML Web Form', function () {

    before(function () {
        // demonstrate using fixtures for test data
        cy.fixture('login').then(function (login) {
            this.registeredUser = login
        })
    })

    context('Unauthorized', function () {
        it('is redirected on visit to my-account when no session', function () {
            // we must have a valid storage token logged
            cy.visit('/login')
            cy.get('button').should(
                'contain',
                'Sign in'
            )
        })

        it('stays on login form when trying to visit user settings when not logged in', function () {
            cy.visit('/settings')
            cy.get('button').should(
                'contain',
                'Sign in'
            )
        })
    })

    context('HTML form submission', function () {
        beforeEach(function () {
            cy.visit('/login')
        })

        it('displays errors on login', function () {
            // incorrect email on purpose
            cy.loginViaForm('should@fail.com', 'password123')

            // error message should be visible
            cy.get('.error-messages')
                .should('be.visible')
                .and('contain', 'email or password is invalid')

            // and we should still be on the same URL
            cy.url().should('include', '/login')
        })

        it('redirects to homepage on success', function () {
            console.log(this.registeredUser)
            cy.loginViaForm(this.registeredUser.email, this.registeredUser.password)

            // we should be redirected to /homepage
            cy.url().should('include', '/')
            cy.get('p').should('contain', 'A place to share your knowledge.')
            cy.get('[routerlink="/editor"]').should('contain', 'New Post')        
        })
    })

    context('HTML form submission with cy.request', function () {

        it('can bypass the UI and yet still test log in', function () {
            // login via custom command added in ../support/commands.js
            cy.loginViaPost(this.registeredUser.email, this.registeredUser.password)
            cy.visit('/')

            cy.get('p').should('contain', 'A place to share your knowledge.')
            cy.get('[routerlink="/editor"]').should('contain', 'New Post')  
        })
    })

   context('Reusable "login" custom command', function () {

        beforeEach(function () {
            // login before each test via custom command added in ../support/commands.js
            cy.loginViaPost(this.registeredUser.email, this.registeredUser.password)
        })

        it('can visit settings', function () {
            // after cy.request, the storage token has been set
            // and we can visit a protected page
            cy.visit('/settings')
            cy.url().should('include', '/settings')
            cy.get('h1').should('contain', 'Your Settings')
        })

        it('can visit new post', function () {
            // or another protected page
            cy.visit('/editor')
            cy.url().should('include', '/editor')
            cy.get('.nav-link.active').should('contain', 'New Post')
        })

    })
})
