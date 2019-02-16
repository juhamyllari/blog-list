const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const _ = require('lodash')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const blog = new Blog(request.body)
    await blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const fieldsToUpdate = _.omit(request.body, ['_id'])
    const result = await Blog.findByIdAndUpdate(request.params.id, fieldsToUpdate, {new: true})
    response.json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter