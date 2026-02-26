const router = require('express').Router();
const authMiddleware = require('../middlewares/auth-middleware');

// импорт объекта контролера, т.к буду делать через функции
const registrationAddressController = require('../Controller/adress_controller');


// простройка маршрутов.первый параметр - url по которому отрабатывается функция, второй - функция
router.post('/registration-address',authMiddleware, registrationAddressController.createRegistrationAddress);
router.get('/registration-address',authMiddleware, registrationAddressController.getRegistrationAddresses);
router.get('/registration-address/:id',authMiddleware, registrationAddressController.getOneRegistrationAddress);
router.put('/registration-address/:id',authMiddleware, registrationAddressController.updateRegistrationAddress);
router.delete('/registration-address/:id',authMiddleware, registrationAddressController.deleteRegistrationAddress);

module.exports = router;