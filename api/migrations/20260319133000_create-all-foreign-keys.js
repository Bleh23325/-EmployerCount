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
    pgm.addConstraint('employees', 'employees_id_passport_data_fkey', {
        foreignKeys: {
            columns: 'id_passport_data',
            references: 'passport_data(id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }
    });

    pgm.addConstraint('employees', 'employees_id_registration_address_fkey', {
        foreignKeys: {
            columns: 'id_registration_address',
            references: 'registration_address(id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }
    });

    pgm.addConstraint('files', 'files_id_employees_fkey', {
        foreignKeys: {
            columns: 'id_employees',
            references: 'employees(id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    });

    pgm.addConstraint('departments', 'departments_id_organization_fkey', {
        foreignKeys: {
            columns: 'id_organization',
            references: 'organizations(id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    });

    pgm.addConstraint('departments', 'departments_parent_fkey', {
        foreignKeys: {
            columns: 'parent',
            references: 'departments(id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }
    });

    pgm.addConstraint('personnel_operations', 'personnel_operations_id_department_fkey', {
        foreignKeys: {
            columns: 'id_department',
            references: 'departments(id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }
    });

    pgm.addConstraint('personnel_operations', 'personnel_operations_id_position_fkey', {
        foreignKeys: {
            columns: 'id_position',
            references: 'positions(id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }
    });
    
    pgm.addConstraint('personnel_operations', 'personnel_operations_id_employee_fkey', {
        foreignKeys: {
            columns: 'id_employee',
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
    pgm.dropConstraint('personnel_operations', 'personnel_operations_id_employee_fkey');
    pgm.dropConstraint('personnel_operations', 'personnel_operations_id_position_fkey');
    pgm.dropConstraint('personnel_operations', 'personnel_operations_id_department_fkey');
    pgm.dropConstraint('departments', 'departments_parent_fkey');
    pgm.dropConstraint('departments', 'departments_id_organization_fkey');
    pgm.dropConstraint('files', 'files_id_employees_fkey');
    pgm.dropConstraint('employees', 'employees_id_registration_address_fkey');
    pgm.dropConstraint('employees', 'employees_id_passport_data_fkey');
};