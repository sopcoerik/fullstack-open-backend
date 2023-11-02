const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('password required')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3] || ''
const number = process.argv[4] || null

const url = `mongodb+srv://sopcoerik-courseDb:${password}@cluster0.ljtlfbr.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String || null
})

const Person = mongoose.model('Person', personSchema)

if(!name && !number) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(res => {
      console.log(`${res.name} ${res.number}`)
    })
    mongoose.connection.close()
  })
} else {
  let person = new Person({ name, number })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

