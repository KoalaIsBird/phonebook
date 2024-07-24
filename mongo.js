if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log('usage: node mongo.js password name number\nIgnore name and number to get all people')
    process.exit(1)
}


const mongoose = require('mongoose')


const password = process.argv[2]
const url =
    `mongodb+srv://fullstack:${password}@cluster0.sev9rib.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}

