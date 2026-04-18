const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Note = require("../models/Note");
const auth = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });

    await user.save();
    res.json({ msg: "User registered" });
  } catch (err) {
    res.status(400).json({ error: "User exists" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  // Do not send password back
  const userWithoutPassword = await User.findById(user._id).select('-password');
  res.json({ token, user: userWithoutPassword });
});

// Get Current User (Me)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("savedNotes");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Top Subscribed Users
router.get("/top-subscribed", async (req, res) => {
  try {
    const topUsers = await User.aggregate([
      {
        $addFields: {
          subscribersCount: { $size: { $ifNull: ["$followers", []] } }
        }
      },
      { $sort: { subscribersCount: -1 } },
      { $limit: 10 },
      { $project: { password: 0 } } // Exclude password
    ]);
    res.json(topUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Toggle Save Note
router.put("/save-note/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const noteId = req.params.id;
    const index = user.savedNotes.indexOf(noteId);

    if (index === -1) {
      user.savedNotes.push(noteId);
    } else {
      user.savedNotes.splice(index, 1);
    }

    await user.save();
    res.json(user.savedNotes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Toggle Subscribe
router.put("/subscribe/:id", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);

    if (!currentUser || !targetUser) return res.status(404).json({ msg: "User not found" });
    if (currentUser.id === targetUser.id) return res.status(400).json({ msg: "Cannot subscribe to yourself" });

    const currentFollowingIndex = currentUser.following.indexOf(targetUser.id);
    const targetFollowerIndex = targetUser.followers.indexOf(currentUser.id);

    if (currentFollowingIndex === -1 && targetFollowerIndex === -1) {
      currentUser.following.push(targetUser.id);
      targetUser.followers.push(currentUser.id);
    } else {
      if (currentFollowingIndex !== -1) currentUser.following.splice(currentFollowingIndex, 1);
      if (targetFollowerIndex !== -1) targetUser.followers.splice(targetFollowerIndex, 1);
    }

    await currentUser.save();
    await targetUser.save();
    res.json({ following: currentUser.following, followers: targetUser.followers });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get User by ID
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").populate("savedNotes");
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Aggregate to get subscribers count if needed for convenience
    const userObj = user.toObject();
    userObj.subscribersCount = userObj.followers ? userObj.followers.length : 0;
    
    res.json(userObj);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;