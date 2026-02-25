const router = require('express').Router();

// импорт объекта контролера, т.к буду делать через функции
const organizationController = require('../Controller/organizations_controller');

// простройка маршрутов.первый параметр - url по которому отрабатывается функция, второй - функция
router.post('/organizations', organizationController.createOrganization);
router.get('/organizations', organizationController.getOrganizations);
router.get('/organizations/:id', organizationController.getOneOrganization);
router.put('/organizations/:id', organizationController.updateOrganization);
router.delete('/organizations/:id', organizationController.deleteOrganization);

module.exports = router;