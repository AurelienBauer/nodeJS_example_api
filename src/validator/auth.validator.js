import { body } from 'express-validator';
import { checkResult } from './checkResult';
import { apisNameList } from '../configs/apis';

const loginUser = [
  body('email').isEmail().optional(),
  body('apiId').isString().optional(),
  body('apiName').isString().isIn(apisNameList).optional(),
  body('password').exists().isLength({ min: 6 }),
  checkResult,
];

const refreshToken = [
  body('refreshToken').isString(),
  checkResult,
];

export { loginUser, refreshToken };
