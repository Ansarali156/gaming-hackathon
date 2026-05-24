import { Router } from 'express';
import { emailController } from '../controllers/email';

const router = Router();

router.post('/send', emailController.sendEmail);
router.post('/registration-success', emailController.sendRegistrationSuccess);
router.post('/payment-failure', emailController.sendPaymentFailure);

export default router;