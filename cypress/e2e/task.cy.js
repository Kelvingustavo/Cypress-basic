describe('Tarefas', () => {

    let testData;

    before(() => {
        cy.fixture('tasks').then(t => {
            testData = t  // Busca tasks.json , então salva testData com o conteudo de t vindo de tasks
        })
    })

    context('cadastro', () => {

        it('deve cadastrar uma nova tarefa', () => {

            const taskName = 'Estudar Javascript'

            cy.removeTaskByName(taskName)
            cy.createTask(taskName)

            cy.contains('main div p', taskName)
                .should('be.visible')
        })

        it('Não deve permitir tarefa duplicada', () => {

            const task = testData.dup

            cy.removeTaskByName(task.name)
            cy.postTask(task)

            //Cadastro de tarefa duplicado
            cy.createTask(task.name)

            //Validação 
            cy.get('.swal2-html-container')
                .should('be.visible')
                .should('have.text', 'Task already exists!')

        })

        it('Campo obrigatório', () => {
            cy.createTask()

            cy.isRequired('This is a required field')
        })

    })

    context('atualização', () => {
        it('deve concluir uma tarefa', () => {
            const task = {
                name: 'Comprar ketchup',
                is_done: false
            }

            cy.removeTaskByName(task.name)
            cy.postTask(task)

            cy.visit('/')

            cy.contains('p', task.name)
                .parent()
                .find('button[class*=ItemToggle]') //encontrar botão que a classe contem * o texto 
                .click()

            cy.contains('p', task.name)
                .should('have.css', 'text-decoration-line', 'line-through') //deve conter no elemento css o texto tachado
        })

    })

    context('exclusão', () => {
        it('deve excluir uma tarefa', () => {
            const task = {
                name: 'Realizar atividades',
                is_done: false
            }

            cy.removeTaskByName(task.name)
            cy.postTask(task)

            cy.visit('/')

            cy.contains('p', task.name)
                .parent()
                .find('button[class*=ItemDelete]') //encontrar botão que a classe contem * o texto 
                .click()

            cy.contains('p', task.name)
                .should('not.exist') //elemento não deve ser encontrado
        })

    })
})


/*
    USANDO FAKERJS PARA CRIAR DADOS FAKES
    OBS: Solução para ambientes onde não é possivel repetir massa
    CONTRAS: Possibilidade de poluir base conforme uso.

    import { faker } from '@faker-js/faker'

    cy.get('input[placeholder="Add a new Task"]')
        .type(faker.music.songName())
*/
