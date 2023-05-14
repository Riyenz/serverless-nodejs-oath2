const axios = require('axios');
const { USER } = require('./constants');
const { StatusCodes: STATUS_CODES } = require('http-status-codes');

const loginUrl = 'http://localhost:3000/auth/login';
const verifyUrl = 'http://localhost:3000/auth/verify';

describe('/verify', () => {
  test('must verify token successfuly', async () => {
    const res = await axios.post(loginUrl, {
      email: USER.email,
      password: USER.password,
    });

    const { token } = res.data;

    const resVerify = await axios.post(
      verifyUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(resVerify.status).toBe(STATUS_CODES.OK);
    expect(resVerify.data).toHaveProperty('iat');
    expect(resVerify.data).toHaveProperty('exp');
    expect(resVerify.data).toHaveProperty('user');
  });

  test('should fail if token is not provided', async () => {
    try {
      await axios.post(verifyUrl, {});
    } catch (err) {
      expect(err.response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    }
  });

  test('should fail if token is expired', async () => {
    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiaXZhbkBhdml0LmRldiIsImZpcnN0TmFtZSI6Ikl2YW4iLCJsYXN0TmFtZSI6Ik90aW9uZyJ9LCJpYXQiOjE2ODM5ODkzNTksImV4cCI6MTY4Mzk4OTk1OX0.7fsrH6TX1SB7QDgaUfsACOXvRdddNbScOY9QK8UgMBc';

      await axios.post(
        verifyUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      expect(err.response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    }
  });

  test('should fail if token is not valid', async () => {
    try {
      const token = 'not-valid-token';

      await axios.post(
        verifyUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      expect(err.response.status).toBe(STATUS_CODES.UNAUTHORIZED);
    }
  });
});
