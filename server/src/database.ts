import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

dotenv.config();

export async function initialize() {
  try {
    await oracledb.createPool({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
      poolMin: 4,
      poolMax: 10,
      poolIncrement: 1,
    });
    console.log('Database pool created');
  } catch (err) {
    console.error('Error initializing database pool:', err);
    throw err;
  }
}

export async function close() {
  try {
    await oracledb.getPool().close(10);
    console.log('Database pool closed');
  } catch (err) {
    console.error('Error closing database pool:', err);
  }
}

export async function execute(query: string, params: any[] = []) {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(query, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return result.rows;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}
