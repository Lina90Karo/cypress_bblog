describe('Article CRUD operation', function () {

    before(function () {
        // demonstrate using fixtures for test data
        cy.fixture('login').then(function (login) {
            this.registeredUser = login
        })
    })

    beforeEach(function () {
        cy.loginViaPost(this.registeredUser.email, this.registeredUser.password)
    })

    const article = {
        title: 'kk_qa_title_' + cy.generateRandomString(5),
        summary: 'kk_qa_summary_' + cy.generateRandomString(30),
        md_header: 'MD_Header',
        content: cy.generateRandomString(100),
        tag: 'Cupcake'
    }

    const edited_article = {
        ...article,
        title: 'kk_qa_title_edited_' + cy.generateRandomString(5),
        summary: 'kk_qa_summary_edited_' + cy.generateRandomString(30),
        md_header: 'Edited_MD_Header',
    }

    context('Create and read a new post', function () {
        it('Create a new article', function () {
            cy.visit('/editor')
            cy.get('form').should('be.visible')
            postArticle(article);
            checkArticleContent(article)
        })

        it('Read just added post on home page ', function () {
            cy.visit('/')
            cy.get('.nav-link').contains('Global Feed').click()
            checkArticle(article)
            cy.get('a.preview-link').contains(article.title).click()
            checkArticleContent(article)
        })

        it('Read just added post on profile page ', function () {
            cy.visit('/')
            cy.get('a.nav-link[href^="#/profile"]').click()        
            cy.url().should('eq', `${cy.baseUrlNoAuth()}/profile/${this.registeredUser.username}`)
            cy.get('[routerlinkactive="active"]').should('contain', 'My Articles')
            checkArticle(article)
            cy.get('a.preview-link').contains(article.title).click()
            checkArticleContent(article)
        })
         
         it('Open article as a not logged in user ', function () {
            cy.visit('/settings')
            cy.get('button').contains('logout').click()
            cy.visit('/')
            cy.get('.nav-link').contains('Global Feed').click()
            checkArticle(article)
            cy.get('.author').should('contain', this.registeredUser.username)
            cy.get('.date').should('be.visible')
            cy.get('a.preview-link').contains(article.title).click()
            cy.get('.author').should('contain', this.registeredUser.username)
            cy.get('.date').should('be.visible')
            checkArticleContent(article)
         })
    })

    context('Edit post', function () {

        it('Edit just added post ', function () {
            cy.visit(`/profile/${this.registeredUser.username}`)
            cy.get('a.preview-link').contains(article.title).click()
            checkArticleContent(article)
            cy.contains('Edit Article').click()
            cy.url().should('include', `${cy.baseUrlNoAuth()}/editor/`)
            cy.get('form.dynamic-form').should('be.visible')
            postArticle(edited_article)
            checkArticleContent(edited_article)    
        })

        it('Read just edited post on profile page ', function () {
            cy.visit(`/profile/${this.registeredUser.username}`)
            cy.get('[routerlinkactive="active"]').should('contain', 'My Articles')
            checkArticle(edited_article)
        })
    })

    context('Delete post', function () {

        it('Delete edited post ', function () {
            cy.visit(`/profile/${this.registeredUser.username}`)
            cy.get('a.preview-link').contains(edited_article.title).click()
            checkArticleContent(edited_article)
            cy.contains('Delete Article').click()
            cy.url().should('eq', `${cy.baseUrlNoAuth()}/`)
        })

        it('Check whether the deleted post on longer exists on home page in global feed ', function () {
            cy.visit('/')
            cy.get('.nav-link').contains('Global Feed').click()
            checkArticle(edited_article, false)
        })

        it('Check whether the deleted post on longer exists on profile page ', function () {
            cy.visit(`/profile/${this.registeredUser.username}`)
            cy.get('[routerlinkactive="active"]').should('contain', 'My Articles')
            checkArticle(edited_article, false)
        })
    })

    const postArticle = (article) => {
        cy.get('.form-control[placeholder="Article Title"]').clear().type(`${article.title}{enter}`)
        cy.get('.form-control[placeholder^="What"]').clear().type(`${article.summary}{enter}`)
        cy.get('.form-control[placeholder="Write your article (in markdown)"]').clear().type(`## ${article.md_header}\n`).type(`${article.content}{enter}`)
        cy.get('.form-control[placeholder="Enter Tags"]').clear().type(`${article.tag}{enter}`)

        cy.contains("Publish Article").click();
    }

    const checkArticle = (article, existing = true) => {
        if (!existing) {
            cy.contains(article.title).should('not.exist')
            cy.contains(article.summary).should('not.exist')
            return
        }
        cy.contains(article.title).should('be.visible')
        cy.contains(article.summary).should('be.visible')
        cy.contains(article.tag).should('be.visible')
    }

    const checkArticleContent = (article) => {
        cy.url().should('include', `${cy.baseUrlNoAuth()}/article/`)
        cy.get('.container h1').should('contain', article.title)
        cy.get('h2').should('be.visible').should('contain.text', article.md_header)
        cy.get('.comment-form').should('be.visible')
    }

})
