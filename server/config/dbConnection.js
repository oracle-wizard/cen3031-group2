const oracledb = require('oracledb');
require('dotenv').config();

async function connectToOracleDB() {
  let connection;

  try {
    // Establish connection
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING
    });

    console.log('Successfully connected to Oracle Database');

    // Test query
    const result = await connection.execute(`SELECT table_name FROM user_tables`);
    console.log('Tables in  schema:', result.rows);

  } catch (err) {
    console.error('Error connecting to Oracle Database:', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing the connection:', err);
      }
    }
  }
}

connectToOracleDB();