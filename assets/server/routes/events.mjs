import { Router } from 'express'

import { createEventSchema, patchEventSchema, addDateSchema } from '../schemas/events.mjs'
import { getDB, initEvent, patchEvent, stripTime, remapData } from '../helpers/functions.mjs'
import * as mw from '../helpers/middlewares.mjs'

const router = Router()

router.route('/events/:_id?')
.get(async (req, res, next) => {
  const db = await getDB()
  const { _id } = req.params
  const data = db.data || []
  const dataMapped = data.map(remapData)
  
  if(_id === undefined)
    return res.send(dataMapped)
  
  return res.send(dataMapped.find(x => x.id === _id))
})
.post(mw.validation(createEventSchema), async (req, res, next) => {
  const db = await getDB()
  const newEvent = await initEvent(req.body.name, req.body.author, req.body.description, req.body.dates)

  db.data.unshift(newEvent)
  await db.write()

  return res.send(newEvent)
})
.patch(mw.noBody, mw.idSpecific, mw.validation(patchEventSchema), mw.getElem, async (req, res, next) => {
  const db = await getDB()
  const elem = { ... db.data[req._elem]} 

  const newEvent = patchEvent(elem, req.body)
  db.data[req._elem] = newEvent
  await db.write()

  return res.send(remapData(newEvent))
})
.delete(mw.idSpecific, mw.getElem, async (req, res, next) => {
  const db = await getDB()
  db.data = db.data.filter(el => el.id !== req.params._id)
  await db.write()

  return res.send({message: 'Delete sucessful'})
})

router.post('/events/:_id/add_dates', mw.noBody, mw.idSpecific, mw.validation(addDateSchema), mw.getElem, async (req, res, next) => {
  const db = await getDB()
  req.body.dates.forEach(date => {
    const _date = stripTime(date)
    if(!db.data[req._elem].dates.includes(_date))
      db.data[req._elem].dates.push(_date)
  })

  await db.write()

  return res.send(remapData(db.data[req._elem]))
})

export default router