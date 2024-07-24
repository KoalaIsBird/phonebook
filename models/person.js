const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

//personSchema.set('toJSON', ())

module.exports = Person