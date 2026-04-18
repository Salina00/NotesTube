const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  avatar: String,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  savedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);