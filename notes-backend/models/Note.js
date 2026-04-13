const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: String,
  subject: String,
  uploaded_by: String,
  type: String,
  file_url: String,
  tags: [String],
  downloads: { type: Number, default: 0 }
}, { timestamps: true });

noteSchema.index({ title: "text", subject: "text", tags: "text" });

module.exports = mongoose.model("Note", noteSchema);