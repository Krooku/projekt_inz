const mongoose = require('mongoose')

const mongoUri = process.argv[2]

const oldTodoPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  todos: [String]
}, {
  versionKey: false,
  strict: false
})

const oldTodoPackage = mongoose.model('TodoPackage', oldTodoPackageSchema)

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(async () => {
  const packs = await oldTodoPackage.find().exec()
  packs.forEach(async pack => {
    pack.todos.forEach((name, index, array) => {
      array[index] = {
        name,
        priority: 0
      }
    })

    pack.markModified('todos')
    console.log(await pack.save())
  })
})
