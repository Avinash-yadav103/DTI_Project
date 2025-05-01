const { generateAccessToken } = require('./services/tokenService');

generateAccessToken()
  .then(token => console.log('New token:', token))
  .catch(err => console.error('Error:', err));