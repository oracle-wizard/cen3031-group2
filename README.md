# SummitSavings Project Group 2

## Overview

This project is built with Vite for the frontend and Express with Node.js for the backend. The backend connects to an Oracle database to fetch data, which is then displayed on the frontend.

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Oracle Database** (or access to a compatible Oracle instance)
- **Oracle Instant Client** (required for Oracle DB connection)

Dependencies
Frontend (client/package.json)
Vite - for fast frontend development
React - for building UI components
Bootstrap  - for styling
Backend (server/package.json)
Express - for creating the API
CORS - for handling cross-origin requests
dotenv - for environment variable management
oracledb - for connecting to the Oracle database

## Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone <repository_url>
cd CIS4301_Project_Group_5

2.Install dependencies
Install dependencies in the root folder
npm install

Navigate into the server directory and install dependencies:
cd ../server
npm install

3. Create .env file in the server directory
with this format:
ORACLE_USER=your_username
ORACLE_PASSWORD=your_password
ORACLE_CONNECT_STRING=oracle.cise.ufl.edu:1521/orcl

4. Run the project 

Starting the backend, open the terminal in the server directory and run:
npm run dev

Starting the Frontend, open another terminal in the root folder directory and run:
npm run dev

5. Access the application:

Frontend: http://localhost:5173

Backend: http://localhost:3000/api/data


6. To run LoginPage or RegistrationPage
Use vscode and run the .html files. 
Use css to update styling

For more templates on creating pages use: https://getbootstrap.com/docs/4.1/getting-started/introduction/
