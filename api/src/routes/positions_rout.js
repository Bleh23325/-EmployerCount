const router = require('express').Router();
const authMiddleware = require('../middlewares/auth-middleware');

// импорт объекта контролера, т.к буду делать через функции
const positionController = require('../Controller/positions_controller');

// простройка маршрутов.первый параметр - url по которому отрабатывается функция, второй - функция
router.post('/positions',authMiddleware, positionController.createPosition);
router.get('/positions',authMiddleware, positionController.getPositions);
router.get('/positions/:id',authMiddleware, positionController.getOnePosition);
router.put('/positions/:id',authMiddleware, positionController.updatePosition);
router.delete('/positions/:id',authMiddleware, positionController.deletePosition);

module.exports = router;