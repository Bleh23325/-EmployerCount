const router = require('express').Router();
const authMiddleware = require('../middlewares/auth-middleware');

// импорт объекта контролера, т.к буду делать через функции
const departmentController = require('../Controller/departments_controller');

// простройка маршрутов.первый параметр - url по которому отрабатывается функция, второй - функция
router.post('/departments',authMiddleware, departmentController.createDepartment);
router.get('/departments',authMiddleware, departmentController.getDepartments);
router.get('/departments/:id',authMiddleware, departmentController.getOneDepartment);
router.put('/departments/:id',authMiddleware, departmentController.updateDepartment);
router.delete('/departments/:id',authMiddleware, departmentController.deleteDepartment);

module.exports = router;