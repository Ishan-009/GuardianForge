const Joi = require("joi");

// Validation using Joi

// Get All User Query Validation
const validateGetUserQuery = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  page_size: Joi.number().integer().min(2).optional(),
  username: Joi.string().alphanum().optional(),
  email: Joi.string().email().optional(),
});

// POST, Create User Validation

const validatePostUserRequest = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().optional(),
});

const validateSignInRequest = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Get by ID , Validate Param

const validateIdParam = Joi.object({
  id: Joi.string()
    .required()
    .pattern(/^[0-9a-f]{24}$/),
});

// PUT , Param and Schema Validation

const validateUpdateUserRequest = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
});

module.exports = {
  validateGetUserQuery,
  validateIdParam,
  validatePostUserRequest,
  validateUpdateUserRequest,
  validateSignInRequest,
};
