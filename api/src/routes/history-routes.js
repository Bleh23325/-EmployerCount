const { Router } = require('express');
const router = Router();
const controller = require('../controller/history-controller');

router.get('/history', controller.index);
router.delete('/history/:id', controller.delete);

module.exports = router;