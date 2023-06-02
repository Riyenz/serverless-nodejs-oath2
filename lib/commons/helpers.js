const bcrypt = require('bcryptjs');

/**
 * Encrypt string using bcryptjs hashSync
 * @param {string} str string
 * @returns {Promise<string>} encrypted string
 */
const encrypt = (str) => bcrypt.hashSync(str, 8);

const compareHash = (plainText, hashedText) => bcrypt.compareSync(plainText, hashedText);

/**
 * @param  {object} validationFields
 * @param  {object} requestBody
 * @returns {{ errors: string[] }}
 */
const validateFields = (validationFields, requestBody) => {
  if (!validationFields || validationFields.length) {
    throw new Error('validationFields is should not be empty');
  }

  const errors = Object.keys(validationFields).reduce((acc, cur) => {
    const requestField = requestBody[cur];
    const validationField = validationFields[cur];

    if (validationField.isRequired && !requestField) {
      acc = {
        ...acc,
        [cur]: `${cur} is required`,
      };
    }

    if (requestField && validationField.type && typeof requestField !== validationField.type) {
      acc = {
        ...acc,
        [cur]: `${cur} must be a typeof ${validationField.type}`,
      };
    }

    return acc;
  }, {});

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {};
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
