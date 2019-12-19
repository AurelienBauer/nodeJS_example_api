import { body } from 'express-validator';
import { checkResult } from './checkResult';

exports.loginUser = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  checkResult,
];
