const { ObjectId } = require("mongodb");

class ContactService {
  constructor(client) {
    this.contact = client.db().collection("contacts");
  }

  extractContactData(payload) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite || false,
    };

    Object.keys(contact).forEach(
      (key) => contact[key] === undefined && delete contact[key],
    );

    return contact;
  }

  async create(payload) {
    const contact = this.extractContactData(payload);
    return await this.contact.insertOne(contact);
  }

  async find(filter) {
    return await this.contact.find(filter).toArray();
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) return null;
    return await this.contact.findOne({
      _id: new ObjectId(id),
    });
  }

  async update(id, payload) {
    if (!ObjectId.isValid(id)) return null;

    const update = this.extractContactData(payload);

    const result = await this.contact.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" },
    );

    return result || null;
  }

  async delete(id) {
    if (!ObjectId.isValid(id)) return null;

    const result = await this.contact.findOneAndDelete({
      _id: new ObjectId(id),
    });

    return result;
  }

  async findFavorite() {
    return await this.find({ favorite: true });
  }

  async deleteAll() {
    const result = await this.contact.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = ContactService;
