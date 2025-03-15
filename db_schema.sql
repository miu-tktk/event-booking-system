
-- MY CODE 
PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

-- setting table
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_name TEXT NOT NULL,
    site_description TEXT NOT NULL
);

-- default settings
INSERT INTO settings (site_name, site_description) VALUES ('My Event Site', 'Welcome to our event site!');

-- events table
CREATE TABLE IF NOT EXISTS events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    event_date TEXT NOT NULL, 
    created_at TEXT NOT NULL DEFAULT (datetime('now')), 
    published_at TEXT,
    ticket_price REAL, 
    ticket_quantity INTEGER 
);

-- orders table
CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    booked_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

COMMIT;

