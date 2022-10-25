require('dotenv/config');
const path = require('path');
const pg = require('pg');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const fetch = require('node-fetch');
const ClientError = require('./client-error');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const authorizationMiddleware = require('./authorization-middleware');

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

app.use(express.json());

app.post('/api/users/register', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  argon2.hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("username", "hashedPassword")
        values ($1, $2)
        returning "userId", "username", "createdAt"
      `;
      const params = [username, hashedPassword];
      db.query(sql, params)
        .then(result => {
          const [user] = result.rows;
          res.status(201).json(user);
        })
        .catch(err => next(err));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});

app.post('/api/users/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
          }
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.get('/api/locations', (req, res, next) => {
  const query = req.query.query;
  const location = req.query.location;
  const radius = req.query.radius;
  fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${location}&radius=${radius}&type=restaurant&key=${process.env.GOOGLE_MAPS_API_KEY_2}`)
    .then(fetchResponse => fetchResponse.json())
    .then(data => res.json(data))
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.post('/api/restLocs', (req, res) => {
  const { userId } = req.user;
  const { restName, restAddress, googlePlaceId } = req.body;
  if (!restName || !restAddress || !googlePlaceId) {
    res.status(400).json({
      error: 'restName(string), restAddress(string), and googlePlaceId(string from google) are required fields'
    });
    return;
  }
  const sql = `
    insert into "locations" ("userId", "restaurantName", "address", "googlePlaceId")
    values ($1, $2, $3, $4)
    returning *
  `;
  const params = [userId, restName, restAddress, googlePlaceId];
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

app.get('/api/restLocs', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
    select *
      from "locations"
      where "userId" = $1
     order by "entryId"
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.delete('/api/favorites/:entryId', (req, res, next) => {
  const entryId = Number(req.params.entryId);
  if (!Number.isInteger(entryId) || entryId <= 0) {
    res.status(400).json({
      error: '\'entryId\' must be a positive integer'
    });
    return;
  }

  const text = 'DELETE FROM locations WHERE "entryId"=$1 RETURNING *';
  const params = [entryId];

  db.query(text, params)
    .then(result => {
      const locId = result.rows[0];
      if (!locId) {
        res.status(404).json({
          error: `Cannot find 'entryId' ${entryId}`
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

app.post('/api/comments/:entryId', (req, res, next) => {
  const entryId = Number(req.params.entryId);
  const comment = req.body.comment;
  if (!Number.isInteger(entryId) || entryId <= 0) {
    res.status(400).json({
      error: '\'entryId\' must be a positive integer'
    });
    return;
  }

  const sql = `
    insert into "comments" ("comment", "entryId", "createdAt")
    values ($1, $2, now())
    returning *
  `;
  const params = [comment, entryId];
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

app.get('/api/comments/:entryId', (req, res, next) => {
  const entryId = Number(req.params.entryId);
  if (!Number.isInteger(entryId) || entryId <= 0) {
    res.status(400).json({
      error: '\'entryId\' must be a positive integer'
    });
    return;
  }
  const sql = `
    select *
      from comments
    where "entryId" = ($1)
    order by "commentId"
  `;
  const params = [entryId];

  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.put('/api/comments/:commentId', (req, res, next) => {
  const commentId = Number(req.params.commentId);
  if (!Number.isInteger(commentId) || commentId <= 0) {
    res.status(400).json({
      error: '\'commentId\' must be a positive integer'
    });
  } else if (!req.body.editedComment) {
    res.status(400).json({
      error: '\'comment\' is a required field'
    });
  }

  const text = 'UPDATE comments SET "comment"=$1 WHERE "commentId"=$2 RETURNING *';
  const values = [req.body.editedComment, commentId];

  db.query(text, values)
    .then(result => {
      const id = result.rows[0];
      if (!id) {
        res.status(404).json({
          error: `Cannot find comment with 'commentId' ${commentId}`
        });
      } else {
        res.status(200).json(result.rows[0]);
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: 'An unexpected error occurred.' });
    });
});

app.get('/api/comments/:entryId', (req, res, next) => {
  const entryId = Number(req.params.entryId);
  if (!Number.isInteger(entryId) || entryId <= 0) {
    res.status(400).json({
      error: '\'entryId\' must be a positive integer'
    });
    return;
  }
  const sql = `
    select *
      from comments
     where "entryId" = ($1)
    order by "commentId"
  `;
  const params = [entryId];

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

app.delete('/api/comments/:entryId', (req, res, next) => {
  const entryId = Number(req.params.entryId);
  if (!Number.isInteger(entryId) || entryId <= 0) {
    res.status(400).json({
      error: '\'entryId\' must be a positive integer'
    });
    return;
  }
  const text = 'DELETE FROM comments WHERE "entryId"=$1 RETURNING *';
  const params = [entryId];

  db.query(text, params)
    .then(result => {
      const locId = result.rows;
      if (!locId) {
        res.status(404).json({
          error: `Cannot find 'entryId' ${entryId}`
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
