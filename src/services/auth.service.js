import jwt from 'jsonwebtoken';
import moment from 'moment-timezone';

function _token(email, expiresIn) {
  return jwt.sign({
    email,
    iat: moment().unix(),
  }, process.env.JWT_SECRET, { expiresIn });
}

const generateAccessToken = (email) => {
  const expiresIn = moment().add(process.env.JWT_EXPIRATION_DELAY, 'hours');
  const token = _token(email, expiresIn.unix());
  return { token, expiresIn: expiresIn.toDate() };
};

const generateRefreshToken = (email) => {
  const expiresIn = moment().add(30, 'days').toDate();
  const token = _token(email, 0);
  return { token, expiresIn };
};

export { generateAccessToken, generateRefreshToken };
