const mongoose = require("mongoose")

const schema = mongoose.Schema({
  title: String,
  description: String,
  responseSheetId: String,
  formId: String,
  type: String,
  formViewUrl: String,
  formEditUrl: String,
  email: String,
  responses: Number,
  isPublished: Boolean,
}, { timestamps: true })

module.exports = mongoose.model("Form", schema)

