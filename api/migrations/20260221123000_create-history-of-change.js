exports.up = (pgm) => {
    pgm.createTable('history_of_change', {
        id: { type: 'serial', primaryKey: true },
        date_and_time_of_the_operation: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        who_changed_it: { type: 'int', references: 'specialist(id)', onDelete: 'SET NULL', onUpdate: 'CASCADE' },
        the_object_of_operation: { type: 'varchar(255)', notNull: true },
        changed_fields: { type: 'jsonb' },
        add_at: { type: 'timestamp' },
        update_at: { type: 'timestamp' },
        delete_at: { type: 'timestamp' }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('history_of_change');
};
