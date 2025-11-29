const dbConfig = {
  development: {
    username: 'admin_user',
    password: 'super_secret_password',  // Should detect
    database: 'my_database',
    host: 'localhost',
    dialect: 'mysql'
  }
};

module.exports = dbConfig;
