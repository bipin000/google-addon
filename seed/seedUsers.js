
const User = require('../model/User');
const Partner = require('../model/Partner');
const Offer = require('../model/Offer');
const fs = require('fs');


module.exports = {
  seedUsers: async function () {
    let us = await fs.readFileSync("./seed/users.json", 'utf-8');
    let users = JSON.parse(us);
    try {
      let count = await User.countDocuments();
      if (!count) {
        let newUsers = await User.insertMany(users)
        console.log(newUsers);
      }
    } catch (error) {
      console.error(error)
    }


  },
  seedPartner: async function () {
    let us = await fs.readFileSync("./seed/partner.json", 'utf-8');
    let users = JSON.parse(us);
    try {
      let count = await Partner.countDocuments();
      if (!count) {
        let newUsers = await Partner.insertMany(users)
        console.log(newUsers);
      }
    } catch (error) {
      console.error(error)
    }
  },
  seedOffer: async function () {
    let us = await fs.readFileSync("./seed/offer.json", 'utf-8');
    let users = JSON.parse(us);
    try {
      let count = await Offer.countDocuments();
      if (!count) {
        let newUsers = await Offer.insertMany(users)
        console.log(newUsers);
      }
    } catch (error) {
      console.error(error)
    }
  },

}