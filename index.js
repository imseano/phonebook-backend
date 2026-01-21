const express = require('express')
const app = express()

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
]

app.use(express.json())

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    if (!person) {
        res.status(404).end()
    } else {
        res.json(person)
    }
})

app.get('/info', (req, res) => {
    const date = new Date()
    const statement = `<p>Phonebook has info for ${persons.length} people</p>`
    const dateStatement = `<p>${date}</p>`
    res.send('<div>' + statement + dateStatement + '</div>')
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    if (!persons.find(person => person.id === id)) {
        return res.status(404).end()
    }
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
    let id = Math.floor(Math.random() * 1000)
    while (persons.find(person => person.id === id.toString())) {
        id = Math.floor(Math.random() * 1000)
    }
    return id.toString()
}

app.post('/api/persons', (req, res) => {
    const person = req.body
    console.log(person)
    if (!person.name || !person.number) {
        return res.status(400).json({
            error: 'name or number is missing'
        })
    }

    if (persons.find(p => p.name === person.name)) {
        res.statusMessage = "Name must be unique"
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const newPerson = {
        id: generateId(),
        ...person
    }
    persons = persons.concat(newPerson)
    console.log(newPerson)
    res.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server runnning on port ${PORT}`)
})