const { Pool } = require('pg');

// Create a new connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
