exports.up = (pgm) => {
    pgm.createTable('roles', {
        id: { type: 'serial', primaryKey: true },
        roles: { type: 'varchar(100)', notNull: true, unique: true }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('roles');
};
