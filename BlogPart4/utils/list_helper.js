const dummy = (blogs) => {
  return 1;
};

const sumLikes = (blogs) => {
  return blogs.reduce((total, obj) => obj.likes + total, 0);
};

module.exports = {
  dummy,
  sumLikes,
};
