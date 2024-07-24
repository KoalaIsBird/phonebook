require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const app = express()


app.use(express.static('dist'))
app.use(express.json())

morgan.token('data', (request, response) => {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


let data = [
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


app.get('/api/persons', (request, response) => {
    Person.find({}, { _id: 0, __v: 0 }).then(persons => {
        response.json(persons)
    })
})


app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${data.length} people <br>${Date()}</p>`)
})


app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const note = data.find(note => note.id === id)

    if (note) {
        return response.json(note)
    }

    response.status(404).end()
})


app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const note = data.find(note => note.id === id)

    if (note) {
        data = data.filter(note => note.id !== id)
        return response.status(204).end()
    }

    response.status(404).end()
})


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number is missing' })
    }

    Person.find({name: body.name}).then(personsWithSameName => {
        if (personsWithSameName.length !== 0) {
            return response.status(400).json({ error: 'name is already in the phonebook' })
        }

        const person = new Person({
            name: body.name,
            number: body.number
        })

        person.save().then(savedPerson => {
            response.json(savedPerson)
        })
    })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log("Server runs on port", PORT)
})