export interface Student {
  id?: number | string;
  teacher_id?: number;
  teacherId?: number;
  pfp?: string;

  // English-style fields
  name?: string;
  firstName?: string;
  lastName?: string;
  password?: string;

  // Spanish-style legacy fields
  nombre?: string;
  apellidoP?: string;
  apellidoM?: string;
  contraseña?: string;
}