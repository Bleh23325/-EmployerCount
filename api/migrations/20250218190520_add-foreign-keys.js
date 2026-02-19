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
    //связь employees с passport_data (один к одному)
    pgm.addConstraint('employees', 'employees_id_passport_data_fkey', {
        foreignKeys: {
            columns: 'id_passport_data',
            references: 'passport_data(id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }
    });

    //связь employees с registration_address
    pgm.addConstraint('employees', 'employees_id_registration_address_fkey', {
        foreignKeys: {
            columns: 'id_registration_address',
            references: 'registration_address(id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }
    });

    //связь files с employees (один ко многим)
    pgm.addConstraint('files', 'files_id_employees_fkey', {
        foreignKeys: {
            columns: 'id_employees',
            references: 'employees(id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    // Удаляем внешние ключи в обратном порядке
    pgm.dropConstraint('files', 'files_id_employees_fkey');
    pgm.dropConstraint('employees', 'employees_id_registration_address_fkey');
    pgm.dropConstraint('employees', 'employees_id_passport_data_fkey');
};