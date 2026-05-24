import { Router } from 'express';
import { chatController } from '../controllers/chat';

const router = Router();

router.post('/message', chatController.handleMessage);

export default router;