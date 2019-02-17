const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    if (body.password === undefined || body.password.length < 3) {
      return response.status(400).json({error: 'password missing or too short'})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users.map(user => user.toJSON()))
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter