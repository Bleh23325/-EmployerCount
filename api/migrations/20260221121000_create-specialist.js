exports.up = (pgm) => {
    pgm.createTable('specialist', {
        id: { type: 'serial', primaryKey: true },
        surname: { type: 'varchar(100)', notNull: true },
        name: { type: 'varchar(100)', notNull: true },
        patronymic: { type: 'varchar(100)' },

        id_authorization: {
            type: 'int',
            notNull: true,
            references: 'auth_users(id)', // <-- добавили кавычки
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },

        id_roles: {
            type: 'int',
            notNull: true,
            references: 'roles(id)',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        },

        add_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
        update_at: { type: 'timestamp' },
        delete_at: { type: 'timestamp' }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('specialist');
};
