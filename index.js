const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const registerUser = require("./api/register-user");
const loginUser = require("./api/login-user");
const verifyToken = require("./api/verify-token");
const refreshToken = require("./api/refresh-token");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/auth/login", loginUser);
app.post("/auth/register", registerUser);
app.post("/auth/verify", verifyToken);
app.post("/auth/refresh", refreshToken);

app.use((req, res, next) => {
	return res.status(404).json({
		error: "Not Found",
	});
});

module.exports.handler = serverless(app);
