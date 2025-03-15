const express = require('express');
const router = express.Router();

// Show Published events
router.get('/', (req, res) => {
    const query = 'SELECT * FROM events WHERE published_at IS NOT NULL';
  
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Database error');
      } else {
        res.render('attendee', { title: 'Attendee Home Page', events: rows });
      }
    });
});
  
// Show Event details
router.get('/event/:id', (req, res) => {
    const eventId = req.params.id;
  
    const query = 'SELECT * FROM events WHERE event_id = ? AND published_at IS NOT NULL';
    db.get(query, [eventId], (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Database error');
      } else if (!row) {
        res.status(404).send('Event not found');
      } else {
        res.render('event-detail', { title: 'Event Details', event: row });
      }
    });
});

// Book ticket page
router.get('/event/:id/book', (req, res) => {
    const eventId = req.params.id;
  
    const query = 'SELECT * FROM events WHERE event_id = ? AND published_at IS NOT NULL';
    db.get(query, [eventId], (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Database error');
      } else if (!row) {
        res.status(404).send('Event not found');
      } else {
        res.render('book-ticket', { title: 'Book Ticket', event: row });
      }
    });
  });
  
// Process after booking Ticket
router.post('/event/:id/book', (req, res) => {
    const eventId = req.params.id;
    const { quantity } = req.body;

    const updateEventQuery = `
        UPDATE events 
        SET ticket_quantity = ticket_quantity - ? 
        WHERE event_id = ? AND ticket_quantity >= ?
    `;
    const insertOrderQuery = `
    INSERT INTO orders (event_id, quantity) 
    VALUES (?, ?)
    `;
    const params = [quantity, eventId, quantity];

    db.run(updateEventQuery, params, function (err) {
        if (err) {
        console.error(err.message);
        res.status(500).send('Database error');
        } else if (this.changes === 0) {
        res.status(400).send('Not enough tickets available');
        } else {
        db.run(insertOrderQuery, [eventId, quantity], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).send('Database error');
            } else {
                res.redirect(`/attendee/event/${eventId}`);
            }
        });
        }
    });
});

// Order history page
router.get('/orders', (req, res) => {
    const query = `
      SELECT o.order_id, o.quantity, o.booked_at, e.title, e.event_date 
      FROM orders o
      JOIN events e ON o.event_id = e.event_id
      ORDER BY o.booked_at DESC
    `;
  
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Database error');
      } else {
        res.render('order-history', { title: 'Order History', orders: rows });
      }
    });
  });

module.exports = router;