const mongoose = require("mongoose")

const schema = mongoose.Schema({
  title: String,
  documentId: String,
  publicUrl: String,
  userEmail: String,
  fileName: String
}, { timestamps: true })

module.exports = mongoose.model("GoogleSheet", schema)