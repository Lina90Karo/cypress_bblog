Cypress.Commands.add("loginViaPost", (email, password) => {
    // quoted from cypress devs:
    //
    // oftentimes once we have a proper e2e test around logging in
    // there is NO more reason to actually use our UI to log in users
    // doing so wastes is slow because our entire page has to load,
    // all associated resources have to load, we have to fill in the
    // form, wait for the form submission and redirection process
    //
    // with cy.request we can bypass this because it automatically gets
    // and sets cookies under the hood. This acts exactly as if the requests
    // came from the browser
    //
    // in this case we will set 'jwtToken' with 
    // authorization token to local storage to set the login state

    Cypress.log({
        name: 'login',
        message: `Logging user ${email} via POST request`,
    })

    let baseUrlNoAuth = cy.baseUrlNoAuth()
    baseUrlNoAuth = baseUrlNoAuth.replace('/#', '')

    cy.request({
        method: 'POST',
        auth: {
            user: 'candidatex',
            pass: 'qa-is-cool'
        },
        url: `${baseUrlNoAuth}/api/users/login`,
        body:
        {
            user:
            {
                email,
                password,
            }
        },
    }).then((response) => {
        window.localStorage.setItem('jwtToken', response.body.user.token)
      })
})

Cypress.Commands.add("loginViaForm", (email, password) => {
    Cypress.log({
        name: 'login',
        message: `Logging user ${email} via HTML form`,
    })
    cy.get('.form-control[type="text"]').type(email)
    cy.get('.form-control[type="password"]').type(`${password}{enter}`)
    cy.get('button[type="submit"]').click();
})
