import { Router } from 'express';
import controller from '../controllers/auth.controller';
import { checkToken, checkRefreshToken } from '../middlewares/auth.middleware';
import validator from '../validator/auth.validator';

const router = Router();

/**
 * @api {post} /auth/login Login
 * @apiDescription Get an token
 * @apiVersion 1.0.0
 * @apiName Get an access token
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiHeader {String}        Content-Type   application/json
 *
 * @apiParam  {String}        email          User's email
 * @apiParam  {String {6..}}  password       User's password
 *
 * @apiSuccess  {String}  token               Token Object
 * @apiSuccess  {String}  token.accessToken   Access Token
 * @apiSuccess  {String}  token.expiresIn     Access Token's expiration delay
 * @apiSuccess  {String}  message             A message to  describe the request response status
 * @apiSuccess  {String}  success             True if the request succeed, otherwise false
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "token": {
 *       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJlbWFpbEBzaG9
 *       1bF9iZV91bmlxdWUuY29tIiwiaWF0IjoxNTc2NzY5ODMzLCJleHAiOjE1NzY3ODQyMzN9.6k57k9DiHYB9E9
 *       GOsJUbVdSm4pgnqg6zCWoCKgtRZOo",
 *       "expired_in": "4h"
 *   },
 *   "message": "Authentication successful!",
 *   "success": true
 * }
 *
 * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
 * @apiError (Unauthorized 401) Unauthorized      Incorrect email or password
 *                                                (TO DO in file auth.controller)
 */
router.route('/login')
  .post(
    validator.loginUser,
    controller.login,
  );

router.route('/refreshToken')
  .post(
    checkRefreshToken,
    controller.refreshToken,
  );

/**
 * @api {get} /auth/status Get Information
 * @apiDescription Extract information about Authorization token sent
 * @apiVersion 1.0.0
 * @apiName User information
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiHeader {String}    Authorization       Bearer + User's access token
 *
 * @apiSuccess  {String}  authUser            Authenticate user Object
 * @apiSuccess  {String}  authUser.id         Authenticate user's id
 * @apiSuccess  {String}  authUser.email      Authenticate user's email
 * @apiSuccess  {String}  status              Authenticate user's status
 * @apiSuccess  {String}  success             True if the request succeed, otherwise false
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "authUser": {
 *      "id": "1868280677287",
 *      "email": "useremail@shoul_be_unique.com"
 *   },
 *  "status": "authenticated",
 *  "success": true
 * }
 *
 * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
 * @apiError (Unauthorized 401) Unauthorized      Incorrect email or password
 *                                                (TO DO in file auth.controller)
 */
router.route('/status')
  .get(
    checkToken,
    controller.status,
  );

export default router;
