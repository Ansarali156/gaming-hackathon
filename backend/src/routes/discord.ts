import { Router } from 'express';
import { discordController } from '../controllers/discord';

const router = Router();

router.get('/oauth', discordController.oauthRedirect);
router.get('/callback', discordController.oauthCallback);
router.post('/verify', discordController.verifyMembership);

export default router;