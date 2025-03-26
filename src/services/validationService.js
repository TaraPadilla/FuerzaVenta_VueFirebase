export const nombresAmigables = {
    zona_id: "Zona",
    supervisor_id: "Supervisor",
    equipo_id: "Equipo",
    asesores_dia: "Asesores",
    fecha: "Fecha",
    hora_entrada: "Hora de Entrada",
    hora_salida: "Hora de Salida"
  };

export const reglasAsistencia = {
    zona_id: { requerido: true, tipo: "string" },
    supervisor_id: { requerido: true, tipo: "string" },
    equipo_id: { requerido: true, tipo: "string" },
    asesores_dia: { requerido: true, tipo: "array", min: 1 },
    fecha: { requerido: true, tipo: "string" },
    hora_entrada: { requerido: true, tipo: "string" },
    hora_salida: { requerido: true, tipo: "string" }
  };
  
  export function validarAsistencia(datos) {
    const errores = {};
  
    Object.keys(reglasAsistencia).forEach((campo) => {
      const regla = reglasAsistencia[campo];
      const valor = datos[campo];
  
      const esVacio =
        valor === null ||
        valor === undefined ||
        (typeof valor === "string" && valor.trim() === "") ||
        (Array.isArray(valor) && valor.length === 0);
  
      if (regla.requerido && esVacio) {
        errores[campo] = "Este campo es obligatorio.";
        return;
      }
  
      if (regla.tipo === "array" && Array.isArray(valor) && regla.min !== undefined) {
        if (valor.length < regla.min) {
          errores[campo] = `Debe contener al menos ${regla.min} elemento(s).`;
        }
      }
    });
  
    return errores;
  }
  