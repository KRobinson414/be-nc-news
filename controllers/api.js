exports.sendEndpoints = (req, res, next) => {
  res.status(200).sendFile(`${process.cwd()}/db/data/endpoints.json`);
};
