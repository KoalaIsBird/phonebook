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
    response.json(data)
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
        return response.status(400).json({error: 'name or number is missing'})
    }
    
    if (data.find(note => note.name === body.name)) {
        return response.status(400).json({error: 'name is already in the phonebook'})
    }
    
    const note = {
        id: String(Math.floor(Math.random() * 100000000)),
        name: body.name,
        number: body.number
    }
    
    data.push(note)
    response.json(note)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log("Server runs on port", PORT)
})