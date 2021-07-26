const mongoose = require("mongoose")

const schema = mongoose.Schema({
  username: String,
  name: String,
  email: {
    type: String,
    unique: true,
    index: true,
  },
  gender: String,
  address: String,
  phone: String,
  diseases: String,
  dob: String,
  age: Number,
  profilePic: {
    type: String,
    default: 'https://dailybits.xyz/images/he.png'
  },
  description: String,
  headerImage: String,
  documentCount: {
    type: Number,
    default: 0
  },
  medication: Object,
  labs: Object,
  diagnosis: Object,
  procedure: Object,
  vitals: Object,
  allergies: Object

}, { timestamps: true })

module.exports = mongoose.model("User", schema)





