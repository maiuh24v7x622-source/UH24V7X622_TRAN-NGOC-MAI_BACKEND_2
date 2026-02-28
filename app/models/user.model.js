const { ObjectId } = require("mongodb");

class User {
  constructor(payload) {
    this.email = payload.email;
    this.password = payload.password;
    this.name = payload.name;
    this.hobbies = payload.hobbies || [];
  }
}

module.exports = User;
