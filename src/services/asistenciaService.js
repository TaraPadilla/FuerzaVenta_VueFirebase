// AsistenciaService.js
import { db } from "@/firebase";
import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";

/**
 * Registra o crea una asistencia en Firestore.
 * @param {Object} asistenciaData - Objeto con los datos de la asistencia (zona_id, supervisor_id, equipo_id, etc.)
 */
export async function crearAsistencia(asistenciaData) {
  try {
    // Generamos un nuevo documento en la colección "asistencias"
    const id = `asistencia_${asistenciaData.fecha.replaceAll('-', '')}_${asistenciaData.equipo_id}`;
    const asistenciaRef = doc(db, "asistencias", id);
    await setDoc(asistenciaRef, {
      ...asistenciaData,
      id: id,
      activo: Boolean(true)
    });
    console.log("Asistencia creada con éxito");
  } catch (error) {
    console.error("Error al crear la asistencia:", error);
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
