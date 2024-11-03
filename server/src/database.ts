import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

dotenv.config();

export async function initialize() {
  await oracledb.createPool({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING,
  });
  console.log('Database connection pool created');
}

export async function execute(query: string, binds: any = {}, options = {}) {
  const connection = await oracledb.getConnection();
  try {
    const result = await connection.execute(query, binds, options);
    await connection.commit();
    return result;
  } finally {
    await connection.close();
  }
}

export async function closePool() {
  try {
    await oracledb.getPool().close(0);  // 0 waits for active connections to close
    console.log('Database connection pool closed');
  } catch (error) {
    console.error('Error closing the database connection pool:', error);
  }
}
