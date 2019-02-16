const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs
    .map(blog => blog.likes)
    .reduce((x, y) => x + y, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  } else {
    const sorted = blogs.sort((a, b) => b.likes - a.likes)
    const favourite = sorted[0]
    return {
      title: favourite.title,
      author: favourite.author,
      likes: favourite.likes
    }
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  const counts = _.countBy(blogs, blog => blog.author)
  const mostProlific = Object.entries(counts).sort((e1, e2) => e2[1] - e1[1])[0]
  return {
    author: mostProlific[0],
    blogs: mostProlific[1],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  const likes = {}
  blogs.forEach(blog => {
    if (likes.hasOwnProperty(blog.author)) {
      likes[blog.author] += blog.likes
    } else {
      likes[blog.author] = blog.likes
    }
  })
  const mostLiked = _.chain(likes)
    .toPairs()
    .orderBy(p => p[1], 'desc')
    .head()
    .value()
  return {author: mostLiked[0], likes: mostLiked[1]}
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}