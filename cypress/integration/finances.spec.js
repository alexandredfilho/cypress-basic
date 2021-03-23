import { format, prepareLocalStorage } from '../support/utils'

context('Dev Finances Agilizei', () => {

  beforeEach(() => {
    cy.visit('https://devfinance-agilizei.netlify.app/', {
      onBeforeLoad: (win) => {
        prepareLocalStorage(win)
      }
    })

    cy.get('#data-table tbody tr').should('have.length', 2)
  });
  it('Cadastrar Entradas', () => {

    cy.get('#transaction .button').click() //id + class
    cy.get('#description').type('Mesada') // somente id
    cy.get('[name=amount]').type(12) //atributos
    cy.get('[type=date]').type('2021-03-17') //atributos
    cy.get('button').contains('Salvar').click() //tipo e valor

    cy.get('#data-table tbody tr').should('have.length', 3)
  });

  it('Cadastrar Saídas', () => {

    cy.get('#transaction .button').click() //id + class
    cy.get('#description').type('Mesada') // somente id
    cy.get('[name=amount]').type(-12) //atributos
    cy.get('[type=date]').type('2021-03-17') //atributos
    cy.get('button').contains('Salvar').click() //tipo e valor

    cy.get('#data-table tbody tr').should('have.length', 3)
  });

  it('Remover entradas e saídas', () => {

    cy.get('td.description')
      .contains("Mesada")
      .parent()
      .find('img[onclick*="remove"]').click()

    cy.get('td.description')
      .contains('Suco Kapo')
      .siblings()
      .children('img[onclick*="remove"]').click()

      cy.get('#data-table tbody tr').should('have.length', 0)

    });

    it('Validar saldo com diversas transações', () => {

    let incomes = 0
    let expenses = 0

    cy.get('#data-table tbody tr').each(($el, index, $list) => {
        cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
          if (text.includes('-')){
            expenses = expenses + format(text)
          } else{
            incomes = incomes + format(text)
          }
          cy.log(`entadas`, incomes)
          cy.log(`saídas`, expenses)
          })
      })

    cy.get('#totalDisplay').invoke('text').then(text => {

      let formatedTotalDisplay = format(text)
      let expectedTotal = incomes + expenses

      expect(formatedTotalDisplay).to.eq(expectedTotal)
    })

    });
});