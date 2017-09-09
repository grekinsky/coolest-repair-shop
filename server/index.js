const express = require('express');
const compression = require('compression');
const path = require('path');
const config = require('./config')(process.env.NODE_ENV);

const app = express();

const rootPath = path.join(__dirname, './../dist');
const staticPath = path.join(__dirname, './../dist/assets');

app.use(compression());

app.use('/assets/', express.static(staticPath, {
  maxage: 31557600,
}));

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

// Route all to index.html
app.route(/^(\/\w*)+\/?$/i).get(nocache, (req, res) => {
  res.sendFile('index.html', {
    root: rootPath,
  });
});

let server;

function startServer() {
  server = app.listen(config.port, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`App listening at http://${host}:${port}`);
  });
}

startServer();
