import axios from 'axios';

test('Registration page - valid registration', async () => {
  const baseUrl = 'http://127.0.0.1:3000';

  const userData = {
    firstName: "new",
    lastName: "user",
    email: "newuser@example.com",
    password: "newpassword123"
  };

  try {
    await axios.post(`${baseUrl}/api/delete`, { email: userData.email }, {
      headers: { 'Content-Type': 'application/json' },
    });
    // Send the registration request
    const response = await axios.post(`${baseUrl}/api/register`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response.status).toBe(200);


  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error during registration:', error.message);
      console.error('Error details:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }

    throw new Error('Test failed due to error during registration or deletion.');
  }
});
