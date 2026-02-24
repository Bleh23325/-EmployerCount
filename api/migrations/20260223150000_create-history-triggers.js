exports.up = (pgm) => {

  pgm.createFunction(
    'log_history_changes',
    [],
    {
      returns: 'trigger',
      language: 'plpgsql'
    },
    `
    DECLARE
        object_name text;
        user_id int;
        key text;
        old_val jsonb;
        new_val jsonb;
        diff jsonb := '{}'::jsonb;
    BEGIN

        object_name := TG_TABLE_NAME;

        -- получаем id пользователя из сессии
        BEGIN
            user_id := current_setting('my.user_id', true)::int;
        EXCEPTION
            WHEN others THEN
                user_id := NULL;
        END;

        -- ===== INSERT =====
        IF (TG_OP = 'INSERT') THEN

            INSERT INTO history_of_change (
                who_changed_it,
                the_object_of_operation,
                changed_fields,
                add_at,
                update_at,
                delete_at
            )
            VALUES (
                user_id,
                object_name || ' (INSERT)',
                to_jsonb(NEW),
                now(),
                NULL,
                NULL
            );

            RETURN NEW;

        -- ===== UPDATE =====
        ELSIF (TG_OP = 'UPDATE') THEN

            FOR key IN SELECT jsonb_object_keys(to_jsonb(NEW))
            LOOP
                old_val := to_jsonb(OLD)->key;
                new_val := to_jsonb(NEW)->key;

                IF old_val IS DISTINCT FROM new_val THEN
                    diff := diff || jsonb_build_object(
                        key,
                        jsonb_build_object(
                            'old', old_val,
                            'new', new_val
                        )
                    );
                END IF;
            END LOOP;

            INSERT INTO history_of_change (
                who_changed_it,
                the_object_of_operation,
                changed_fields,
                add_at,
                update_at,
                delete_at
            )
            VALUES (
                user_id,
                object_name || ' (UPDATE)',
                diff,
                NULL,
                now(),
                NULL
            );

            RETURN NEW;

        -- ===== DELETE =====
        ELSIF (TG_OP = 'DELETE') THEN

            INSERT INTO history_of_change (
                who_changed_it,
                the_object_of_operation,
                changed_fields,
                add_at,
                update_at,
                delete_at
            )
            VALUES (
                user_id,
                object_name || ' (DELETE)',
                to_jsonb(OLD),
                NULL,
                NULL,
                now()
            );

            RETURN OLD;

        END IF;

        RETURN NULL;
    END;
    `
  );

  // ===== TRIGGERS =====

  pgm.createTrigger('roles', 'roles_history_trigger', {
    when: 'AFTER',
    operation: ['INSERT', 'UPDATE', 'DELETE'],
    function: 'log_history_changes'
  });

  pgm.createTrigger('auth_users', 'auth_users_history_trigger', {
    when: 'AFTER',
    operation: ['INSERT', 'UPDATE', 'DELETE'],
    function: 'log_history_changes'
  });

  pgm.createTrigger('specialist', 'specialist_history_trigger', {
    when: 'AFTER',
    operation: ['INSERT', 'UPDATE', 'DELETE'],
    function: 'log_history_changes'
  });

};

exports.down = (pgm) => {

  pgm.dropTrigger('roles', 'roles_history_trigger');
  pgm.dropTrigger('auth_users', 'auth_users_history_trigger');
  pgm.dropTrigger('specialist', 'specialist_history_trigger');

  pgm.dropFunction('log_history_changes', []);

};