const express = require('express')
const cors = require('cors');   

const departmentsRouter = require('./routes/departments_rout')
const organizationsRouter = require('./routes/organizations_rout')
const personnelOperationsRouter = require('./routes/personnel-operations_rout')
const positionsRouter = require('./routes/positions_rout')

// задаём порт. значение после || задаёт порт в ручную, елси его нет в env
const PORT = process.env.PORT || 5000
const app = express()

// без этого cors не будет работать
app.use(cors());

// обязательная штука для нормальной работы!
app.use(express.json())

app.use('/api', departmentsRouter)
app.use('/api', organizationsRouter)
app.use('/api', personnelOperationsRouter)
app.use('/api', positionsRouter)

// вывод порта в консоль
app.listen(PORT, () => console.log(`Порт сервера: http://localhost:${PORT}`))