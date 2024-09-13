import { create, remove, read, update } from "../services/services.js";

const readTask = async (req, res) => {
    try {
        const { rows } = await read()
        return res.status(200).json(rows)
    } catch (error) {
        return res.status(500).json({ Message: `Erro interno: ${error.message}` })
    }
}

const createTask = async (req, res) => {
    const { nome } = req.body

    try {
        await create(nome)
        return res.status(201).json({ Message: "Task cadastrada com sucesso." })
    } catch (error) {
        return res.status(500).json({ Message: `Erro interno: ${error.message}` })
    }

}

const updateTask = async (req, res) => {
    const { 
        params: { id }, 
        body: { nome, status } 
    } = req

    try {
        await update(nome, status, id)
        return res.status(200).json({ Message: "Dados atualizados com sucesso." })
    } catch (error) {
        return res.status(500).json({ Message: `Erro interno: ${error.message}` })
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.params
    try {
        await remove(id)
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ Message: `Erro interno: ${error.message}` })
    }
}

export default { createTask, deleteTask, readTask, updateTask }