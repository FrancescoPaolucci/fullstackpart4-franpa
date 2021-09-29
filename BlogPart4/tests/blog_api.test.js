const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
  //************************************************ */
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash("root", 10);
  const user = new User({ username: "root", passwordHash });
  await user.save();
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
test("Id property exist and defined", async () => {
  const response = await api.get("/api/blogs");
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

test(" a blog is added ", async () => {
  const newBlog = {
    _id: "6154252901eab9615b8e47e1",
    title: "New blog is added",
    author: "wayne",
    url: "New blog is added",
    likes: 9,
    __v: 0,
  };
  const loginResp = await api
    .post("/api/login")
    .send({ username: "root", password: "root" });
  const token = loginResp.body.token;
  await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${token}`)
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtTheded = await helper.blogsInDb();
  expect(blogsAtTheded).toHaveLength(helper.initialBlogs.length + 1);

  const title = blogsAtTheded.map((n) => n.title);
  expect(title).toContain("New blog is added");
});

test(" a blog is added without the likes property ", async () => {
  const newBlog = {
    _id: "6154252901eab9615b8e47e1",
    title: "New blog is added",
    author: "wayne",
    url: "New blog is added",
    __v: 0,
  };
  const loginResp = await api
    .post("/api/login")
    .send({ username: "root", password: "root" });
  const token = loginResp.body.token;
  const result = await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${token}`)
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogsAtTheded = await helper.blogsInDb();
  expect(blogsAtTheded).toHaveLength(helper.initialBlogs.length + 1);

  const likes = result.body.likes;
  expect(likes).toBe(0);
});

test(" a blog is added without the URL and Title prop ", async () => {
  const newBlog = {
    _id: "6154252901eab9615b8e47e1",
    url: "New blog is added",
    __v: 0,
  };
  const loginResp = await api
    .post("/api/login")
    .send({ username: "root", password: "root" });
  const token = loginResp.body.token;
  const result = await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${token}`)
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  expect(result.body.message).toContain(
    "Blog validation failed: title: Path `title` is required."
  );
});

afterAll(() => {
  mongoose.connection.close();
});
