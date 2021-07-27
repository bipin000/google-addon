const mongoose = require("mongoose")

const schema = mongoose.Schema({
  partnerId: String,
  about: String,
  email: String,
  address: String,
  adminEmail: String,
  adminName: String,
  category: String,
  city: String,
  locationCoordinates: String,
  name: String,
  orgBio: String,
  orgCoverPhoto: String,
  partnerContactNo: String,
  partnerEmail: String,
  partnerName: String,
  profilePic: String,
  state: String,
  templateType: String,
  version: String,
  websiteLink: String,
  primaryAdmin: Object,
  emailsAssociated: [String],
  url: String,
  tnc: String,
  payment_setup: String,
  disbursements: String,
  fb: String,
  linkedin: String,
  insta: String,
  twitter: String,
  orgCoverPhoto: String
}, { timestamps: true })

module.exports = mongoose.model("Partner", schema)



