const Joi = require('joi');

const authSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().min(6).required(),
});

module.exports = { authSchema };
