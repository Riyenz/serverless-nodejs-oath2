module.exports = (body, statusCode = 200) => {
	return {
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
		statusCode,
		body: JSON.stringify(body, null, 2),
	};
};
