const express = require('express');
const router = express.Router();

// Show All events (Drafts and Published separately)
router.get('/', (req, res) => {
    const draftQuery = 'SELECT * FROM events WHERE published_at IS NULL';
    const publishedQuery = 'SELECT * FROM events WHERE published_at IS NOT NULL';

    db.all(draftQuery, [], (err, drafts) => {
        if (err) {
        console.error(err.message);
        res.status(500).send('Database error');
        } else {
        db.all(publishedQuery, [], (err, published) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Database error');
            } else {
                res.render('organiser', { 
                title: 'Organiser Home Page', 
                drafts: drafts, 
                published: published 
                });
            }
        });        
        }
    });
});

// Create new draft
router.post('/add', (req, res) => {
    const query = `
      INSERT INTO events (title, description, event_date, published_at,ticket_price, ticket_quantity) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = ['Untitled Event', 'No description', '2025-01-01', null, 0, 0]; // default values
  
    db.run(query, params, function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send('Database error');
      } else {
        // redirect to edit page
        res.redirect(`/organiser/edit/${this.lastID}`);
      }
    });
  });

// Edit event page
router.get('/edit/:id', (req, res) => {
    const eventId = req.params.id;
  
    const query = 'SELECT * FROM events WHERE event_id = ?';
    db.get(query, [eventId], (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Database error');
      } else if (!row) {
        res.status(404).send('Event not found');
      } else {
        res.render('edit-event', { title: 'Edit Event', event: row });
      }
    });
  });

// Update Event info
router.post('/edit/:id', (req, res) => {
    // console.log(req.body);
    
    const eventId = req.params.id;
    const { title, description, event_date, ticket_price, ticket_quantity} = req.body;
  
    const query = `
      UPDATE events 
      SET title = ?, description = ?, event_date = ?, published_at = ?, ticket_price = ?, ticket_quantity = ?
      WHERE event_id = ?
    `;
    const params = [title, description, event_date, null, ticket_price, ticket_quantity, eventId]; //publised_at -> null
  
    // console.log('SQL Query:', query);
    // console.log('Parameters:', params);
    db.run(query, params, function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send('Database error');
      } else {
        res.redirect('/organiser');
      }
    });
  });

// Push draft to published
router.post('/publish/:id', (req, res) => {
    const eventId = req.params.id;
    const query = `
      UPDATE events 
      SET published_at = datetime('now') 
      WHERE event_id = ?
    `;
  
    db.run(query, [eventId], function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send('Database error');
      } else {
        res.redirect('/organiser');
      }
    });
  });
  
// Delete Event
router.post('/delete/:id', (req, res) => {
const eventId = req.params.id;
const query = 'DELETE FROM events WHERE event_id = ?';

db.run(query, [eventId], function (err) {
    if (err) {
    console.error(err.message);
    res.status(500).send('Database error');
    } else {
    res.redirect('/organiser');
    }
});
});

// Show Setting page
router.get('/settings', (req, res) => {
    const query = `SELECT * FROM settings LIMIT 1`;
    db.get(query, (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Database error');
      } else {
        res.render('settings', { settings: row });
      }
    });
  });

// Update setting page
router.post('/settings', (req, res) => {
    const { site_name, site_description } = req.body;
  
    // Validation for empty
    if (!site_name || !site_description) {
      return res.status(400).send('All fields are required');
    }
  
    const query = `
      UPDATE settings 
      SET site_name = ?, site_description = ?
      WHERE id = 1
    `;
    const params = [site_name, site_description];
  
    db.run(query, params, (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Database error');
      } else {
        res.redirect('/organiser'); // Redirect to Organiser Home Page
      }
    });
  });

module.exports = router;