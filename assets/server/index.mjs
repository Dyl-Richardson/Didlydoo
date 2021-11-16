import express from 'express'
import cors from 'cors'

import eventsRoute from './routes/events.mjs'
import attendanceRoute from './routes/attendance.mjs'

const PORT = 3000
const app = express()
const _BOOT_TIME = new Date()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method.toUpperCase()} ${req.url}`)
  next()
})

app.get('/', (req, res, next) => res.send({
  info: `Server started @${_BOOT_TIME.toLocaleTimeString()}`
}))

app.use('/api', eventsRoute)
app.use('/api', attendanceRoute)

app.listen(PORT, () => console.log(`Server started: http://localhost:${PORT}/`))