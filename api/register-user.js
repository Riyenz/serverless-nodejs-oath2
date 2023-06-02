'use strict';

const dynamodb = require('serverless-dynamodb-client');
const { StatusCodes: STATUS_CODES } = require('http-status-codes');
const jwt = require("jsonwebtoken");

const { USER_FIELDS } = require('../lib/commons/constants');
const { encrypt, validateFields } = require('../lib/commons/helpers');

const isUserExists = async (request) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      email: request.body.email,
    },
  };

  const userGet = await dynamodb.doc.get(params).promise();
  return !!userGet.Item;
};

module.exports = async (request, response) => {
  const { errors } = validateFields(USER_FIELDS, request.body);

  if (errors) {
    return response.status(STATUS_CODES.NOT_ACCEPTABLE).json({ errors });
  }

  if (await isUserExists(request)) {
    return response.status(STATUS_CODES.CONFLICT).json({
      errors: {
        email: `User ${request.body.email} already exists`,
      },
    });
  }

  const user = {
    email: request.body.email,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
  };

  const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_DURATION,
  });

  const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_DURATION,
  });

  const params = {
    TableName: process.env.USERS_TABLE,
    Item: {
      ...user,
      password: encrypt(request.body.password),
    },
  };

  try {
    await dynamodb.doc.put(params).promise();

    return response.status(STATUS_CODES.CREATED).json({ token, refreshToken });
  } catch (err) {
    return response.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      errors: {
        general: err.message,
      },
    });
  }
};
