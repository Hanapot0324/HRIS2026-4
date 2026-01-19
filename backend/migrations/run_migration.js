// Migration script to create dtr_print_history table
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../db');
const fs = require('fs');
const path = require('path');

const sqlFile = path.join(__dirname, 'create_dtr_print_history.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

db.query(sql, (err, result) => {
  if (err) {
    console.error('Error creating table:', err);
    process.exit(1);
  }
  
  console.log('✅ Successfully created dtr_print_history table');
  console.log('Result:', result);
  process.exit(0);
});
