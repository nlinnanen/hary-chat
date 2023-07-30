const crypto = require('crypto');

const hexString = crypto.randomBytes(32).toString('hex');

console.log(hexString);
