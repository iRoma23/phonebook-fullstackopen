const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())

morgan.token('data', function (req, res) {
  return req.method === 'POST' ? JSON.stringify(req.body) : ""
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

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
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    return response.json(person)
  } else {
    return response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  const duplicateName = persons.some (person => person.name === body.name)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  } else if (duplicateName) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    id: generateId(5, 10000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})