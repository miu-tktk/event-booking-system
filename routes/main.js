const express = require('express');
const router = express.Router();

// Main Home page
router.get('/', (req, res) => {
    const query = `SELECT * FROM settings LIMIT 1`;
    db.get(query, (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Database error');
      } else {
        const title = row ? row.site_name : 'Home Page';
        const message = row ? row.site_description : 'Welcome to Home Page!';
        res.render('main', { title, message });
      }
    });
  });

module.exports = router;