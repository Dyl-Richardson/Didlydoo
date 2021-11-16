import { Router } from 'express'

import { ERRORS, getDB, initEvent, patchEvent, stripTime, JoiOptions, remapData, isEmptyObj } from '../helpers.mjs'
import { createEventSchema, patchEventSchema, addDateSchema } from '../schemas/events.mjs'

const router = Router()

const db = await getDB()

router.route('/events/:_id?')
.get(async (req, res, next) => {
  const { _id } = req.params
  const data = db.data || []

  const dataMapped = data.map(remapData)
  
  if(_id === undefined)
    return res.send(dataMapped)
  
  return res.send(dataMapped.find(x => x.id === _id))
})
.post(async (req, res, next) => {
  const validation = createEventSchema.validate(req.body, JoiOptions)

  if(validation.error){
    console.log('ERROR\n')
    return res.status(400).send(validation.error.details)
  }

  const newEvent = await initEvent(req.body.name, req.body.author, req.body.description, req.body.dates)
  db.data.unshift(newEvent)
  await db.write()

  return res.send(newEvent)
})
.patch(async (req, res, next) => {
  const { _id } = req.params
  if(_id === undefined)
    return res.status(400).send({error: ERRORS.NO_ID})
  
  const _elem = db.data.findIndex(x => x.id === _id)
  if(_elem === -1)
    return res.status(404).send({error: ERRORS.NOT_FOUND})
  
  const elem = { ... db.data[_elem]}  
  const validation = patchEventSchema.validate(req.body, JoiOptions)

  if(validation.error){
    console.log('ERROR\n')
    return res.status(400).send(validation.error.details)
  }

  const newEvent = patchEvent(elem, validation.value)
  db.data[_elem] = newEvent
  await db.write()

  return res.send(remapData(newEvent))
})
.delete(async (req, res, next) => {
  const { _id } = req.params
  if(_id === undefined)
    return res.status(400).send({error: ERRORS.NO_ID})
  
  const _elem = db.data.findIndex(x => x.id === _id)
  if(_elem === -1)
    return res.status(404).send({error: ERRORS.NOT_FOUND})
  
  db.data = db.data.filter(el => el.id !== _id)
  await db.write()

  return res.send({message: 'Delete sucessful'})
})

router.post('/events/:_id/add_dates', async (req, res, next) => {
  const { _id } = req.params
  if(_id === undefined)
    return res.status(400).send({error: ERRORS.NO_ID})
  
  
  const _elem = db.data.findIndex(x => x.id === _id)
  if(_elem === -1)
    return res.status(404).send({error: ERRORS.NOT_FOUND})

  if(req.body === undefined || isEmptyObj(req.body)){
    console.log('ERROR\n')
    return res.status(400).send({error: ERRORS.NO_BODY})
  }
  
  const validation = addDateSchema.validate(req.body, JoiOptions)
  if(validation.error){
    console.log('ERROR\n')
    return res.status(400).send(validation.error.details)
  }

  req.body.dates.forEach(date => {
    const _date = stripTime(date)
    if(!db.data[_elem].dates.includes(_date))
      db.data[_elem].dates.push(_date)
  })

  await db.write()

  return res.send(remapData(db.data[_elem]))
})

export default router