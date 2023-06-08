import express from "express";
import connect from "./utils/db.js";
import Post from "./models/Post.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
dotenv.config();
const app = express();
const port = process.env.PORT | 3000;
app.use(bodyParser.json());
app.use(cors());
// Create post

app.post("/", async (req, res) => {
  console.log("Request", req.body);
  const newPost = new Post(req.body);

  try {
    await connect();

    await newPost.save();

    return res.status(200).json({
      message: "Post Created",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Database error", success: false });
  }
});

app.get("/", async (req, res) => {
  try {
    await connect();
    const post = await Post.find();
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: "Database error", success: false });
  }
});

app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await connect();
    await Post.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Post deleted successfully", success: true });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({ message: "Database error", success: false });
  }

  return res.send("id:");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
