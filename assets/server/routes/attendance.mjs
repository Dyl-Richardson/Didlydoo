import { Router } from 'express'

import { createAttendanceSchema } from '../schemas/attendance.mjs'
import { getDB, ERRORS, JoiOptions, remapData } from '../helpers.mjs'
import { isEmptyObj } from '../helpers.mjs'

const router = Router()
const db = await getDB()

router.post('/events/:_id/attend', async (req, res, next) => {
  const { _id } = req.params
  if(_id === undefined)
    return res.status(400).send({error: ERRORS.NO_ID})
    
  if(req.body === undefined || isEmptyObj(req.body)){
    console.log('ERROR\n')
    return res.status(400).send({error: ERRORS.NO_BODY})
  }
    
  const _elem = db.data.findIndex(f => f.id === _id)
  if(_elem === -1)
    return res.status(404).send({error: ERRORS.NOT_FOUND})
  
  const validation = createAttendanceSchema.validate(req.body, JoiOptions)
  if(validation.error){
    console.log('ERROR\n')
    return res.status(400).send(validation.error.details)
  }

  const attendee = {
    ...validation.value,
    dates: validation.value.dates.filter(date => db.data[_elem].dates.includes(date.date))
  }

  if(db.data[_elem].attendees.find(a => a.name === attendee.name))
    return res.status(400).send({error: `Attendee '${attendee.name}' already exists`})

  db.data[_elem].attendees.push(attendee)
  await db.write()

  return res.send(remapData(db.data[_elem]))
})

router.patch('/events/:_id/attend', async (req, res, next) => {
  const { _id } = req.params
  if(_id === undefined)
    return res.status(400).send({error: ERRORS.NO_ID})
    
  if(req.body === undefined || isEmptyObj(req.body)){
    console.log('ERROR\n')
    return res.status(400).send({error: ERRORS.NO_BODY})
  }
    
  const _elem = db.data.findIndex(f => f.id === _id)
  if(_elem === -1)
    return res.status(404).send({error: ERRORS.NOT_FOUND})
  
    
  const validation = createAttendanceSchema.validate(req.body, JoiOptions)
  if(validation.error){
    console.log('ERROR\n')
    return res.status(400).send(validation.error.details)
  }

  const _attendee = db.data[_elem].attendees.findIndex(a => a.name === validation.value.name)
  if(_attendee === -1)
    return res.status(404).send({error: `Attendee '${validation.value.name}' does not exist.`})

  const attendee = {
    ...validation.value,
    dates: validation.value.dates.filter(date => db.data[_elem].dates.includes(date.date))
  }

  db.data[_elem].attendees[_attendee] = attendee
  await db.write()

  return res.send(remapData(db.data[_elem]))
})

router.get('/attendees/:_name?', (req, res, next) => {  
  const ret = []

  for (const event of db.data) {
    for(const attendee of event.attendees){
      const _attendee = ret.findIndex(f => f.name === attendee.name)
      if(_attendee === -1){
        ret.push({
          name: attendee.name,
          events: [
            {
              id: event.id,
              dates: event.attendees.find(f => f.name === attendee.name).dates
            }
          ]
        })
      }
      else{
        ret[_attendee].events.push({
          id: event.id,
          dates: event.attendees.find(f => f.name === attendee.name).dates
        })
      }
    }
  }

  const { _name } = req.params

  if(_name !== undefined){
    const filteredRet = ret.find(f => f.name === _name)

    if(filteredRet === undefined)
      return res.status(404).send({error: `Attendee '${_name}' does not exist.`})
    
    return res.send(filteredRet)
  }
  
  return res.send(ret)
})


export default router