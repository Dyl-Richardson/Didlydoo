import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { customAlphabet } from 'nanoid/async'
import { Low, JSONFile } from 'lowdb'

const nanoid = customAlphabet('1234567890abcdef', 12)

export const remapData = d => {
    const _d = { ... d}
    _d.dates = _d.dates
              .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
              .map(date => ({
                date, 
                attendees: _d.attendees.map(attendee => {
                  let available = attendee.dates.find(f => f.date === date)
                  if(available === undefined){
                    return {
                      name: attendee.name,
                      available: null
                    }
                  }

                  return {
                    name: attendee.name,
                    available: available.available
                  }
                })
              }))

    delete _d.attendees 

    return _d
}

export const stripTime = d => d.split('T')[0]

export const isEmptyObj = obj => Object.keys(obj).length === 0

export const initEvent = async (name, author, description, dates) => {
  const created_at = new Date().toISOString()
  const id = await nanoid()

  return {
    id,
    name,
    author,
    description,
    dates: dates.map(stripTime),
    created_at,
    num_modification: 0,
    last_modification: created_at,
    attendees: []
  }
}

export const patchEvent = (event, patch) => {
  return {
    ...event,
    ...patch,
    num_modification: event.num_modification + 1,
    last_modification: new Date().toISOString()
  }
}


export const getDB = async () => {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const adapter = new JSONFile(join(__dirname, '../db/db.json'))
  const db = new Low(adapter)

  await db.read()
  return db
}