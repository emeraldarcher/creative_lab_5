module.exports = function(required) {
  return function (req, res, next) {
    var missing = required.filter(function(param) {
      if (!(param in req.body)) {
        return true;
      }
      if (req.body[param].trim() === '') {
        return true;
      }
    });
    if (missing.length === 0) {
      next();
    } else if (missing.length === 1) {
      res.status(400).send({ error: `Missing required value: ${missing[0]}` });
    } else {
      var missingString = missing.join(', ');
      res.status(400).send({
        error: `Missing required values: ${missingString}`
      });
    }
  };
}
