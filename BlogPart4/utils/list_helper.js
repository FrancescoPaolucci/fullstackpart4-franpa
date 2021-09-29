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

const maxBlogs = (blogs, key) => {
  const arr2 = [];
  blogs.forEach((x) => {
    if (
      arr2.some((val) => {
        return val[key] === x[key];
      })
    ) {
      arr2.forEach((k) => {
        if (k[key] === x[key]) {
          k["occurence"]++;
        }
      });
    } else {
      let a = {};
      a[key] = x[key];
      a["occurence"] = 1;
      arr2.push(a);
    }
  });
  const obj = arr2.reduce((max, authors) => {
    return authors.occurence >= max.occurence ? authors : max;
  });
  return {
    author: obj.author,
    blogs: obj.occurence,
  };
};

const mostLikes = (blogs) => {
  const obj = blogs.reduce((max, blogs) => {
    return blogs.likes >= max.likes ? blogs : max;
  });
  return {
    author: obj.author,
    likes: obj.likes,
  };
};

module.exports = {
  dummy,
  sumLikes,
  maxLikes,
  maxBlogs,
  mostLikes,
};
