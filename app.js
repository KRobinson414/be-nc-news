const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const { handle404, handle400 } = require('./errors');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(handle400);
app.use(handle404);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: 'Internal server error' });
});

module.exports = app;
