const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('data', req => JSON.stringify(req.body))

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

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const currentTime = new Date()

    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${currentTime}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    !person ? res.status(404).send('<h1>No person found!</h1>') : res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

const generateId = () => Math.floor((Math.random() * 999999) + 1)

app.post('/api/persons', (req, res) => {
    const {name, number} = req.body
    
    if(!name) {
        return res.status(400).json({
            error: '400 Bad Request | Name is required'
        })
    } else if(!number) {
        return res.status(400).json({
            error: '400 Bad Request | Phone Number is required'
        })
    } else if(persons.some(p => p.name === name)) {
        return res.status(400).json({
            error: '400 Bad Request | Name must be unique'
        })
    }

    const person = {id: generateId(), name, number}

    persons = persons.concat(person)

    res.json(person)
})

const unknownEndpoint = (request, response) => response.status(404).send({error: 'unkown endpoint'})

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`)
})