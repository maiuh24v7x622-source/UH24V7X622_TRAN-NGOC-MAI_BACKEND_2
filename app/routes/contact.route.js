const express = require("express");
console.log("CONTACT ROUTE FILE LOADED");

const contacts = require("../controllers/contact.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, contacts.findAll)
  .post(authMiddleware, contacts.create)
  .delete(authMiddleware, contacts.deleteAll);

router.route("/favorite").get(authMiddleware, contacts.findAllFavorite);

router
  .route("/:id")
  .get(authMiddleware, contacts.findOne)
  .put(authMiddleware, contacts.update)
  .delete(authMiddleware, contacts.delete);

module.exports = router;
