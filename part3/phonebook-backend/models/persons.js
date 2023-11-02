require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

console.log('connecting to MongoDB database')

mongoose.connect(url)
  .then(() => console.log('connected to MongoDB database'))
  .catch(err => console.log('error connecting to MongoDB database: ', err.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'Name required']
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (value) => {
        if((value[2] === '-' || value[3] === '-') && !value.includes(' ')) {
          return true
        } else {
          return false
        }
      },
      message: () => `Invalid phone number (eg.: 01-2345678, 012-3456789)`
    },
    required: [true, 'Phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)