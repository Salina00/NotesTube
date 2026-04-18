const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: String,
  description: String,
  subject: String,
  uploaded_by: String,
  uploaded_by_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  file_url: String,
  thumbnail_url: String,
  tags: [String],
  downloads: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likes: [String]
}, { timestamps: true });

noteSchema.index({ title: "text", subject: "text", tags: "text", description: "text" });

module.exports = mongoose.model("Note", noteSchema);