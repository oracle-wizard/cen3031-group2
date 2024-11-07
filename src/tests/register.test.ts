// client/tests/register.test.ts
import axios from 'axios';

test('Registration page - valid registration', async () => {
  const baseUrl = 'http://localhost:3000'; // Adjust if your server is running on a different port

  // Create mock user data for registration with correct field names
  const userData = {
    firstName: "new",
    lastName: "user",
    email: "newuser@example.com",
    password: "newpassword123"
  };

  console.log('Request Data:', userData);

  try {
    const response = await axios.post(`${baseUrl}/api/register`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });

    // Assert that the response status is 201 (created)
    expect(response.status).toBe(201); // Assuming a successful registration returns 201
  } catch (error) {
    // If the request fails, log and fail the test
    console.error('Error during registration:', error);
    fail('Registration request failed when it was expected to succeed.');
  }
});
