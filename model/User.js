const mongoose = require("mongoose")

const schema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  gender: String,
  profilePic: {
    type: String,
    default: 'https://dailybits.xyz/images/he.png'
  },
  description: String,
  headerImage: String,
  documentCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

module.exports = mongoose.model("User", schema)