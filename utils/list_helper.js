const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs
    .map(blog => blog.likes)
    .reduce((x, y) => x + y, 0)
}

module.exports = {
  dummy,
  totalLikes
}