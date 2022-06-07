require('dotenv/config');
const path = require('path');
const express = require('express');
const errorMiddleware = require('./error-middleware');

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
  fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&libraries=geocoding&location=${location}&radius=${radius}&type=restaurant&key=${process.env.GOOGLE_MAPS_API_KEY}`)
    .then(fetchResponse => fetchResponse.json())
    .then(data => res.json(data))
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
