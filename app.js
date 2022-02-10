const port = process.env.PORT || '8080';
const express = require('express');
const { countAllRequests } = require('./monitoring');
const axios = require('axios');

const app = express();
app.use(countAllRequests());

app.get('/middle-tier', (req, res) => {
  // simulate an expensive action blah blah
  axios
    .get(`http://localhost:${port}/backend`)
    .then(() => axios.get(`http://localhost:${port}/backend`))
    .then((result) => res.send(result.data))
    .catch((err) => {
      console.error(err);
      res.status(500).send();
    })
})

app.get('/backend', (req, res) => res.send('Hello from the backend'));
app.get('/', (req, res) => res.send('Hello world!'));
app.get('/date', (req, res) => res.json({ today: new Date() }));

app.listen(parseInt(port, 10), () => {
  console.log(`listeneing for requests on http://localhost:${port}`);
});