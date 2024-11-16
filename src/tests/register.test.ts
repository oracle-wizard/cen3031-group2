import api from "../axiosInstance";

test('Registration page - valid registration', async () => {
  const baseUrl = 'http://localhost:3000';

  const userData = {
    firstName: "new1",
    lastName: "user",
    email: "newuser1@example.com",
    password: "newpassword123"
  };
    // Send the registration request
    const response = await api.post(`${baseUrl}/register`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status).toBe(201);

    await api.post(`${baseUrl}/delete`, { email: userData.email }, {
      headers: { 'Content-Type': 'application/json' },
    });
});
