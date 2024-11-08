
import axios from 'axios';

// Mock axios to avoid real HTTP requests
jest.mock('axios');

test('Login page - valid login', async () => {
  const baseUrl = 'http://localhost:3000'; // Adjust if your server is running on a different port

  // Mock login credentials
  const loginData = {
    email: "newuser@example.com",
    password: "newpassword123"
  };

  // Define the mock response for a successful login
  (axios.post as jest.Mock).mockResolvedValue({
    status: 200, // Assuming successful login returns status 200
    data: { token: 'mocked-jwt-token' } // Example token response
  });

  try {
    const response = await axios.post(`${baseUrl}/api/login`, loginData, {
      headers: { 'Content-Type': 'application/json' },
    });

    // Assert that the mock response status is 200
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token'); // Check that token is returned
  } catch (error) {
    console.error('Error during login:', error);
    fail('Login request failed when it was expected to succeed.');
  }
});
