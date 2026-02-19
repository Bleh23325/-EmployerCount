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
    pgm.createTable('passport_data', {
        id: { type: 'serial', primaryKey: true },
        series: { type: 'int', notNull: false },
        number: { type: 'int', notNull: false },
        date_of_issue: { type: 'date', notNull: false },
        unit_code: { type: 'int', notNull: false },
        issued_by_whom: { type: 'varchar', notNull: false }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('passport_data');
};