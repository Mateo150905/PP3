-- habilitar claves foraneas en SQLite
PRAGMA foreign_keys = ON;

-- tabla de carreras
CREATE TABLE IF NOT EXISTS carreras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);

-- tabla de profesores
CREATE TABLE IF NOT EXISTS profesores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

-- tabla de alumnos
CREATE TABLE IF NOT EXISTS alumnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    id_carrera INTEGER,
    FOREIGN KEY (id_carrera) REFERENCES carreras(id) ON DELETE SET NULL
);

-- tabla de materias
CREATE TABLE IF NOT EXISTS materias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    id_carrera INTEGER,
    id_profesor INTEGER,
    FOREIGN KEY (id_carrera) REFERENCES carreras(id) ON DELETE CASCADE,
    FOREIGN KEY (id_profesor) REFERENCES profesores(id) ON DELETE CASCADE
);

-- tabla de inscripciones 
CREATE TABLE IF NOT EXISTS inscripciones (
    id_alumno INTEGER,
    id_materia INTEGER,
    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_alumno, id_materia),
    FOREIGN KEY (id_alumno) REFERENCES alumnos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_materia) REFERENCES materias(id) ON DELETE CASCADE
);

-- datos ej
INSERT INTO carreras (nombre) VALUES ('Ingeniería en Sistemas'), ('Licenciatura en Administración');

INSERT INTO profesores (nombre, apellido, email) VALUES 
('Juan', 'Pérez', 'juan.perez@universidad.edu'),
('María', 'García', 'maria.garcia@universidad.edu');

INSERT INTO alumnos (nombre, apellido, email, id_carrera) VALUES 
('Carlos', 'López', 'carlos.lopez@alumnos.edu', 1),
('Ana', 'Martínez', 'ana.martinez@alumnos.edu', 1),
('Beto', 'Rodríguez', 'beto.rodriguez@alumnos.edu', 2);

INSERT INTO materias (nombre, id_carrera, id_profesor) VALUES 
('Programación I', 1, 1),
('Bases de Datos', 1, 1),
('Contabilidad General', 2, 2);

INSERT INTO inscripciones (id_alumno, id_materia) VALUES 
(1, 1), (1, 2), (2, 1), (3, 3);
