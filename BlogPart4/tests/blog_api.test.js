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

test(" a blog is added ", async () => {
  const newBlog = {
    _id: "5a422aa71b54a676134d17f8",
    title: "New blog is added",
    author: "New blog is added",
    url: "New blog is added",
    likes: 9,
    __v: 0,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtTheded = await helper.blogsInDb();
  expect(blogsAtTheded).toHaveLength(helper.initialBlogs.length + 1);

  const title = blogsAtTheded.map((n) => n.title);
  expect(title).toContain("New blog is added");
});

afterAll(() => {
  mongoose.connection.close();
});
