const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  text: { type: String, required: true },
  likes: [String],
  dislikes: [String]
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
