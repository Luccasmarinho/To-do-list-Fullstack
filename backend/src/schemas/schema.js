import Joi from "joi";

const schema = {
    create: Joi.object({
        nome: Joi.string().required()
    }),
    update: Joi.object({
        nome: Joi.string().required(),
        status: Joi.string()
    })
}

export default schema