import axios from 'axios';

test('Registration page - valid registration', async () => {
  const baseUrl = 'http://localhost:3000';

  const userData = {
    firstName: "new1",
    lastName: "user",
    email: "newuser1@example.com",
    password: "newpassword123"
  };

  try {
    // Send the registration request
    const response = await axios.post(`${baseUrl}/api/register`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status).toBe(201);

    await axios.post(`${baseUrl}/api/delete`, { email: userData.email }, {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error during registration:', error.message);
      console.error('Error details:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    fail('Test failed due to error during registration or deletion.');
  }
});
