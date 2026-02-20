const Router = require('express')
const router = new Router()
// импорт объекта контролера, т.к буду делать через функции
const filesController = require('../Controller/files_controller')

// простройка маршрутов.первый параметр - url по которому отабатывается функция, второй - функция
router.post('/files', filesController.createFile)
router.get('/files', filesController.getFiles)
router.get('/files/:id', filesController.getOneFile)
router.get('/files/employee/:id_employees', filesController.getFilesByEmployeeId)
router.put('/files/:id', filesController.updateFile)
router.delete('/files/:id', filesController.deleteFile)

module.exports = router