"use strict";
const jwt = require("jsonwebtoken");
const { StatusCodes: STATUS_CODES } = require("http-status-codes");
const { REFRESH_TOKEN_FIELDS } = require("../lib/commons/constants");
const { validateFields, isTokenExpired } = require("../lib/commons/helpers");

module.exports = async (request, response) => {
	try {
		const { authorization } = request.headers;
		if (!authorization) {
			return response
				.status(STATUS_CODES.UNAUTHORIZED)
				.json({ errors: ["Authorization header is not set"] });
		}

		const { errors } = validateFields(REFRESH_TOKEN_FIELDS, request.body);
		if (errors.length) {
			return response.status(STATUS_CODES.NOT_ACCEPTABLE).json({ errors });
		}

		const token = authorization.split(" ")[1];

		const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
			ignoreExpiration: true,
		});

		if (!isTokenExpired(decodedToken)) {
			return response
				.status(STATUS_CODES.NOT_ACCEPTABLE)
				.json({ errors: ["access token is not yet expired"] });
		}

		const decodedRefreshToken = jwt.verify(
			request.body.refreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);

		const newToken = jwt.sign(
			{ user: decodedRefreshToken.user },
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: process.env.ACCESS_TOKEN_DURATION,
			}
		);

		return response.json({ token: newToken });
	} catch (err) {
		return response
			.status(STATUS_CODES.UNAUTHORIZED)
			.json({ errors: [err.message] });
	}
};
