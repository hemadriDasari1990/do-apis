module.exports = {
  // Secret key for JWT signing and encryption
  secret: 'PemmasaniDasari',
  // Database connection information
  database: 'mongodb://localhost:27017/lets-do-retro',
  // Setting port for server
  port: 3001,
  // Configuring Mailgun API for sending transactional email
  // necessary in order to run tests in parallel of the main app
  test_port: 3001,
  test_db: 'lets-do-retro',
  test_env: 'test'
};
