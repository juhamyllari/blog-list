const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const _ = require('lodash')
const jwt = require('jsonwebtoken')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7)
//   }
//   return null
// }

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blogData = request.body 
    const user = await User.findById(decodedToken.id)
    blogData.user = user._id
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(400).json({ error: 'blog not found' })
    }
    const blogUserId = blog.user.toString()
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id || decodedToken.id !== blogUserId) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
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