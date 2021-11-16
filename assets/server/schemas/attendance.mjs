import Joi from 'joi'

export const createAttendanceSchema = Joi.object({
    name: Joi.string().required(),
    dates: Joi.array().items(
      Joi.object({
        date: Joi.string().isoDate().required(),
        available: Joi.boolean().required()
      })
    ).required()
})