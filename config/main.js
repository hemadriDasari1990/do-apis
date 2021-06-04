module.exports = {
  // Secret key for JWT signing and encryption
  accessTokenSecret: "ldrwngrt2021", // lets do retro with next generation retrospective tool
  refreshTokenSecret: "1202trgnwrdl", // access token secrete reverse
  // Database connection information
  database: "mongodb://uat.letsdoretro.com:27017/lets-do-retro",
  // Setting port for server
  port: 8080,
  // Configuring Mailgun API for sending transactional email
  // necessary in order to run tests in parallel of the main app
  test_port: 8080,
  test_db: "lets-do-retro",
  test_env: "test",
  bcryptSalt: 10,
  email: {
    from: "letsdoretro@gmail.com",
    host: "smtp.gmail.com",
    port: 587,
    user: "letsdoretro@gmail.com",
    password: "ziknjvfoihgdjabo", //nodemailer
  },
  url: "http://uat.letsdoretro.com",
};
