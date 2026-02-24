const { Router } = require('express');
const router = Router();

const controller = require('../controller/specialist-controller');
const authMiddleware = require('../middlewares/auth-middleware');

router.get('/specialists', authMiddleware, controller.index);
router.get('/specialists/:id', authMiddleware, controller.show);
router.post('/specialists', authMiddleware, controller.store);
router.put('/specialists/:id', authMiddleware, controller.update);
router.delete('/specialists/:id', authMiddleware, controller.delete);

module.exports = router;