const fs = require('fs');
const path = require('path');
const db = require('./db');

function initDB() {
  const schema = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');

  // Split on semicolons, drop empty statements
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  statements.forEach(statement => {
    db.query(statement, (err) => {
      if (err) {
        console.error('Schema init error:', err.message);
      }
    });
  });

  console.log('Database schema initialised');
}

module.exports = initDB;