const router = require('express').Router();

// импорт объекта контролера, т.к буду делать через функции
const registrationAddressController = require('../Controller/adress_controller');


// простройка маршрутов.первый параметр - url по которому отрабатывается функция, второй - функция
router.post('/registration-address', registrationAddressController.createRegistrationAddress);
router.get('/registration-address', registrationAddressController.getRegistrationAddresses);
router.get('/registration-address/:id', registrationAddressController.getOneRegistrationAddress);
router.put('/registration-address/:id', registrationAddressController.updateRegistrationAddress);
router.delete('/registration-address/:id', registrationAddressController.deleteRegistrationAddress);

module.exports = router;