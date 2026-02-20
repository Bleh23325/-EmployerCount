const express = require('express')
const cors = require('cors');

//ссылаемся на файлы с эндпоинтами
const addressRouter = require('./routes/address_route')  
const employeesRouter = require('./routes/employees_route') 
const filesRouter = require('./routes/files_route')     
const passportRouter = require('./routes/passport_route')      

// задаём порт. значение после || задаёт порт в ручную, елси его нет в env
const PORT = process.env.PORT || 2508
const app = express()

// без этого cors не будет работать
app.use(cors());

// обязательная штука для нормальной работы!
app.use(express.json())

// для адресов сотрудников
app.use('/api', addressRouter)    

// для самих сотрудников
app.use('/api', employeesRouter)  

// для файлов
app.use('/api', filesRouter)  

// для поаспортов
app.use('/api', passportRouter)   

// вывод порта в консоль
app.listen(PORT, () => console.log(`Порт сервера: http://localhost:${PORT}`))