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
    pgm.createTable('registration_address', {
        id: { type: 'serial', primaryKey: true },
        region: { type: 'varchar', notNull: false },
        locality: { type: 'varchar', notNull: false },
        street: { type: 'varchar', notNull: false },
        house: { type: 'varchar', notNull: false },
        building: { type: 'int', notNull: false },
        apartament: { type: 'int', notNull: false }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('registration_address');
};