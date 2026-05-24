import { Router } from 'express';

const router = Router();

// Payments are handled externally by SUN. These endpoints are intentionally deprecated.
router.post('/verify', (req, res) => res.status(410).json({ error: 'Payments moved to SUN' }));
router.post('/webhook', (req, res) => res.status(410).json({ error: 'Payments moved to SUN' }));
router.get('/status/:teamId', (req, res) => res.status(410).json({ error: 'Payments moved to SUN' }));

export default router;