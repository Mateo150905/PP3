-- 1. cuantos alumnos tiene cada materia
select m.nombre as materia, count(i.id_alumno) as cantidad_alumnos
from materias m
left join inscripciones i on m.id = i.id_materia
group by m.id, m.nombre;

-- 2. cuantos alumnos tiene cada carrera
select c.nombre as carrera, count(a.id) as cantidad_alumnos
from carreras c
left join alumnos a on c.id = a.id_carrera
group by c.id, c.nombre;

-- 3. modificaciones para guardar las notas
create table if not exists notas (
    id integer primary key autoincrement,
    id_alumno integer,
    id_materia integer,
    valor real not null, 
    descripcion text,    
    fecha datetime default current_timestamp,
    foreign key (id_alumno, id_materia) references inscripciones(id_alumno, id_materia) on delete cascade
);

-- 4.
-- agregar fecha de nacimiento a alumnos
alter table alumnos add column fecha_nacimiento date;

-- agregar nota de aprobacion a materias
alter table materias add column nota_aprobacion real;
