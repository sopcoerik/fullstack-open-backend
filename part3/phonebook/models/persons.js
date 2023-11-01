require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

console.log('connecting to MongoDB database')

mongoose.connect(url)
    .then(res => console.log('connected to MongoDB database'))
    .catch(err => console.log('error connecting to MongoDB database: ', err.message))

const personSchema = new mongoose.Schema({
    name: String,
    number: String || null
})

personSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)