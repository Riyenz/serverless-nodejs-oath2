const axios = require("axios");
const { USER } = require("./constants");
const { StatusCodes: STATUS_CODES } = require("http-status-codes");

const url = "http://localhost:3000/auth/register";

describe("/register", () => {
	test("must register user successfuly", async () => {
		const user = {
			...USER,
			email: Date.now() + "@avit.dev",
		};
		const res = await axios.post(url, user);

		expect(res.status).toBe(STATUS_CODES.CREATED);
		expect(res.data).toHaveProperty("token");
		expect(res.data).toHaveProperty("refreshToken");
	});

	test("should fail saying that email already exists", async () => {
		try {
			await axios.post(url, USER);
		} catch (err) {
			expect(err.response.status).toBe(STATUS_CODES.CONFLICT);
			expect(err.response.data).toHaveProperty("errors");
			expect(err.response.data.errors).toHaveProperty("email");
		}
	});

	test("should fail saying that email is required", async () => {
		try {
			await axios.post(url, {
				...USER,
				email: undefined,
			});
		} catch (err) {
			expect(err.response.status).toBe(STATUS_CODES.NOT_ACCEPTABLE);
			expect(err.response.data).toHaveProperty("errors");
			expect(err.response.data.errors).toHaveProperty("email");
		}
	});

	test("should fail saying that firstName is required", async () => {
		try {
			await axios.post(url, {
				...USER,
				firstName: undefined,
			});
		} catch (err) {
			expect(err.response.status).toBe(STATUS_CODES.NOT_ACCEPTABLE);
			expect(err.response.data).toHaveProperty("errors");
			expect(err.response.data.errors).toHaveProperty("firstName");
		}
	});

	test("should fail saying that lastName is required", async () => {
		try {
			await axios.post(url, {
				...USER,
				lastName: undefined,
			});
		} catch (err) {
			expect(err.response.status).toBe(STATUS_CODES.NOT_ACCEPTABLE);
			expect(err.response.data).toHaveProperty("errors");
			expect(err.response.data.errors).toHaveProperty("lastName");
		}
	});

	test("should fail saying that password is required", async () => {
		try {
			await axios.post(url, {
				...USER,
				password: undefined,
			});
		} catch (err) {
			expect(err.response.status).toBe(STATUS_CODES.NOT_ACCEPTABLE);
			expect(err.response.data).toHaveProperty("errors");
			expect(err.response.data.errors).toHaveProperty("password");
		}
	});
});
