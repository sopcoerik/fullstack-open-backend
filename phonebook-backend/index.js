require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
morgan.token('data', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.use(express.static('dist'))

const Person = require('./models/persons')

app.get('/api/persons', (req, res, next) => Person.find({}).then(persons => res.json(persons)).catch(error => next(error)))

app.get('/info', (req, res, next) => {
  const currentTime = new Date()

  Person.find({}).then(persons => (
    res.send(`
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${currentTime}</p>
            `))
  ).catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => Person.findById(req.params.id).then(person => res.json(person)).catch(error => next(error)))

app.delete('/api/persons/:id', (req, res, next) => Person.findByIdAndDelete(req.params.id).then(() => res.status(204).end()).catch(error => next(error)))

app.put('/api/persons/:id', (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body
  const person = new Person({ name, number })

  person.save().then(person => res.json(person)).catch(err => next(err))
})

const unknownEndpoint = (request, response) => response.status(404).send({ error: 'unkown endpoint' })

app.use(unknownEndpoint)

const errorHandling = (error, request, response, next) => {
  if(error.name === 'CastError') {
    response.status(400).send('<h1>400 | Bad request | malformatted id</h1>')
  } else if(error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
  } else {
    next(error)
  }
}

app.use(errorHandling)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`)
})