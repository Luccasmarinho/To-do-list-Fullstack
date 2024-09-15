const form = document.querySelector(".container-todo__form");
const formModal = document.querySelector(".modal__form");
const inputText = document.querySelector(".container-todo__input-text");
const inputTextModal = document.querySelector(".modal__input-text");
const secaoTarefas = document.querySelector(".secao-tarefas");
const modal = document.querySelector(".modal-overlay");

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

async function deletarTask(id) {
    try {
        const conexao = await fetch(`http://localhost:3000/deleteTask/${id}`, {
            method: "DELETE",
        })

        if (!conexao.ok) {
            throw new Error("Não foi deletar a task.")
        }

        const conexaoConvertida = await conexao.json().catch(() => null);

        return conexaoConvertida || { mensagem: "Task deletada com sucesso." };
    } catch (error) {
        console.error(error)
        return { erro: "Ocorreu um erro ao tentar deletar a task." };
    }
}


async function atualizarTask(dados, id) {

    try {
        const busca = await fetch(`http://localhost:3000/updateTask/${id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(dados)
        })

        if (!busca.ok) {
            throw new Error("Não foi atualizar a task.")
        }

        const conexaoConvertida = await busca.json()

        return conexaoConvertida
    } catch (error) {
        console.error(error)
        return { erro: "Ocorreu um erro ao tentar atualizar a task." };
    }

}

async function mostrarTasks() {
    const busca = await lerTasks()
    busca.forEach(async (task) => {
        criarElementos(task)
    })


}

mostrarTasks()

form.addEventListener("submit", async (event) => {
    event.preventDefault()

    await criarTask(inputText.value)

    const buscaTasks = await lerTasks()
    const elementoTask = buscaTasks[buscaTasks.length - 1]

    criarElementos(elementoTask)

});

function formatarData(data) {
    const dataDaCriacao = new Date(data)
    const dataFormatada = dataDaCriacao.toLocaleString()
    return dataFormatada
}

function ValorInputModal(numeroId) {
    formModal.addEventListener("submit", async (event) => {
        event.preventDefault()
        const valor = inputTextModal.value;

        const atualizacao = {
            nome: valor,
            status: "sei la"
        }

        await atualizarTask(atualizacao, numeroId)
        modal.style.display = "none"
        window.location.reload()

        console.log(valor)

    })
}


async function criarElementos(elementoTask) {
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
                <tr id="${elementoTask.id}" class="elemento-tr">
                    <td id="nome-tarefa">${elementoTask.nome}</td>
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

    const btnRemove = document.querySelectorAll(".btn-remove");
    const arrayTabela = document.querySelectorAll(".secao-tarefas__tabela");
    const arrayId = document.querySelectorAll(".elemento-tr");

    btnRemove.forEach((btn, i) => {
        btn.addEventListener("click", async () => {
            arrayTabela[i].remove()

            const numeroId = arrayId[i].getAttribute("id")

            await deletarTask(numeroId)
        })
    })

    const btnAtualiza = document.querySelectorAll(".btn-edit");

    btnAtualiza.forEach((btn, i) => {
        btn.addEventListener("click", async () => {
            modal.style.display = "block"

            const numeroId = arrayId[i].getAttribute("id")
            ValorInputModal(numeroId)

            // const dadosParaAtualizar = {
            //     nome: editTask,
            //     status: "Em andamento"
            // }

            // await atualizarTask(dadosParaAtualizar, numeroId)

           
        })
    })


    return tabela
}

document.querySelector(".modal__btn-sair").addEventListener("click", () => {
    modal.style.display = "none"
    window.location.reload()
})




// arrayTabela[i].lastElementChild.innerHTML = ` 
// <tbody>

// <tr id="${elementoTask.id}" class="elemento-tr">
//         <td id="nome-tarefa">${elementoTask.nome}</td>
//         <td>${formatarData(elementoTask.data_criacao)}</td>
//         <td>
//             <select name="select" class="select-status">
//                 <option value="pendente" selected>${elementoTask.status}</option>
//                 <option value="andamento">Em andamento</option>
//                 <option value="concluido">Concluído</option>
//             </select>
//         </td>
//         <td>
//             <button class="btn-acoes btn-edit">
//                 <i class="fa-solid fa-pen-to-square"></i>
//             </button>

//             <button class="btn-acoes btn-remove">
//                 <i class="fa-solid fa-trash"></i>   
//             </button>
//         </td>
//     </tr>
// </tbody>
// `