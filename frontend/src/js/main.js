const form = document.querySelector(".container-todo__form");
const inputText = document.querySelector(".container-todo__input-text");
const secaoTarefas = document.querySelector(".secao-tarefas");

async function criarTask(nome) {
    const conexao = await fetch("http://localhost:3000/createTask", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            nome: nome
        })
    })

    if (!conexao.ok) {
        throw new Error("Não foi cadastrar a nova task.")
    }

    const conexaoConvertida = await conexao.json()

    return conexaoConvertida
}

async function lerTasks() {
    const busca = await fetch("http://localhost:3000/readTask")
    const buscaCompleta = await busca.json()

    return buscaCompleta
}

async function mostrarTasks() {
    const busca = await lerTasks()
    busca.forEach(async (task) => {
        criarTasks(task)
    })


}

mostrarTasks()

form.addEventListener("submit", async (event) => {
    event.preventDefault()

    await criarTask(inputText.value)

    const buscaTasks = await lerTasks()
    const elementoTask = buscaTasks[buscaTasks.length - 1]

    criarTasks(elementoTask)

});

function formatarData(data) {
    const dataDaCriacao = new Date(data)
    const dataFormatada = dataDaCriacao.toLocaleString()
    return dataFormatada
}

function criarTasks(elementoTask) {
    const tabela = document.createElement("table");
    tabela.setAttribute("border", "1")
    tabela.classList.add("secao-tarefas__tabela");
    secaoTarefas.appendChild(tabela);

    tabela.innerHTML = `
            <thead>
                <tr>
                    <th>Tarefa</th>
                    <th>Data da criação</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>${elementoTask.nome}</td>
                    <td>${formatarData(elementoTask.data_criacao)}</td>
                    <td>
                        <select name="select" class="select-status">
                            <option value="pendente" selected>${elementoTask.status}</option>
                            <option value="andamento">Em andamento</option>
                            <option value="concluido">Concluído</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn-acoes btn-edit">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>

                        <button class="btn-acoes btn-remove">
                            <i class="fa-solid fa-trash"></i>   
                        </button>
                    </td>
                </tr>
            </tbody>
        `

    return tabela
}