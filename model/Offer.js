const mongoose = require("mongoose")

const schema = mongoose.Schema({
  version: String,
  partnerId: String,
  type_of_offer: String,
  choose_survey: Object,
  contact_information: Object,
  name: String,
  email: String,
  phone_number: String,
  website_link: String,
  publicLink: String
}, { timestamps: true })

module.exports = mongoose.model("Offer", schema)



