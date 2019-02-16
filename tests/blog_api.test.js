const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.remove({})
  const promiseArray = initialBlogs
    .map(blog => new Blog(blog).save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('returns correct number of blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(initialBlogs.length)
})

test('id field is defined', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('a new blog can be added', async () => {
  const newBlog = {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  }

  await api.post('/api/blogs').send(newBlog)

  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(initialBlogs.length + 1)
  expect(response.body.map(blog => blog.title)).toContain(newBlog.title)
})

test('likes are set to zero if not initially defined', async () => {
  const newBlog = {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    __v: 0
  }

  await api.post('/api/blogs').send(newBlog)

  const response = await api.get('/api/blogs')
  expect(response.body[initialBlogs.length].likes).toBe(0)
})

test('attempting to add a blog lacking title gives 400 bad request', async () => {
  const titlelessBlog = {
    _id: '5a422a851b54a676234d17f7',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(titlelessBlog)
    .expect(400)
})

test('attempting to add a blog lacking url gives 400 bad request', async () => {
  const urllessBlog = {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    likes: 7,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(urllessBlog)
    .expect(400)
})

test('blog can be deleted', async () => {
  const id = '5a422b3a1b54a676234d17f9'
  await api.delete(`/api/blogs/${id}`).expect(204)
  const responseToGet = await api.get('/api/blogs')
  expect(responseToGet.body.length).toBe(initialBlogs.length - 1)
})

test('blog can be updated', async () => {
  let updatedBlog = Object.assign({}, initialBlogs[0])
  updatedBlog.likes += 1
  const result = await api
    .put(`/api/blogs/${updatedBlog._id}`)
    .send(updatedBlog)
  expect(result.body.likes).toBe(updatedBlog.likes)
})

afterAll(() => {
  mongoose.connection.close()
})