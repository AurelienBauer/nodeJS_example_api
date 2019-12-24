import { body } from 'express-validator';
import { checkResult } from './checkResult';

const loginUser = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  checkResult,
];

const refreshToken = [
  body('refreshToken').isString(),
  checkResult,
];

export { loginUser, refreshToken };
