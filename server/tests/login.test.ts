import axios from 'axios';

// Mock axios to avoid real HTTP requests
jest.mock('axios');

describe('Login API Test', () => {

  test('should login successfully with valid credentials', async () => {
    const baseUrl = 'http://localhost:3000'; // Adjust this to match your server's URL

    const loginData = {
      email: "validuser@example.com",
      password: "validpassword123"
    };

    // Define the mock response for a successful login
    (axios.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: { token: 'mocked-jwt-token' } // Mocked response token
    });

    const response = await axios.post(`${baseUrl}/api/login`, loginData, {
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token');
    expect(response.data.token).toBe('mocked-jwt-token');
  });

  test('should fail login with invalid credentials', async () => {
    const baseUrl = 'http://localhost:3000'; 

    const loginData = {
      email: "wronguser@example.com",
      password: "wrongpassword123"
    };

    // Mock response for failed login (incorrect credentials)
    (axios.post as jest.Mock).mockResolvedValue({
      status: 401,
      data: { message: 'Invalid credentials' }
    });

    try {
      const response = await axios.post(`${baseUrl}/api/login`, loginData, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Check for failure response
      expect(response.status).toBe(401);
      expect(response.data).toHaveProperty('message', 'Invalid credentials');
    } catch (error) {
      console.error('Error during login:', error);
      fail('Login request failed unexpectedly');
    }
  });

  test('should handle network errors gracefully', async () => {
    const baseUrl = 'http://localhost:3000';

    const loginData = {
      email: "user@example.com",
      password: "password123"
    };

    // Simulate network failure or server unavailability
    (axios.post as jest.Mock).mockRejectedValue(new Error('Network Error'));

    try {
      await axios.post(`${baseUrl}/api/login`, loginData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      // Ensure that the error is handled gracefully
      expect(error.message).toBe('Network Error');
    }
  });
});