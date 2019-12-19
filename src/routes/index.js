import { Router } from 'express';
import auth from './auth.route';

const router = Router();

router.get('/status', (req, res) => res.send('OK'));

router.use('/auth', auth);

export default router;
