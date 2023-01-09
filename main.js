window.addEventListener('load', () => {   // após carregar a página, converte JSON em Objetos
    todos = JSON.parse(localStorage.getItem('todos')) || []; //pega todos os dados salvos no localStorage 
    const nameInput = document.querySelector('#name'); // guarda o username preenchido
    const newTodoForm = document.querySelector('#new-todo-form'); // guarda o form inteiro que foi preenchido

    const username = localStorage.getItem('username') || '';

    nameInput.value = username;

    nameInput.addEventListener('change', e => {  //quando o usuário preencher o nome, vai ser atualizado no localstorage
        localStorage.setItem('username', e.target.value);
    })

    newTodoForm.addEventListener('submit', e => { // quando o usuário adicionar uma nova tarefa, ela será armazenada como objeto no localstorage
        e.preventDefault(); // não entendi pra que serve isso.

        const todo = {
            content: e.target.elements.content.value, //target é o elemento que recebeu o click
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime() //depois desenvolver forma de visualizar a lista em ordem cronológica
        }

        todos.push(todo); // sobe nova tarefa para variável global todos

        localStorage.setItem('todos', JSON.stringify(todos)); // converte o array para JSON

        e.target.reset(); //limpa o forms para poder preencher novas tarefas

        DisplayTodos()

    })

    DisplayTodos()
})

function DisplayTodos () {  // função para apresentar a lista de tarefas no documento
    const todoList = document.querySelector('#todo-list');

    todoList.innerHTML = '';

    todos.forEach(todo => { //laço para criar estrutura visível para cada nova tarefa adicionada ao documento
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item')

        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const actions = document.createElement('div');
        const edit = document.createElement('button');
        const deleteButton = document.createElement('button');

        input.type = 'checkbox'; // permite selecionar ou não
        input.checked = todo.done; // equivale a tarefa ter sido concluida ou não 
        span.classList.add('bubble'); // adiciona a classe bubble (personal ou business) 

        if (todo.category == 'personal') { // define se a tarefa será pessoal ou profissional e consequentemente a cor e estilo
            span.classList.add('personal');
        } else {
            span.classList.add('business');
        }

        //adiciona as classes para estilo:
        content.classList.add('todo-content');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        //torna a tarefa e os botões de edição e delete visíveis no documento
        content.innerHTML = `<input type ="text" value =" ${todo.content}" readonly>`;
        edit.innerHTML = 'Edit';
        deleteButton.innerHTML = 'Delete';

        //adiciona os elementos criados na última posição do elemento pai
        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);

        todoList.appendChild(todoItem);

        //Seção para marcar tarefas como concluídas (riscar) e atualizar no local Storage
        if(todo.done) {
            todoItem.classList.add('done'); //add a classe done
        }

        input.addEventListener('click', e => { //cria evento para marcar como check se a tarefa for clicada, concluída
            todo.done = e.target.checked;
            localStorage.setItem('todos', JSON.stringify(todos)); //atualiza no local storage

            if(todo.done) {
                todoItem.classList.add('done');
            } else {
                todoItem.classList.remove('done');
            }

            DisplayTodos();
        })

        //Seção para editar tarefas
        edit.addEventListener('click', e => {
            const input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus()
            input.addEventListener('blur', e => {
                input.setAttribute('readonly', true);
                todo.content= e.target.value;
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            })
        })

        //Seção para deletar tarefas
        deleteButton.addEventListener('click', e => {
            todos = todos.filter(t => t != todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos();
        })

    });
}