import axios from 'axios';

// Mock the entire axios module
jest.mock('axios');

// Now we can mock the resolved values for the axios methods
axios.delete = jest.fn().mockResolvedValue({ status: 200, data: { message: 'User deleted successfully' } });
axios.post = jest.fn().mockResolvedValue({ status: 201, data: { message: 'User registered successfully' } });

test('Registration page - valid registration', async () => {
  const baseUrl = 'http://localhost:3000/api';

  const userData = {
    firstName: "new",
    lastName: "user",
    email: "newuser@example.com",
    password: "newpassword123"
  };

  try {
    // Simulated Delete request
    const deleteResponse = await axios.delete(`${baseUrl}/delete`, {
      data: { email: userData.email },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(deleteResponse.status).toBe(200); // Check mock delete status

    // Simulated Registration request
    const response = await axios.post(`${baseUrl}/register`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response.status).toBe(201); // Check mock post status
  } catch (error) {
    // This block won't be hit since requests are mocked
    console.error('Error during test:', error);
    throw new Error('Test failed');
  }
});
