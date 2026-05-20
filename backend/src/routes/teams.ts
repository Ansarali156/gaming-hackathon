import { Router } from 'express';
import { teamController } from '../controllers/teams';

const router = Router();

router.get('/:teamId', teamController.getTeam);
router.get('/user/:userId', teamController.getTeamByUserId);
router.put('/:teamId', teamController.updateTeam);
router.post('/:teamId/submit', teamController.submitProject);

export default router;