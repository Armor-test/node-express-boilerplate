const crypto = require('crypto');

class SecurityTestCases {
  constructor() {
    // 1. AUTHENTICATION & AUTHORIZATION FINDINGS
    // Should detect hardcoded credentials
    this.adminCredentials = {
      username: 'admin',
      password: 'admin123',
      apiKey: 'sk_live_51HxTq8JkdZfktpdz'
    };

    // Should detect weak password validation
    this.validatePassword = (password) => {
      return password.length >= 6;
    };

    // Should detect direct role comparison
    this.checkAdminRole = (user) => {
      return user.role === 'admin';
    };

    // 2. CRYPTOGRAPHY FINDINGS
    // Should detect weak hashing
    this.hashPassword = (password) => {
      return crypto.createHash('md5')
        .update(password)
        .digest('hex');
    };

    // Should detect weak encryption
    this.encryptData = (data) => {
      const key = crypto.randomBytes(8); // Too short
      const cipher = crypto.createCipher('aes-128-cbc', key);
      return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    };

    // Should detect custom crypto
    this.customEncryption = (text) => {
      let result = '';
      const key = 'static_key_123';
      for(let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    };

    // 3. SECRETS MANAGEMENT FINDINGS
    // Should detect hardcoded secrets
    this.config = {
      database: {
        host: 'localhost',
        username: 'root',
        password: 'super_secret_password',
        connectionString: 'mysql://admin:password123@localhost:3306/db'
      },
      apis: {
        stripeKey: 'sk_live_51HxTq8JkdZfktpdz',
        awsAccessKey: 'AKIA1234567890ABCDEF',
        awsSecretKey: 'abcd1234EFGH5678ijkl',
        githubToken: 'ghp_123456789abcdefghijklmno'
      },
      jwt: {
        secret: 'jwt_super_secret_key_123',
        refreshToken: 'refresh_token_secret_456'
      },
      ssl: {
        privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA4e2F0CToxYfF...
-----END RSA PRIVATE KEY-----`
      }
    };

    // 4. DEPENDENCY VULNERABILITIES
    // Should detect vulnerable versions
    this.dependencies = {
      packages: {
        "lodash": "4.17.15",        // Vulnerable version
        "express": "4.16.1",        // Outdated with vulnerabilities
        "request": "2.88.2",        // Deprecated
        "node-uuid": "1.4.8",       // Deprecated
        "minimist": "1.2.5",        // Vulnerable
        "axios": "0.21.1"           // Known vulnerability
      },
      customDeps: {
        "insecure-pkg": "http://insecure-source.com/package.tgz",
        "beta-pkg": "2.0.0-beta.1",
        "local-pkg": "file:../local-package"
      }
    };

    // 5. EDGE CASES
    // Should detect various secret patterns
    this.edgeCases = {
      // Base64 encoded secrets
      encodedSecrets: {
        token: 'YWRtaW46cGFzc3dvcmQxMjM=',
        apiKey: Buffer.from('sk_live_123456').toString('base64')
      },

      // Split secrets
      getDatabaseUrl: () => {
        const user = 'admin';
        const pass = 'db_password_123';
        return `mongodb://${user}:${pass}@localhost`;
      },

      // Template literals
      templateSecrets: {
        key: `sk_${process.env.ENV}_12345`,
        token: `github_${process.env.TOKEN}_abc`
      },

      // Commented secrets
      // apiKey: "sk_live_123456789"
      // password: "super_secret_password"

      // Mixed patterns
      mixedSecrets: {
        hash: crypto.createHash('sha1').update('secret').digest('hex'),
        encoded: Buffer.from('password123').toString('base64'),
        encrypted: this.customEncryption('another_secret')
      }
    };

    // 6. INSECURE METHODS
    // Should detect insecure practices
    this.insecureMethods = {
      // Weak random
      generateToken: () => Math.random().toString(36).substring(7),

      // Direct command execution
      executeCommand: (cmd) => require('child_process').execSync(cmd),

      // Unsafe deserialization
      deserialize: (data) => eval('(' + data + ')'),

      // Weak session configuration
      sessionConfig: {
        secret: 'keyboard_cat',
        resave: true,
        saveUninitialized: true
      }
    };
  }

  // 7. NEGATIVE TEST CASES (Should Not Detect)
  safeImplementations() {
    return {
      // Secure password validation
      validatePassword: (password) => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        return strongRegex.test(password);
      },

      // Environment variables
      config: {
        dbUrl: process.env.DATABASE_URL,
        apiKey: process.env.API_KEY,
        jwtSecret: process.env.JWT_SECRET
      },

      // Secure crypto
      encrypt: (data) => {
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
      }
    };
  }
}

module.exports = SecurityTestCases;
