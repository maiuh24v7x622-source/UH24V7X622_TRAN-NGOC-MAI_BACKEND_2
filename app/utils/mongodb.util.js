const { MongoClient } = require("mongodb");

class MongoDB {
  static async connect(uri) {
    if (this.client) return this.client;

    this.client = new MongoClient(uri);
    await this.client.connect();
    return this.client;
  }

  static getDb(dbName) {
    if (!this.client) {
      throw new Error("MongoDB chưa kết nối");
    }
    return this.client.db(dbName);
  }
}

module.exports = MongoDB;
