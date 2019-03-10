const cors = require('cors');
const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const { handle400, handle404 } = require('./errors');

app.use(cors());

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(handle400);
app.use(handle404);
app.use((err, req, res, next) => {
  res.status(500).send({ message: 'Internal server error' });
});

module.exports = app;
