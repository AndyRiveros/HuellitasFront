export default interface Mascota {
  id?: number;
  nombre: string;
  especie: string;
  raza?: string;
  edad?: number;
  etapa?: string;
  tipo?: string;
  imagen?: string | File;
}