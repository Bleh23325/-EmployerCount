const router = require('express').Router();

// импорт объекта контролера, т.к буду делать через функции
const positionController = require('../Controller/positions_controller');

// простройка маршрутов.первый параметр - url по которому отрабатывается функция, второй - функция
router.post('/positions', positionController.createPosition);
router.get('/positions', positionController.getPositions);
router.get('/positions/:id', positionController.getOnePosition);
router.put('/positions/:id', positionController.updatePosition);
router.delete('/positions/:id', positionController.deletePosition);

module.exports = router;