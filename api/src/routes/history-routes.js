const { Router } = require('express');
const router = Router();
const controller = require('../controller/history-controller');
const authMiddleware = require('../middlewares/auth-middleware');

router.get('/history', controller.index);
router.post('/history', controller.store);
router.delete('/history/:id', authMiddleware, controller.delete);

module.exports = router;
