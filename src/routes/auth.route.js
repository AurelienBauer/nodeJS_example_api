import { Router } from 'express';
import controller from '../controllers/auth.controller';
import { checkToken } from '../middlewares/auth.middleware';

const router = Router();

router.route('/login')
    .post(controller.login);

router.route('/register')
    .post(controller.register);

router.route('/status')
    .get(
        checkToken,
        controller.status
    );

module.exports = router;
