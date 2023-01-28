const allowedCors = [
  'https://movies-explorer.gin.nomoredomains.rocks',
  'http://movies-explorer.gin.nomoredomains.rocks',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://api.movies-explorer.gin.nomoredomains.club',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};
