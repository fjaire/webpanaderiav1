-- Requisitos para crear/vincular usuarios mediante OAuth.
-- Ejecutar una vez en MySQL:  source migracion_oauth.sql

USE db_pruebas;

-- El backend crea cuentas OAuth con password_hash = NULL. Agrega la columna
-- solo cuando todavía no existe, para que esta migración pueda repetirse.
SET @tiene_password_hash = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'usuarios'
      AND COLUMN_NAME = 'password_hash'
);
SET @sql_password_hash = IF(
    @tiene_password_hash = 0,
    'ALTER TABLE usuarios ADD COLUMN password_hash VARCHAR(255) NULL',
    'SELECT 1'
);
PREPARE migracion_password_hash FROM @sql_password_hash;
EXECUTE migracion_password_hash;
DEALLOCATE PREPARE migracion_password_hash;

CREATE TABLE IF NOT EXISTS usuarios_oauth (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    proveedor VARCHAR(20) NOT NULL,          -- 'google' | 'microsoft' | 'facebook'
    proveedor_id VARCHAR(255) NOT NULL,      -- sub (Google), oid (Microsoft), id (Facebook)
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_proveedor_proveedor_id (proveedor, proveedor_id),
    UNIQUE KEY uq_usuario_proveedor (usuario_id, proveedor),
    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
