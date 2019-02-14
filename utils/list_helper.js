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

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}