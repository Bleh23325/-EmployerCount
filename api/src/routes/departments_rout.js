const router = require('express').Router();

// импорт объекта контролера, т.к буду делать через функции
const departmentController = require('../Controller/departments_controller');

// простройка маршрутов.первый параметр - url по которому отрабатывается функция, второй - функция
router.post('/departments', departmentController.createDepartment);
router.get('/departments', departmentController.getDepartments);
router.get('/departments/:id', departmentController.getOneDepartment);
router.put('/departments/:id', departmentController.updateDepartment);
router.delete('/departments/:id', departmentController.deleteDepartment);

module.exports = router;