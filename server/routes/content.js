const express = require("express");
const Content = require("../models/Content");

const router = express.Router();

// Get all content
router.get("/", async (req, res) => {
  try {
    const contents = await Content.find().sort({ createdAt: -1 });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching content" });
  }
});

// Add new content
router.post("/", async (req, res) => {
  const { title, body, author } = req.body;
  try {
    const newContent = new Content({ title, body, author });
    await newContent.save();
    res.json(newContent);
  } catch (error) {
    res.status(500).json({ message: "Error adding content" });
  }
});

// Update content
router.put("/:id", async (req, res) => {
  const { title, body } = req.body;
  try {
    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      { title, body },
      { new: true }
    );
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: "Error updating content" });
  }
});

// Delete content
router.delete("/:id", async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: "Content deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting content" });
  }
});

// Add comment
router.post("/:id/comments", async (req, res) => {
  const { text, author } = req.body;
  try {
    const content = await Content.findById(req.params.id);
    content.comments.push({ text, author });
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment" });
  }
});

module.exports = router;