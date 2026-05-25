import { Router } from 'express';
import { registerController } from '../controllers/register';

const router = Router();

router.post('/', registerController.createRegistration);
router.post('/cancel', registerController.cancelRegistration);

export default router;