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
    pgm.createTable('departments', {
        id: { type: 'serial', primaryKey: true },
        id_organization: { type: 'int', notNull: false },
        parent: { type: 'int', notNull: false },
        name: { type: 'varchar', notNull: false },
        comment: { type: 'text', notNull: false },
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
    pgm.dropTable('departments');
};