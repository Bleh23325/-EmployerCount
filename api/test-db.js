const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'OP02',
  user: 'postgres',
  password: 'Postgre',
});

client.connect()
  .then(() => {
    console.log('✅ Успешно подключились к БД!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('✅ Текущее время БД:', res.rows[0]);
    client.end();
  })
  .catch(err => {
    console.error('❌ Ошибка подключения:');
    console.error(err);
    client.end();
  });