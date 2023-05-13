"use strict";
const jwt = require("jsonwebtoken");
const { StatusCodes: STATUS_CODES } = require("http-status-codes");

module.exports = async (request, response) => {
	const { authorization } = request.headers;

	if (!authorization) {
		return response
			.status(STATUS_CODES.UNAUTHORIZED)
			.json({ errors: ["Authorization header is not set"] });
	}

	try {
		const token = authorization.split(" ")[1];

		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

		return response.json({ ...decoded });
	} catch (err) {
		return response
			.status(STATUS_CODES.UNAUTHORIZED)
			.json({ errors: [err.message] });
	}
};
