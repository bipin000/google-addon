
const User = require('../model/User');
const fs = require('fs');


module.exports = {
  seedUsers: async function () {
    let us = await fs.readFileSync("./seed/users.json",'utf-8');
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


  }
}