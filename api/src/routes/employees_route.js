const router = require('express').Router()
const authMiddleware = require('../middlewares/auth-middleware');

// импорт объекта контролера, т.к буду делать через функции
const employeesController = require('../Controller/employees_controller')

// простройка маршрутов.первый параметр - url по которому отабатывается функция, второй - функция
router.post('/employees',authMiddleware, employeesController.createEmployee)
router.get('/employees',authMiddleware, employeesController.getEmployees)
router.get('/employees/:id',authMiddleware, employeesController.getOneEmployee)
router.put('/employees/:id',authMiddleware, employeesController.updateEmployee)
router.delete('/employees/:id',authMiddleware, employeesController.deleteEmployee)
router.get('/employees/export/file',authMiddleware, employeesController.exportEmployeesToFile)

module.exports = router