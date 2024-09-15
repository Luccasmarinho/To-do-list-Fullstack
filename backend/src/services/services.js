import { pool } from "../config/connectionDB.js";

export const create = async (nome) => {
    const query = "INSERT INTO tasks (nome) VALUES ($1)"
    const params = [nome]
    const createTask = await pool.query(query, params)
    return createTask
}

export const remove = async (id) => {
    const query = "DELETE FROM tasks WHERE id = $1"
    const params = [id]
    const deleteTask = await pool.query(query, params)
    return deleteTask
}

export const read = async () => {
    const query = "SELECT * FROM tasks ORDER BY id ASC"
    const readTask = await pool.query(query)
    return readTask
}

export const update = async (nome, status, id) => {
    const query = "UPDATE tasks SET nome = $1, status = $2  WHERE id = $3"
    const params = [nome, status, id]
    const updateTask = await pool.query(query, params)
    return updateTask
}
