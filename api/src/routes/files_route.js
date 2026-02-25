const Router = require('express')
const authMiddleware = require('../middlewares/auth-middleware');
const router = new Router()
// импорт объекта контролера, т.к буду делать через функции
const filesController = require('../Controller/files_controller')

// простройка маршрутов.первый параметр - url по которому отабатывается функция, второй - функция
router.post('/files',authMiddleware, filesController.createFile)
router.get('/files',authMiddleware, filesController.getFiles)
router.get('/files/:id',authMiddleware, filesController.getOneFile)
router.get('/files/employee/:id_employees',authMiddleware, filesController.getFilesByEmployeeId)
router.put('/files/:id',authMiddleware, filesController.updateFile)
router.delete('/files/:id',authMiddleware, filesController.deleteFile)

module.exports = router