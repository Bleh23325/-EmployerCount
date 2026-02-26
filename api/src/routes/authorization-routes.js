const { Router } = require('express');
const router = Router();
const controller = require('../controller/authorization-controller');
const authMiddleware = require('../middlewares/auth-middleware');

router.get('/auth-sessions', authMiddleware, controller.index);
router.get('/auth-sessions/:id', authMiddleware, controller.show);
router.post('/auth-sessions', authMiddleware, controller.store);
router.post('/auth-sessions/login', controller.login);
router.put('/auth-sessions/:id', authMiddleware, controller.update);
router.delete('/auth-sessions/:id', authMiddleware, controller.delete);

module.exports = router;
