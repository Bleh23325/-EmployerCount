/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('employees', {
        id: { type: 'serial', primaryKey: true },
        first_name: { type: 'varchar', notNull: false },
        name: { type: 'varchar', notNull: false },
        patronymic: { type: 'varchar', notNull: false },
        date_of_birth: { type: 'date', notNull: false },
        id_passport_data: { type: 'int', notNull: false },
        id_registration_address: { type: 'int', notNull: false },
        delete_at: { type: 'varchar', notNull: false },
        update_at: { type: 'varchar', notNull: false },
        add_at: { type: 'varchar', notNull: false }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('employees');
};