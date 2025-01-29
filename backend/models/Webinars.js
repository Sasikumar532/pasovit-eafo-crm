const mongoose = require("mongoose");

const WebinarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  liveEmbed: { type: String, required: true },
  recordingEmbed: { type: String },
  chatEmbed: { type: String },
});

module.exports = mongoose.model("Webinar", WebinarSchema);
