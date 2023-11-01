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

app.get('/api/persons', (req, res) => Person.find({}).then(persons => res.json(persons)))

app.get('/info', (req, res) => {
    const currentTime = new Date()

    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${currentTime}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => Person.findById(req.params.id).then(person => res.json(person)))

app.delete('/api/persons/:id', (req, res) => Person.findByIdAndDelete(req.params.id).then(() => res.status(204).end()))

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
    } else {
        const person = new Person({ name, number })
        person.save().then(person => res.json(person)).catch(err => console.log('error adding person', err.message))
    }
})

const unknownEndpoint = (request, response) => response.status(404).send({error: 'unkown endpoint'})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`)
})