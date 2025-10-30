import postgres from 'postgres';

// Expects DATABASE_URL in the environment
// Example: postgres://postgres:<password>@<host>:5432/postgres?sslmode=require
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Please add it to your environment.');
}

const sql = postgres(connectionString);

export default sql;


