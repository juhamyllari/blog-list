const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    name: 'Taavi Mäki',
    username: 'pmaki',
    password: 'salainen123'  
  },
  {
    name: 'Reetta Hippulainen',
    username: 'huskiesarecool',
    password: 'wanchankawaii'
  }
]

beforeEach(async () => {
  await User.remove({})
  const promiseArray = initialUsers
    .map(user => api.post('/api/users').send(user))
  await Promise.all(promiseArray)
})

test('get returns json', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('creating a user with too short a password fails', async () => {
  const failingUser = {
    name: 'Timo Mäkelä',
    username: 'tmäkelä',
    password: 'ly'
  }
  await api
    .post('/api/users')
    .send(failingUser)
    .expect(400)
    .expect({error: 'password missing or too short'})
  const responseToGet = await api.get('/api/users')
  expect(responseToGet.body.length).toBe(initialUsers.length)
})

afterAll(() => {
  mongoose.connection.close()
})