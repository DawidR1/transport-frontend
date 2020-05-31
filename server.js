const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist/transport'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/transport/index.html'));
});

app.listen(process.env.PORT || 8080);
const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
        ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
}
app.use(forceSSL());
