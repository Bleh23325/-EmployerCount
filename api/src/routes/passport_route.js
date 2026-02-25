const router = require('express').Router()
const authMiddleware = require('../middlewares/auth-middleware');

// импорт объекта контролера, т.к буду делать через функции
const passportDataController = require('../Controller/passport_controller')

// простройка маршрутов.первый параметр - url по которому отабатывается функция, второй - функция
router.post('/passport',authMiddleware, passportDataController.createPassportData)
router.get('/passport',authMiddleware, passportDataController.getPassportData)
router.get('/passport/:id',authMiddleware, passportDataController.getOnePassportData)
router.put('/passport/:id',authMiddleware, passportDataController.updatePassportData)
router.delete('/passport/:id',authMiddleware, passportDataController.deletePassportData)

module.exports = router