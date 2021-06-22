module.exports = {
  // Secret key for JWT signing and encryption
  accessTokenSecret: "ldrwngrt2021", // lets do retro with next generation retrospective tool
  refreshTokenSecret: "1202trgnwrdl", // access token secrete reverse
  // Database connection information
  database:
    "mongodb://hemadri:Hemanth%401505@cluster0-shard-00-00.vgtdr.mongodb.net:27017,cluster0-shard-00-01.vgtdr.mongodb.net:27017,cluster0-shard-00-02.vgtdr.mongodb.net:27017/lets-do-retro?ssl=true&replicaSet=atlas-elrkrn-shard-0&authSource=admin&retryWrites=true&w=majority",
  // Setting port for server
  port: 8080,
  // Configuring Mailgun API for sending transactional email
  // necessary in order to run tests in parallel of the main app
  test_port: 8080,
  test_db: "lets-do-retro",
  test_env: "test",
  bcryptSalt: 10,
  email: {
    from: "info@letsdoretro.com",
    host: "smtp.gmail.com",
    port: 587,
    user: "info@letsdoretro.com",
    password: "quxnmgwibrfvgvxe", //nodemailer
  },
  url: "https://letsdoretro.com",
};
