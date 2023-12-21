describe('template spec', () => {
	it('passes', () => {
		cy.visit('http://localhost:5173/')

		cy.get('[data-testid="title"]')
			.should('exist')
			.should('have.text', 'Cypress')
	})

	it('example', () => {
		cy.visit('http://localhost:5173/')

		cy.get('[data-testid="todo-1"]')
			.should('exist')
	})
})
