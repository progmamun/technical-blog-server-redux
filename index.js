require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const moment = require("moment");
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("techBlog");
    const blogCollection = db.collection("blogs");

    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find({});
      const blog = await cursor.toArray();

      res.send({ status: true, data: blog });
    });

    app.post("/blog", async (req, res) => {
      const blog = req.body;
      const postedAt = moment();
      const result = await blogCollection.insertOne({ ...blog, postedAt });

      res.send(result);
    });

    app.patch("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const result = await blogCollection.updateOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const result = await blogCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
