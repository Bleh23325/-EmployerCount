const router = require('express').Router()

// импорт объекта контролера, т.к буду делать через функции
const passportDataController = require('../Controller/passport_controller')

// простройка маршрутов.первый параметр - url по которому отабатывается функция, второй - функция
router.post('/passport', passportDataController.createPassportData)
router.get('/passport', passportDataController.getPassportData)
router.get('/passport/:id', passportDataController.getOnePassportData)
router.put('/passport/:id', passportDataController.updatePassportData)
router.delete('/passport/:id', passportDataController.deletePassportData)

module.exports = router