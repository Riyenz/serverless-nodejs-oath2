const bcrypt = require("bcryptjs");

/**
 * Encrypt string using bcryptjs hashSync
 * @param {string} str string
 * @returns {Promise<string>} encrypted string
 */
const encrypt = (str) => bcrypt.hashSync(str, 8);

const compareHash = (plainText, hashedText) =>
	bcrypt.compareSync(plainText, hashedText);

/**
 * @param  {object} validationFields
 * @param  {object} requestBody
 * @returns {{ errors: string[] }}
 */
const validateFields = (validationFields, requestBody) => {
	if (!validationFields || validationFields.length) {
		throw new Error("validationFields is should not be empty");
	}

	const errors = Object.keys(validationFields)
		.map((key) => {
			const requestField = requestBody[key];
			const validationField = validationFields[key];

			if (validationField.isRequired && !requestField) {
				return `${key} must be specified.`;
			}

			if (
				requestField &&
				validationField.type &&
				typeof requestField !== validationField.type
			) {
				return `${key} must be a typeof ${validationField.type}.`;
			}
		})
		.filter((error) => !!error);

	return { errors };
};

const isTokenExpired = ({ exp }) => {
	return Date.now() >= exp * 1000;
};

module.exports = {
	encrypt,
	compareHash,
	validateFields,
	isTokenExpired,
};
