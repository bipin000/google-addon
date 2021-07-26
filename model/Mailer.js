const mongoose = require("mongoose")

const schema = mongoose.Schema({
  title: String,
  partnerId: String,
  recipients: String,
  emails: [String],
  body: String
}, { timestamps: true })

module.exports = mongoose.model("Mailer", schema)



