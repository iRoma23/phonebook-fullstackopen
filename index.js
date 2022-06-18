require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const Person = require('./models/person')

app.use(cors())

app.use(express.json())

app.use(express.static('build'))

morgan.token('data', function (req, res) {
  return req.method === 'POST' ? JSON.stringify(req.body) : ""
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const generateId = (min, max) => {
  return Math.ceil(Math.random() * ((max - min) + min))
}

app.get('/', (request, response) => {
  response.send('<h1>Hello!<h1>')
})

app.get('/info', (request, response) => {
  const date = new Date()
  const info = `
    Phonebook has info for ${persons.length} people
    <br>
    <br>
    ${date}
    `
  response.send(info)
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if ((body.name || body.number) === undefined) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })

  // const body = request.body

  // const duplicateName = persons.some (person => person.name === body.name)

  // if (!body.name || !body.number) {
  //   return response.status(400).json({ 
  //     error: 'name or number missing' 
  //   })
  // } else if (duplicateName) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  // const newPerson = {
  //   id: generateId(5, 10000),
  //   name: body.name,
  //   number: body.number
  // }

  // persons = persons.concat(newPerson)

  // response.json(newPerson)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
  // const id = Number(request.params.id)
  // persons = persons.filter(person => person.id !== id)

  // response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})