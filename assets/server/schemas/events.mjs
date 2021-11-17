import Joi from 'joi'

export const createEventSchema = Joi.object({
  name: Joi.string().required(),
  author: Joi.string().required(),
  description: Joi.string().required(),
  dates: Joi.array().items(
    Joi.string().isoDate()
  ).required()
})

export const patchEventSchema = Joi.object({
  name: Joi.string().optional(),
  author: Joi.string().optional(),
  description: Joi.string().optional(),
})

export const addDateSchema = Joi.object({
  dates: Joi.array().items(
    Joi.string().isoDate()
  ).required()
}).required()