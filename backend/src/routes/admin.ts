import { Router } from 'express';
import { adminController } from '../controllers/admin';

const router = Router();

router.get('/analytics', adminController.getAnalytics);
router.get('/participants', adminController.getParticipants);
router.put('/participants/:teamId/approve', adminController.approveTeam);
router.put('/participants/:teamId/reject', adminController.rejectTeam);
router.post('/announcements', adminController.createAnnouncement);
router.get('/announcements', adminController.getAnnouncements);
router.get('/sponsors', adminController.getSponsors);
router.post('/sponsors', adminController.createSponsor);
router.get('/payment-logs', adminController.getPaymentLogs);
router.post('/payment-logs', adminController.createPaymentLog);

export default router;