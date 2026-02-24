const { Router } = require('express');
const router = Router();
const controller = require('../controller/roles-controller');
const authMiddleware = require('../middlewares/auth-middleware');

router.get('/roles', authMiddleware, controller.index);
router.get('/roles/:id', authMiddleware, controller.show);
router.post('/roles', authMiddleware, controller.store);
router.put('/roles/:id', authMiddleware, controller.update);
router.delete('/roles/:id', authMiddleware, controller.delete);

module.exports = router;
