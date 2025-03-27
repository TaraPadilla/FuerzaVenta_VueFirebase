// AsistenciaService.js
import { db } from "@/firebase";
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";

/**
 * Registra o crea una asistencia en Firestore.
 * @param {Object} asistenciaData - Objeto con los datos de la asistencia (zona_id, supervisor_id, equipo_id, etc.)
 */
  export async function crearAsistencia(asistenciaData) {
    try {
      const ahora = new Date();
      const fechaActual = `${ahora.getFullYear()}${String(ahora.getMonth() + 1).padStart(2, '0')}${String(ahora.getDate()).padStart(2, '0')}${String(ahora.getHours()).padStart(2, '0')}${String(ahora.getMinutes()).padStart(2, '0')}`;
      const nuevoId = `${asistenciaData.fecha.replaceAll('-', '')}_${asistenciaData.zona_id}_${asistenciaData.equipo_id}_${asistenciaData.supervisor_id}`;
      const asistenciasRef = collection(db, "asistencias");
      const querySnapshot = await getDocs(asistenciasRef);
      // Paso 2: Revisar si existe una asistencia con ese mismo ID
      for (const docu of querySnapshot.docs) {
        if (docu.id === nuevoId) {
          // Paso 3: Renombrar (crear con ID nuevo) y desactivar la anterior
          const dataAnterior = docu.data();
          const nuevoIdViejo = `${docu.id}_${fechaActual}`;
          const nuevaRef = doc(db, "asistencias", nuevoIdViejo);
          await setDoc(nuevaRef, {
            ...dataAnterior,
            activo: false,
            fecha_desactivado: fechaActual
          });
          // Opcional: eliminar la anterior si no quieres duplicado
          await deleteDoc(doc(db, "asistencias", docu.id));
        }
      }
      // Paso 4: Guardar la nueva asistencia con el nuevoId
      const nuevaAsistenciaRef = doc(db, "asistencias", nuevoId);
      await setDoc(nuevaAsistenciaRef, {
        ...asistenciaData,
        fecha_creacion: fechaActual,
        activo: true
      });
      console.log("Asistencia registrada con ID único:", nuevoId);
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
    }
  }


/**
 * Obtiene todas las asistencias desde Firestore (opcional, por si necesitas listarlas).
 * @returns {Array} Lista de asistencias
 */
export async function obtenerAsistencias() {
  try {
    const querySnapshot = await getDocs(collection(db, "asistencias"));
    let asistencias = [];
    querySnapshot.forEach((doc) => {
      asistencias.push({ id: doc.id, ...doc.data() });
    });
    return asistencias;
  } catch (error) {
    console.error("Error al obtener las asistencias:", error);
    return [];
  }
}

/**
 * Actualiza una asistencia en Firestore.
 * @param {string} id - ID del documento de asistencia a actualizar.
 * @param {Object} nuevosDatos - Datos actualizados de la asistencia.
 */
export async function actualizarAsistencia(id, nuevosDatos) {
    try {
      const asistenciaRef = doc(db, "asistencias", id);
      await updateDoc(asistenciaRef, nuevosDatos);
      console.log("Asistencia actualizada con éxito");
    } catch (error) {
      console.error("Error al actualizar la asistencia:", error);
    }
  }

  export function obtenerNombreZona(zonaId, zonasLista) {
    if (!zonasLista || zonasLista.length === 0) return "Cargando...";
    const zona = zonasLista.find(z => z.id === zonaId);
    return zona ? zona.nombre : zonaId;
  }
  
