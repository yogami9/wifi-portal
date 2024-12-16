const MikroNode = require('mikronode');
const { MIKROTIK_IP, MIKROTIK_USER, MIKROTIK_PASSWORD } = process.env;
const readline = require('readline');

async function connectToMikroTik() {
  const connection = MikroNode.getConnection(MIKROTIK_IP, MIKROTIK_USER, MIKROTIK_PASSWORD);
  await connection.connect();
  return connection;
}

// Function to check if password is in use by any existing users
async function isPasswordUsed(connection, password) {
  const users = await connection.get('/ip/hotspot/user/print');
  return users.some(user => user.password === password);
}

// Function to prompt user for password
async function promptPassword() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Please enter a password for the new user: ', (password) => {
      rl.close();
      resolve(password);
    });
  });
}

async function createUserOnMikroTik(email, plan) {
  const connection = await connectToMikroTik();
  
  let password = await promptPassword();

  // Check if password is in use
  while (await isPasswordUsed(connection, password)) {
    console.log('This password is already in use. Please choose a different password.');
    password = await promptPassword();
  }

  // Create user on MikroTik Hotspot
  const userResult = await connection.get('/ip/hotspot/user/add', {
    'name': email,
    'password': password,
    'profile': plan
  });

  connection.close(); // Close the connection after use
  return userResult; // Return the result of user creation
}

module.exports = { createUserOnMikroTik };