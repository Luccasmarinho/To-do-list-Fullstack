import validarCampo from "./validacao.js";

const form = document.querySelector(".container-todo__form");
const formModal = document.querySelector(".modal__form");
const inputText = document.querySelector(".container-todo__input-text");
const inputTextModal = document.querySelector(".modal__input-text");
const secaoTarefas = document.querySelector(".secao-tarefas");
const modal = document.querySelector(".modal-overlay");
const inputRadio = document.querySelectorAll("[type=radio]");

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

    validarCampo(inputText.value)

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
                        ${elementoTask.status || "Pendente"}
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

    //REMOVE TASK
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

    //ATUALIZA TASK
    const btnAtualiza = document.querySelectorAll(".btn-edit");
    const nomeTarefa = document.querySelectorAll("#nome-tarefa");

    btnAtualiza.forEach((btn, i) => {
        btn.addEventListener("click", async () => {
            modal.style.display = "block"
            inputTextModal.value = `${nomeTarefa[i].textContent}`

            const numeroId = arrayId[i].getAttribute("id")

            let guardaValorInputRadio = []

            inputRadio.forEach((radio) => {
                radio.addEventListener("change", async (e) => {
                    const valorRadio = e.target.value
                    guardaValorInputRadio.push(valorRadio)
                })
            })

            formModal.addEventListener("submit", async (event) => {
                event.preventDefault()
                const valorInputModal = inputTextModal.value;
                const valorInputRadio = guardaValorInputRadio[guardaValorInputRadio.length - 1]

                const atualizacao = {
                    nome: valorInputModal,
                    status: valorInputRadio
                }

                await atualizarTask(atualizacao, numeroId)
                modal.style.display = "none"
                window.location.reload()
            })
        })
    })

    return tabela
}

document.querySelector(".modal__btn-sair").addEventListener("click", () => {
    modal.style.display = "none"
    window.location.reload()
})