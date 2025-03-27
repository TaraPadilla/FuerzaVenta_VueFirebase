import { db } from "@/firebase"; // Asegúrate de que la ruta sea correcta
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";

/**
 * Crea un nuevo equipo en Firestore
 * @param {string} nombre - Nombre del equipo (se almacenará en minúsculas y sin espacios)
 * @param {string} zonaId - ID de la zona a la que pertenece el equipo (también en minúsculas y sin espacios)
 * @param {Array} asesores - Lista de asesores con nombre y apellido
 */
export async function crearEquipo(nombre, zonaId, asesores) {
    try {
        const idEquipo = nombre.toLowerCase().replace(/\s+/g, "_"); // Convertir a minúsculas y quitar espacios
        const zonaIdFormato = zonaId.toLowerCase().replace(/\s+/g, ""); // Mismo formato para zona_id

        const equipoRef = doc(collection(db, "equipos"), idEquipo);

        await setDoc(equipoRef, {
            id: idEquipo,
            nombre: nombre, // Guardar en minúsculas sin espacios
            zona_id: zonaIdFormato,
            asesores: asesores.map(asesor => asesor.trim()) // Asegurar formato correcto
        });

        console.log("Equipo creado con éxito");
    } catch (error) {
        console.error("Error al crear el equipo:", error);
    }
}

/**
 * Obtiene todos los equipos de Firestore
 * @returns {Array} Lista de equipos
 */
export async function obtenerEquipos() {
    try {
        const querySnapshot = await getDocs(collection(db, "equipos"));
        let equipos = [];

        querySnapshot.forEach(doc => {
            equipos.push({ id: doc.id, ...doc.data() });
        });

        return equipos;
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
        return [];
    }
}

/**
 * Actualiza un equipo en Firestore
 * @param {string} id - ID del equipo a actualizar
 * @param {Object} nuevosDatos - Datos actualizados del equipo
 */
export async function actualizarEquipo(id, nuevosDatos) {
    try {
        const equipoRef = doc(db, "equipos", id);

        await updateDoc(equipoRef, nuevosDatos);
        console.log("Equipo actualizado con éxito");
    } catch (error) {
        console.error("Error al actualizar el equipo:", error);
    }
}

/**
 * Elimina un equipo de Firestore
 * @param {string} id - ID del equipo a eliminar
 */
export async function eliminarEquipo(id) {
    try {
        await deleteDoc(doc(db, "equipos", id));
        console.log("Equipo eliminado con éxito");
    } catch (error) {
        console.error("Error al eliminar el equipo:", error);
    }
}

/**
 * Obtiene todas las zonas desde Firestore
 * @returns {Array} Lista de zonas con id y nombre
 */
export async function obtenerZonas() {
    try {
        const querySnapshot = await getDocs(collection(db, "zonas"));
        let zonas = [];

        querySnapshot.forEach(doc => {
            zonas.push({ id: doc.id, ...doc.data() });
        });

        return zonas;
    } catch (error) {
        console.error("Error al obtener las zonas:", error);
        return [];
    }
}

export function obtenerNombreEquipo(equipoId, equiposLista) {
    if (!equiposLista || equiposLista.length === 0) return "Cargando...";
    const equipo = equiposLista.find(z => z.id === equipoId);
    return equipo ? equipo.nombre : equipoId;
  }

