const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");

/**
 * =========================
 * CREATE CONTACT
 * =========================
 */
exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not be empty"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.create(req.body);

    return res.status(201).json({
      message: "Contact created successfully",
      data: document,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the contact"),
    );
  }
};

/**
 * =========================
 * GET ALL CONTACTS
 * =========================
 */
exports.findAll = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query;

    const documents = name
      ? await contactService.findByName(name)
      : await contactService.find({});

    return res.status(200).json(documents);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving contacts"),
    );
  }
};

/**
 * =========================
 * GET ONE CONTACT
 * =========================
 */
exports.findOne = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findById(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }

    return res.status(200).json(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving contact with id=${req.params.id}`),
    );
  }
};

/**
 * =========================
 * UPDATE CONTACT
 * =========================
 */
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }

    return res.status(200).json({
      message: "Contact updated successfully",
    });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating contact with id=${req.params.id}`),
    );
  }
};

/**
 * =========================
 * DELETE ONE CONTACT
 * =========================
 */
exports.delete = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }

    return res.status(200).json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete contact with id=${req.params.id}`),
    );
  }
};

/**
 * =========================
 * DELETE ALL CONTACTS
 * =========================
 */
exports.deleteAll = async (_req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deletedCount = await contactService.deleteAll();

    return res.status(200).json({
      message: `${deletedCount} contacts were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all contacts"),
    );
  }
};

/**
 * =========================
 * GET FAVORITE CONTACTS
 * =========================
 */
exports.findAllFavorite = async (_req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.findFavorite();

    return res.status(200).json(documents);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving favorite contacts"),
    );
  }
};
