const dummy = (blogs) => {
  return 1;
};

const sumLikes = (blogs) => {
  return blogs.reduce((total, obj) => obj.likes + total, 0);
};

const maxLikes = (blogs) => {
  return blogs.reduce((max, blogs) => {
    return blogs.likes >= max.likes ? blogs : max;
  });
};

module.exports = {
  dummy,
  sumLikes,
  maxLikes,
};
