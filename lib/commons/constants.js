const PROPERTY_TYPES = {
	STRING: "string",
	NUMBER: "number",
};

const USER_FIELDS = {
	email: {
		isRequired: true,
		type: PROPERTY_TYPES.STRING,
	},
	firstName: {
		isRequired: true,
		type: PROPERTY_TYPES.STRING,
	},
	lastName: {
		isRequired: true,
		type: PROPERTY_TYPES.STRING,
	},
	password: {
		isRequired: true,
		type: PROPERTY_TYPES.STRING,
	},
};

const LOGIN_FIELDS = {
	email: {
		isRequired: true,
		type: PROPERTY_TYPES.STRING,
	},
	password: {
		isRequired: true,
		type: PROPERTY_TYPES.STRING,
	},
};

const REFRESH_TOKEN_FIELDS = {
	refreshToken: {
		isRequired: true,
		type: PROPERTY_TYPES.STRING,
	},
};

module.exports = {
	USER_FIELDS,
	LOGIN_FIELDS,
	REFRESH_TOKEN_FIELDS,
};
