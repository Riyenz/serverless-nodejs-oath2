const axios = require('axios');
const { USER } = require('./constants');
const { StatusCodes: STATUS_CODES } = require('http-status-codes');

const loginUrl = 'http://localhost:3000/auth/login';
const refreshUrl = 'http://localhost:3000/auth/refresh';

describe('/verify', () => {
  test('must refresh token successfuly', async () => {
    const res = await axios.post(loginUrl, {
      email: USER.email,
      password: USER.password,
    });

    const { refreshToken } = res.data;
    const oldAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaXZhbkBhdml0LmRldiIsImZpcnN0TmFtZSI6Ikl2YW4iLCJsYXN0TmFtZSI6Ik90aW9uZyJ9LCJpYXQiOjE2ODM5ODkzNTksImV4cCI6MTY4Mzk4OTk1OX0.7fsrH6TX1SB7QDgaUfsACOXvRdddNbScOY9QK8UgMBc';

    const resVerify = await axios.post(
      refreshUrl,
      {
        refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${oldAccessToken}`,
        },
      }
    );

    expect(resVerify.status).toBe(STATUS_CODES.CREATED);
    expect(resVerify.data).toHaveProperty('token');
  });

  test('should fail if token is not yet expired', async () => {
    try {
      const res = await axios.post(loginUrl, {
        email: USER.email,
        password: USER.password,
      });

      const { token, refreshToken } = res.data;

      await axios.post(
        refreshUrl,
        {
          refreshToken,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      expect(err.response.status).toBe(STATUS_CODES.NOT_ACCEPTABLE);
      expect(err.response.data).toHaveProperty('errors');
    }
  });
});
