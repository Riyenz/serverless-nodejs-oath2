const axios = require("axios");
const { USER } = require("./constants");
const { StatusCodes: STATUS_CODES } = require("http-status-codes");

const url = "http://localhost:3000/auth/login";

describe("/login", () => {
	test("must login user successfuly", async () => {
		const res = await axios.post(url, {
			email: USER.email,
			password: USER.password,
		});

		expect(res.status).toBe(STATUS_CODES.CREATED);
		expect(res.data).toHaveProperty("token");
		expect(res.data).toHaveProperty("refreshToken");
	});

	test("should fail saying that email is required", async () => {
		try {
			await axios.post(url, {
				password: USER.password,
			});
		} catch (err) {
			expect(err.response.status).toBe(STATUS_CODES.NOT_ACCEPTABLE);
		}
	});

	test("should fail saying that password is required", async () => {
		try {
			await axios.post(url, {
				email: USER.email,
			});
		} catch (err) {
			expect(err.response.status).toBe(STATUS_CODES.NOT_ACCEPTABLE);
		}
	});

	test("should fail saying that email not found", async () => {
		try {
			await axios.post(url, {
				email: Date.now() + "@avit.dev",
				password: USER.password,
			});
		} catch (err) {
			expect(err.response.status).toBe(STATUS_CODES.NOT_FOUND);
		}
	});

	test("should fail saying that password is incorrect", async () => {
		try {
			await axios.post(url, {
				email: USER.email,
				password: "wrongpassword",
			});
		} catch (err) {
			expect(err.response.status).toBe(STATUS_CODES.UNAUTHORIZED);
		}
	});
});
