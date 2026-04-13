const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/auth");

const router = express.Router();

// Upload Note
router.post("/", async (req, res) => {
  try {
    const note = new Note({
      ...req.body,
      uploaded_by: req.body.uploaded_by || "Guest User"
    });

    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Notes
router.get("/", async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

// Get Single Note
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: "Note not found" });
    res.json(note);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Note not found" });
    }
    res.status(500).json(err);
  }
});

// Search Notes
router.get("/search", async (req, res) => {
  const q = req.query.q;

  const results = await Note.find({
    $text: { $search: q }
  });

  res.json(results);
});

// Get Notes by User
router.get("/user/:id", async (req, res) => {
  const notes = await Note.find({ uploaded_by: req.params.id });
  res.json(notes);
});

// Increment Downloads
router.put("/download/:id", async (req, res) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    { $inc: { downloads: 1 } },
    { new: true }
  );

  res.json(note);
});

module.exports = router;