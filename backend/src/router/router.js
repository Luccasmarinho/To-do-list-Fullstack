import express from "express";
const rotas = express.Router();
import controller from "../controllers/controller.js";
import { validateBody } from "../middleware/validateBody.js"; 
import schema from "../schemas/schema.js"

rotas.get(
    "/readTask",
    controller.readTask
)

rotas.post(
    "/createTask",
    validateBody(schema.create),
    controller.createTask
)

rotas.put(
    "/updateTask/:id",
    validateBody(schema.update),
    controller.updateTask
)

rotas.delete(
    "/deleteTask/:id",
    controller.deleteTask
)

export default rotas