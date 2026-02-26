const express = require('express')
const cors = require('cors');
require('dotenv').config();

const departmentsRouter = require('./routes/departments_rout')
const organizationsRouter = require('./routes/organizations_rout')
const personnelOperationsRouter = require('./routes/personnel-operations_rout')
const positionsRouter = require('./routes/positions_rout')

//ссылаемся на файлы с эндпоинтами
const addressRouter = require('./routes/address_route')  
const employeesRouter = require('./routes/employees_route') 
const filesRouter = require('./routes/files_route')     
const passportRouter = require('./routes/passport_route')      

// Импорты из ветки routes-auth-history
const rolesRoutes = require('./routes/roles-routes');
const authorizationRoutes = require('./routes/authorization-routes');
const specialistRoutes = require('./routes/specialist-routes');
const historyRoutes = require('./routes/history-routes');

// задаём порт. значение после || задаёт порт в ручную, елси его нет в env
const PORT = process.env.PORT || 5000
const app = express()

// без этого cors не будет работать
app.use(cors());

// обязательная штука для нормальной работы!
app.use(express.json())

// Роуты из organizations и employees веток
app.use('/api', departmentsRouter)
app.use('/api', organizationsRouter)
app.use('/api', personnelOperationsRouter)
app.use('/api', positionsRouter)

// для адресов сотрудников
app.use('/api', addressRouter)    
app.use('/api', employeesRouter)  
app.use('/api', filesRouter)  
app.use('/api', passportRouter)   

// Роуты из ветки routes-auth-history
app.use('/api', rolesRoutes);
app.use('/api', authorizationRoutes);
app.use('/api', specialistRoutes);
app.use('/api', historyRoutes);

// вывод порта в консоль
app.listen(PORT, () => console.log(`Порт сервера: http://localhost:${PORT}`))