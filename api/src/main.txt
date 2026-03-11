const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/api', require('./routes/roles-routes'));
app.use('/api', require('./routes/authorization-routes'));
app.use('/api', require('./routes/specialist-routes'));
app.use('/api', require('./routes/history-routes'));

app.listen(5000, () => console.log('Server started on port 5000'));