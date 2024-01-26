const crypto = require("crypto");
const dotevn = require("dotenv");
dotevn.config();

const { RANDOM, STRING, HASH_REPEAT, HASH_LAGNTH, ALGORISM } = process.env;

const userUtil = {
  hashPassword: (userData, matchData) => {
    let salt;
    if (matchData) salt = matchData.salt;
    else salt = crypto.randomBytes(parseInt(RANDOM)).toString(STRING);

    const hashPassword = crypto
      .pbkdf2Sync(
        userData.password,
        salt,
        parseInt(HASH_REPEAT),
        parseInt(HASH_LAGNTH),
        ALGORISM
      )
      .toString(STRING);

    let hashResult;
    if (matchData) hashResult = { hashPw: hashPassword };
    else hashResult = { salt: salt, hashPw: hashPassword };
    return hashResult;
  },
};

module.exports = { userUtil };
