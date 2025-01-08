const bcrypt = require("bcrypt");

exports.hashString = (string) => {
  return bcrypt.hashSync(string, Number.parseInt(process.env.SALT_ROUND));
};

exports.passwordString = (string, hashString) => {
  return bcrypt.compare(string, hashString);
};
