use db_pruebas;

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100) NULL,
    precio INT NOT NULL,
    descuento TINYINT UNSIGNED NOT NULL DEFAULT 0,
    iva TINYINT UNSIGNED NOT NULL DEFAULT 19,
    ruta_imagen varchar(256) not null,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fk_usuario INT NOT NULL,

    PRIMARY KEY (id),

    FOREIGN KEY (fk_usuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Pan de bono',
    'Panecillo tradicional elaborado con almidón de yuca, queso, huevos y harina de maíz.',
    4500,
    10,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Pandebono.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Pan aliñado',
    'Pan aliñado colombiano, suave y esponjoso, con delicioso sabor a queso y mantequilla.',
    2800,
    5,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Panaliñado.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Almojabana',
    'Almojábana colombiana suave y esponjosa, elaborada con queso y almidón de maíz.',
    3500,
    5,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Almojabana.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Pan de yuca',
    'Suave por dentro, crocante por fuera y elaborado con queso y almidón de yuca.',
    4500,
    8,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Pandeyuca.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Pan de queso',
    'Pan de queso colombiano, suave y esponjoso, con una deliciosa textura y sabor a queso.',
    2500,
    12,
    19,
    'C:\\frank\Imagenes\\panaderia\\Pandequeso.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Mogolla',
    'Crocante por fuera, suave por dentro y elaborado con queso, ideal para compartir.',
    1200,
    11,
    19,
    'C:\\frank\Imagenes\\panaderia\\Mogolla.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Buñuelos',
    'Crocante por fuera, suave por dentro y elaborado con queso, ideal para compartir.',
    1200,
    11,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Buñuelos.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Deditos',
    'Crujientes por fuera, suaves por dentro y rellenos de delicioso queso.',
    3000,
    10,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Palitosdequeso.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Roscón',
    'Tradicionalmente relleno de bocadillo de guayaba.',
    2500,
    10,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Roscón.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Pan de coco',
    'Suave y esponjoso, con un delicioso sabor dulce y aroma a coco.',
    2500,
    10,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Pandecoco.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Pastel de pollo',
    'Crujiente por fuera, con un delicioso relleno de pollo sazonado.',
    3000,
    10,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Pasteldepollo.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Pan de bono con bocadillo',
    'Suave y esponjoso, con queso y un dulce relleno de guayaba.',
    3500,
    15,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Pandebonoconbocadillo.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Pan francés',
    'Crujiente por fuera, suave por dentro y con una miga ligera y deliciosa.',
    2700,
    15,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Panfrancés.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Pan de leche',
    'Suave, esponjoso y ligeramente dulce, ideal para el desayuno o la merienda.',
    2700,
    15,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Pandeleche.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Pan con arequipe',
    'Suave, esponjoso y ligeramente dulce, ideal para el desayuno o la merienda.',
    2700,
    15,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Panconarequipe.png',
    CURRENT_TIMESTAMP,
    17
);


INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Galletas con avena',
    'Galletas de avena colombianas, crujientes y deliciosas, con un toque dulce y sabor casero.',
    2000,
    15,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Galletasconavena.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Pan tajado',
    'Pan tajado suave y esponjoso, ideal para preparar sándwiches, tostadas y deliciosos desayunos.',
    5000,
    10,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Pantajado.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Palmeritas',
    'Palmeritas colombianas de hojaldre, crujientes, doradas y dulces, ideales para acompañar el café.',
    1000,
    10,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Palmeritas.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Pan de maíz',
    'Pan de maíz colombiano, suave y esponjoso, con un delicioso sabor dulce y tradicional.',
    1800,
    10,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Pandemaiz.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Rollitos de queso',
    'Rollitos de queso colombianos, dorados y crujientes por fuera, suaves y deliciosos por dentro.',
    2600,
    4,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Rollitosdequeso.png',
    CURRENT_TIMESTAMP,
    17
);

INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    descuento,
    iva, 
    ruta_imagen,
    fecha_hora,
    fk_usuario
)
VALUES (
    'Croasan',
    'De hojaldre dorado y crujiente, con interior suave y delicioso sabor a mantequilla.',
    2800,
    5,
    19,
    'C:\\frank\\Imagenes\\panaderia\\Croasan.png',
    CURRENT_TIMESTAMP,
    17
);


