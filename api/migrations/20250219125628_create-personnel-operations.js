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
    pgm.createTable('personnel_operations', {
        id: { type: 'serial', primaryKey: true },
        id_employee: { type: 'int', notNull: false },
        id_department: { type: 'int', notNull: false },
        id_position: { type: 'int', notNull: false },
        setting_the_salary: { type: 'int', notNull: false },
        salary_change: { type: 'int', notNull: false },
        dismissal_from_work: { type: 'boolean', notNull: false },
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
    pgm.dropTable('personnel_operations');
};