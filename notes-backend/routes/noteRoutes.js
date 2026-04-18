const express = require("express");
const multer = require("multer");
const path = require("path");
const Note = require("../models/Note");
const Comment = require("../models/Comment");
const auth = require("../middleware/auth"); // Assuming auth middleware is or will be available

const router = express.Router();

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Upload Note
router.post("/", upload.single('file'), async (req, res) => {
  try {
    const file_url = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : "dummy_url_for_now.pdf";
    // We will parse tags if sent as a string array
    const parsedTags = req.body.tags ? (typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags) : [];
    
    const note = new Note({
      ...req.body,
      tags: parsedTags,
      file_url: file_url,
      uploaded_by: req.body.uploaded_by || "Guest User",
      uploaded_by_id: req.body.uploaded_by_id || null
    });

    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Get All Notes
router.get("/", async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

// Get Top Liked Notes
router.get("/top-liked", async (req, res) => {
  try {
    const topNotes = await Note.aggregate([
      { 
        $addFields: { 
          likesCount: { $size: { $ifNull: ["$likes", []] } } 
        } 
      },
      { $sort: { likesCount: -1 } },
      { $limit: 8 }
    ]);
    res.json(topNotes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Search Notes
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) {
      const results = await Note.find().sort({ createdAt: -1 }).limit(10);
      return res.json(results);
    }

    const results = await Note.aggregate([
      { $match: { $text: { $search: q } } },
      { 
        $addFields: { 
          likesCount: { $size: { $ifNull: ["$likes", []] } },
          score: { $meta: "textScore" }
        }
      },
      { $sort: { likesCount: -1, score: -1 } }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Single Note
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!note) return res.status(404).json({ msg: "Note not found" });
    res.json(note);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Note not found" });
    }
    res.status(500).json(err);
  }
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

// Toggle Like
router.put("/like/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    const { userId } = req.body;
    const uid = userId || "anonymous";

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ msg: "Note not found" });

    // Ensure likes array exists
    if (!note.likes) note.likes = [];

    const index = note.likes.indexOf(uid);
    if (index === -1) {
      note.likes.push(uid);
    } else {
      note.likes.splice(index, 1);
    }

    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add a Comment
router.post("/:id/comment", async (req, res) => {
  try {
    const { userId, userName, text, userAvatar } = req.body;
    const comment = new Comment({
      noteId: req.params.id,
      userId,
      userName,
      userAvatar,
      text
    });
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Comments for a Note
router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ noteId: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;