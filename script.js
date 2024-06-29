const httpClient = {
    baseUrl: 'http://localhost:3000', endpointFormatter(endpoint) {
        if (!endpoint.startsWith('/')) {
            endpoint = `${endpoint}`
        }
        return endpoint;
    },

    async get(endpoint, queries) {
        endpoint = this.endpointFormatter(endpoint);
        if (queries) {
            const queryString = new URLSearchParams(queries).toString();
            endpoint = `${endpoint}?${queryString}`;
        }
        return fetch(`${this.baseUrl}${endpoint}`).then(
            async (response) => await response.json()
        );
    },
};

window.addEventListener('DOMContentLoaded', () => {
    const btnPrevious = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const spanCurrentPage = document.getElementById('current-page')

    let currentPage = 1;
    let totalPages = 0;
    let todos = [];

    function updateButtons() {
        btnPrevious.disabled = currentPage === 1;
        btnNext.disabled = currentPage === totalPages;
    }

    async function updatePage (page) {
        const data = await httpClient.get('/todos', {page});
        totalPages = data.totalPages;
        currentPage = data.currentPage;
        updateButtons();
        todos = data.todos;
        renderTodos();
    }

    function renderTodos() {
        const ul = document.getElementById('list-todo')
        ul.innerHTML = '';
    
        todos.forEach((todo) => {
            const li = document.createElement('li');
            li.classList.add('card');
            if (todo.done) li.classList.add('done');
        
            const h3 = document.createElement('h3');
            h3.textContent = todo.name;
            const p = document.createElement('p');
            p.textContent = todo.description;
            const divDone = document.createElement('div');
            divDone.classList.add('card-checkbox');
            const textDone = document.createElement('span');
            textDone.textContent = todo.done ? 'Feito' : 'Pendente';
            const inputDone = document.createElement('input');
            inputDone.type = 'checkbox';
            inputDone.checked = todo.done;
            inputDone.classList.add('checkbox');
            inputDone.addEventListener('change', () => {
            todo.done = inputDone.checked;
            li.classList.toggle('done');
            textDone.textContent = todo.done ? 'Feito' : 'Pendente';
            });
        
            divDone.appendChild(textDone);
            divDone.appendChild(inputDone);
        
            li.appendChild(h3);
            li.appendChild(p);
            li.appendChild(divDone);
            ul.appendChild(li);
        });
    }

        btnPrevious.addEventListener('click', () => {
            updatePage(currentPage - 1);
        });

        btnNext.addEventListener('click', () => {
            updatePage(currentPage + 1);
        });

        httpClient.get('/todos').then((data) => {
            todos = data.todos;
            currentPage = data.currentPage;
            totalPages = data.totalPages;
            renderTodos();
            updateButtons();
        });
    
})