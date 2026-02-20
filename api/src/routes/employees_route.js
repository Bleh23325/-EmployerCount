const router = require('express').Router()

// импорт объекта контролера, т.к буду делать через функции
const employeesController = require('../Controller/employees_controller')

// простройка маршрутов.первый параметр - url по которому отабатывается функция, второй - функция
router.post('/employees', employeesController.createEmployee)
router.get('/employees', employeesController.getEmployees)
router.get('/employees/:id', employeesController.getOneEmployee)
router.put('/employees/:id', employeesController.updateEmployee)
router.delete('/employees/:id', employeesController.deleteEmployee)
router.get('/employees/export/file', employeesController.exportEmployeesToFile)

module.exports = router