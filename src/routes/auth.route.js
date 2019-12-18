import { Router } from 'express';
import controller from '../controllers/auth.controller';
import { checkToken } from '../middlewares/auth.middleware';
import {loginUser} from '../validator/auth.validator';

const router = Router();

router.route('/login')
    .post(
        loginUser,
        controller.login
    );

router.route('/status')
    .get(
        checkToken,
        controller.status
    );

module.exports = router;
