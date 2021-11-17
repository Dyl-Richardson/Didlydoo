import { ERRORS, JoiOptions } from './constants.mjs'
import { isEmptyObj, getDB } from './functions.mjs'

export const idSpecific = (req, res, next) => {
  const { _id } = req.params

  if(_id === undefined)
    return res.status(400).send({error: ERRORS.NO_ID})

  return next()
}

export const noBody = (req, res, next) => {
  if(req.body === undefined || isEmptyObj(req.body)){
    console.log('ERROR\n')
    return res.status(400).send({error: ERRORS.NO_BODY})
  }

  return next()
}

export const validation = schema => (req, res, next) => {
  const validation = schema.validate(req.body, JoiOptions)

  if(validation.error)
    return res.status(400).send(validation.error.details)
  
  return next()
}

export const getElem = async (req, res, next) => {
  const db = await getDB()
  const _elem = db.data.findIndex(x => x.id === req.params._id)

  if(_elem === -1)
    return res.status(404).send({error: ERRORS.NOT_FOUND})

  req._elem = _elem
  return next()
}