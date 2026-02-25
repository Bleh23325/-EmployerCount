const router = require('express').Router();
const authMiddleware = require('../middlewares/auth-middleware');

// импорт объекта контролера, т.к буду делать через функции
const organizationController = require('../Controller/organizations_controller');

// простройка маршрутов.первый параметр - url по которому отрабатывается функция, второй - функция
router.post('/organizations',authMiddleware, organizationController.createOrganization);
router.get('/organizations',authMiddleware, organizationController.getOrganizations);
router.get('/organizations/:id',authMiddleware, organizationController.getOneOrganization);
router.put('/organizations/:id',authMiddleware, organizationController.updateOrganization);
router.delete('/organizations/:id',authMiddleware, organizationController.deleteOrganization);

module.exports = router;