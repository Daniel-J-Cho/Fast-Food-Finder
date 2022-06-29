require('dotenv/config');
const path = require('path');
const pg = require('pg');
const express = require('express');
const errorMiddleware = require('./error-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
const publicPath = path.join(__dirname, 'public');

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
}

app.use(express.static(publicPath));

app.get('/api/hello', (req, res) => {
  res.json({ hello: 'world' });
});

app.use(express.json());

app.get('/api/locations', (req, res, next) => {
  const query = req.query.query;
  const location = req.query.location;
  const radius = req.query.radius;
  fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${location}&radius=${radius}&type=restaurant&key=${process.env.GOOGLE_MAPS_API_KEY}`)
    .then(fetchResponse => fetchResponse.json())
    .then(data => res.json(data))
    .catch(err => next(err));
});

app.get('/api/restLocs', (req, res, next) => {
  const sql = `
    select *
      from "locations"
     order by "locationId"
  `;
  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/restLocs', (req, res) => {
  const { restName, restAddress, googlePlaceId } = req.body;
  if (!restName || !restAddress || !googlePlaceId) {
    res.status(400).json({
      error: 'restName(string), restAddress(string), and googlePlaceId(string from google) are required fields'
    });
    return;
  }
  const sql = `
    insert into "locations" ("restaurantName", "address", "googlePlaceId")
    values ($1, $2, $3)
    returning *
  `;
  const params = [restName, restAddress, googlePlaceId];
  db.query(sql, params)
    .then(result => {
      const [locationData] = result.rows;
      res.status(201).json(locationData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});

app.delete('/api/favorites/:locationId', (req, res, next) => {
  const locationId = Number(req.params.locationId);
  if (!Number.isInteger(locationId) || locationId <= 0) {
    res.status(400).json({
      error: '\'locationId\' must be a positive integer'
    });
    return;
  }

  const text = 'DELETE FROM locations WHERE "locationId"=$1 RETURNING *';
  const params = [locationId];

  db.query(text, params)
    .then(result => {
      const locId = result.rows[0];
      if (!locId) {
        res.status(404).json({
          error: `Cannot find 'locationId' ${locationId}`
        });
      } else {
        res.status(204).json();
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: 'An unexpected error occurred.' });
    });
});

app.post('/api/comments/:locationId', (req, res, next) => {
  const locationId = Number(req.params.locationId);
  const comment = req.body.comment;
  if (!Number.isInteger(locationId) || locationId <= 0) {
    res.status(400).json({
      error: '\'locationId\' must be a positive integer'
    });
    return;
  }

  const sql = `
    insert into "comments" ("comment", "locationId", "createdAt")
    values ($1, $2, now())
    returning *
  `;
  const params = [comment, locationId];
  db.query(sql, params)
    .then(result => {
      const commentData = result.rows[0];
      res.status(201).json(commentData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: 'An unexpected error occurred.' });
    });
});

app.get('/api/comments/:locationId', (req, res, next) => {
  const locationId = Number(req.params.locationId);
  if (!Number.isInteger(locationId) || locationId <= 0) {
    res.status(400).json({
      error: '\'locationId\' must be a positive integer'
    });
    return;
  }
  const sql = `
    select *
      from comments
    where "locationId" = ($1)
    order by "commentId"
  `;
  const params = [locationId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.delete('/api/comments/:commentId', (req, res, next) => {
  const commentId = Number(req.params.commentId);
  if (!Number.isInteger(commentId) || commentId <= 0) {
    res.status(400).json({
      error: '\'commentId\' must be a positive integer'
    });
    return;
  }
  const text = 'DELETE FROM comments WHERE "commentId"=$1 RETURNING *';
  const params = [commentId];

  db.query(text, params)
    .then(result => {
      const comId = result.rows[0];
      if (!comId) {
        res.status(404).json({
          error: `Cannot find 'commentId' ${commentId}`
        });
      } else {
        res.status(204).json();
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: 'An unexpected error occurred.' });
    });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
