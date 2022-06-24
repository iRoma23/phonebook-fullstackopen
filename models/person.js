const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB: ', error.message)
  })

const lengthValidation = number => {
  console.log(number)
  if (number.includes('-')) {
    if (number.length < 9) {
      return false
    } else {
      return true
    }
  }
  if (number.length < 8) {
      return false
    } else {
      return true
    } 
}

const regexValidation = number => /^[0-9]{2,3}-[0-9]+$/.test(number) || /^[0-9]{8,}$/.test(number)

const numberValidator = [
  {
    validator: lengthValidation,
    msg: 'Phone number must be least 8 digits'
  },
  {
    validator: regexValidation,
    msg: 'Incorrect format'
  }
]

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: numberValidator,
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)