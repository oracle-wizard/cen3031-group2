// // server/tests/login.test.ts
// import axios, { AxiosResponse } from 'axios';

// test('Login page - valid login', async () => {
//   // Set the base URL for your API (adjust as needed based on your setup)
//   const baseUrl = 'http://localhost:3000'; // Adjust this if your server is on a different port

//   // Make the POST request using axios
//   const response: AxiosResponse = await axios.post(`${baseUrl}/api/login`, {
//     username: 'user1',
//     password: 'password123',
//   }, {
//     headers: { 'Content-Type': 'application/json' }
//   });

//   // Assert that the response status is 200 and message is correct
//   expect(response.status).toBe(200);
//   expect(response.data.message).toBe('Login successful');
// });
