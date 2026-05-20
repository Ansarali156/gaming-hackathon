import { Router } from 'express';
import { paymentController } from '../controllers/payments';

const router = Router();

router.post('/verify', paymentController.verifyPayment);
router.post('/webhook', paymentController.handleWebhook);
router.get('/status/:teamId', paymentController.getPaymentStatus);

export default router;