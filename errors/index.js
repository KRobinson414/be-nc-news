exports.handle404 = (err, req, res, next) => {
  res.status(404).send({ message: err.message });
};

exports.handle400 = (err, req, res, next) => {
  const codes400 = ['22PO2'];
  if (codes400.includes(err.code)) res.status(400).send({ message: err.toString() });
  else next(err);
};
