exports.up = (pgm) => {
    pgm.createTable('auth_users', {
        id: { type: 'serial', primaryKey: true },
        login: { type: 'varchar(100)', notNull: true, unique: true },
        password: { type: 'varchar(255)', notNull: true },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp' },
        deleted_at: { type: 'timestamp' }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('auth_users');
};
