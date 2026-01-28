require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

/*
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]*/

const Person = require('./models/person')

morgan.token('body', req => {
    console.log(req.body)
    return JSON.stringify(req.body)})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(cors())

app.use(express.static('dist'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    
    Person.findById(id)
        .then(person => {
            if (!person) {
                return res.status(404).end()
            }
            res.json(person)
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    const date = new Date()
    Person.countDocuments({}).then(persons => {
        const statement = `<p>Phonebook has info for ${persons} people</p>`
        const dateStatement = `<p>${date}</p>`
        res.send('<div>' + statement + dateStatement + '</div>')
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndDelete(id)
        .then(result => {
           return res.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const { name, number } = req.body
    if (!name || !number) {
        return res.status(400).json({
            error: 'name or number is missing'
        })
    }

    Person.findById(id)
        .then(person => {
            if (!person) {
                return res.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then(updatedPerson => {
                res.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number is missing'
        })
    }
/** 
    if (persons.find(p => p.name === person.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
        */
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    newPerson.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
    console.log(err.message)
    if (err.name === "CastError") {
        return res.status(400).send({ error: 'malformatted id'})
    }

    next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server runnning on port ${PORT}`)
})