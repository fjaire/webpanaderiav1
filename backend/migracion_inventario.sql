use db_pruebas;

CREATE TABLE
    inventarios (
        producto_id INT NOT NULL,
        cantidad_disponible INT UNSIGNED NOT NULL DEFAULT 0,
        cantidad_reservada INT UNSIGNED NOT NULL DEFAULT 0,
        cantidad_minima INT UNSIGNED NOT NULL DEFAULT 0,
        cantidad_maxima INT UNSIGNED NOT NULL,
        nivel_reorden INT UNSIGNED NOT NULL DEFAULT 0,
        actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        usuario_id INT NOT NULL,
        PRIMARY KEY (producto_id),
        CONSTRAINT fk_inventarios_producto FOREIGN KEY (producto_id) REFERENCES productos (id),
        CONSTRAINT fk_inventarios_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
        CONSTRAINT chk_inventarios_cantidad_maxima CHECK (cantidad_maxima >= cantidad_minima)
    ) ENGINE = InnoDB;

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        1, -- producto_id
        50, -- cantidad_disponible
        0, -- cantidad_reservada
        10, -- cantidad_minima
        100, -- cantidad_maxima
        15, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        2, -- producto_id
        40, -- cantidad_disponible
        0, -- cantidad_reservada
        12, -- cantidad_minima
        110, -- cantidad_maxima
        10, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        3, -- producto_id
        60, -- cantidad_disponible
        0, -- cantidad_reservada
        10, -- cantidad_minima
        120, -- cantidad_maxima
        15, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        4, -- producto_id
        70, -- cantidad_disponible
        0, -- cantidad_reservada
        20, -- cantidad_minima
        100, -- cantidad_maxima
        20, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        5, -- producto_id
        80, -- cantidad_disponible
        0, -- cantidad_reservada
        10, -- cantidad_minima
        90, -- cantidad_maxima
        10, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        6, -- producto_id
        70, -- cantidad_disponible
        0, -- cantidad_reservada
        14, -- cantidad_minima
        60, -- cantidad_maxima
        20, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        7, -- producto_id
        44, -- cantidad_disponible
        0, -- cantidad_reservada
        15, -- cantidad_minima
        90, -- cantidad_maxima
        12, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        9, -- producto_id
        100, -- cantidad_disponible
        0, -- cantidad_reservada
        15, -- cantidad_minima
        50, -- cantidad_maxima
        10, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        10, -- producto_id
        50, -- cantidad_disponible
        0, -- cantidad_reservada
        10, -- cantidad_minima
        50, -- cantidad_maxima
        15, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        11, -- producto_id
        35, -- cantidad_disponible
        0, -- cantidad_reservada
        12, -- cantidad_minima
        90, -- cantidad_maxima
        10, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        12, -- producto_id
        55, -- cantidad_disponible
        0, -- cantidad_reservada
        10, -- cantidad_minima
        80, -- cantidad_maxima
        10, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        13, -- producto_id
        49, -- cantidad_disponible
        0, -- cantidad_reservada
        10, -- cantidad_minima
        70, -- cantidad_maxima
        10, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        14, -- producto_id
        74, -- cantidad_disponible
        0, -- cantidad_reservada
        14, -- cantidad_minima
        50, -- cantidad_maxima
        10, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        15, -- producto_id
        50, -- cantidad_disponible
        0, -- cantidad_reservada
        10, -- cantidad_minima
        70, -- cantidad_maxima
        10, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        18, -- producto_id
        70, -- cantidad_disponible
        0, -- cantidad_reservada
        10, -- cantidad_minima
        90, -- cantidad_maxima
        10, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        19, -- producto_id
        80, -- cantidad_disponible
        0, -- cantidad_reservada
        20, -- cantidad_minima
        100, -- cantidad_maxima
        10, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        20, -- producto_id
        60, -- cantidad_disponible
        0, -- cantidad_reservada
        30, -- cantidad_minima
        90, -- cantidad_maxima
        10, -- nivel_reorden
        17 -- usuario_id
    );

INSERT INTO
    inventarios (
        producto_id,
        cantidad_disponible,
        cantidad_reservada,
        cantidad_minima,
        cantidad_maxima,
        nivel_reorden,
        usuario_id
    )
VALUES
    (
        21, -- producto_id
        50, -- cantidad_disponible
        0, -- cantidad_reservada
        70, -- cantidad_minima
        90, -- cantidad_maxima
        10, -- nivel_reorden
        17 -- usuario_id
    );