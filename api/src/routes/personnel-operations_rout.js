const router = require('express').Router();

// импорт объекта контролера, т.к буду делать через функции
const personnelOperationController = require('../Controller/personnel-operations_controller');

// простройка маршрутов.первый параметр - url по которому отрабатывается функция, второй - функция
router.post('/operations', personnelOperationController.createPersonnelOperation);
router.get('/operations', personnelOperationController.getPersonnelOperations);
router.get('/operations/:id', personnelOperationController.getOnePersonnelOperation);
router.put('/operations/:id', personnelOperationController.updatePersonnelOperation);
router.delete('/operations/:id', personnelOperationController.deletePersonnelOperation);

module.exports = router;