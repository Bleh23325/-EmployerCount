const router = require('express').Router();
const authMiddleware = require('../middlewares/auth-middleware');

// импорт объекта контролера, т.к буду делать через функции
const personnelOperationController = require('../Controller/personnel-operations_controller');

// простройка маршрутов.первый параметр - url по которому отрабатывается функция, второй - функция
router.post('/operations',authMiddleware, personnelOperationController.createPersonnelOperation);
router.get('/operations',authMiddleware, personnelOperationController.getPersonnelOperations);
router.get('/operations/:id',authMiddleware, personnelOperationController.getOnePersonnelOperation);
router.put('/operations/:id',authMiddleware, personnelOperationController.updatePersonnelOperation);
router.delete('/operations/:id',authMiddleware, personnelOperationController.deletePersonnelOperation);

module.exports = router;