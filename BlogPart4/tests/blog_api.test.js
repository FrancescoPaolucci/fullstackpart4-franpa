const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
}, 20000);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});
/*
test(" a blog is added ", async () => {
  const newBlog = {
    _id: "6154252901eab9615b8e47e1",
    title: "New blog is added2",
    author: "wayne",
    url: "New blog is added",
    likes: 9,
    __v: 0,
  };

  await api
    .post("/api/blogs")
    .set(
      "Authorization",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndheW5lIiwiaWQiOiI2MTUzMTk2OWU1MTQxNTg1ZmU3MTJhYzEiLCJpYXQiOjE2MzI5MDUyODksImV4cCI6MTYzMjkwODg4OX0.w2CqAs8CX2OuJe-uytGebu-HsXkn5qPM1KYrngdBt9o"
    )
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtTheded = await helper.blogsInDb();
  expect(blogsAtTheded).toHaveLength(helper.initialBlogs.length + 1);

  const title = blogsAtTheded.map((n) => n.title);
  expect(title).toContain("New blog is added");
});
*/

afterAll(() => {
  mongoose.connection.close();
});
