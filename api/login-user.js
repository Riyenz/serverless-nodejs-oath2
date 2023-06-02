"use strict";

const dynamodb = require("serverless-dynamodb-client");
const { StatusCodes: STATUS_CODES } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const { compareHash, validateFields } = require("./../lib/commons/helpers");
const { LOGIN_FIELDS } = require("./../lib/commons/constants");

module.exports = async (request, response) => {
	try {
		const { errors } = validateFields(LOGIN_FIELDS, request.body);

		if (errors) {
			return response.status(STATUS_CODES.NOT_ACCEPTABLE).json({ errors });
		}

		const params = {
			TableName: process.env.USERS_TABLE,
			Key: {
				email: request.body.email,
			},
		};

		const userGet = await dynamodb.doc.get(params).promise();

		if (!userGet.Item)
			return response
				.status(STATUS_CODES.NOT_FOUND)
				.json({ errors: {
					email: 'Email does not exists'
				} });

		const user = userGet.Item;
		if (!compareHash(request.body.password, user.password))
			return response
				.status(STATUS_CODES.UNAUTHORIZED)
				.json({ errors: {
					password: 'Password is incorrect'
				} });

		const payload = {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
		};

		const token = jwt.sign({ user: payload }, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: process.env.ACCESS_TOKEN_DURATION,
		});

		const refreshToken = jwt.sign(
			{ user: payload },
			process.env.REFRESH_TOKEN_SECRET,
			{
				expiresIn: process.env.REFRESH_TOKEN_DURATION,
			}
		);

		return response.status(STATUS_CODES.CREATED).json({ token, refreshToken });
	} catch (err) {
		return response
			.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
			.json({ errors: {
				general: err.message
			} });
	}
};
