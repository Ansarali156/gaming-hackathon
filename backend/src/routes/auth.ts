import { Router } from 'express';
import { authController } from '../controllers/auth';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/session', authController.getSession);

export default router;
