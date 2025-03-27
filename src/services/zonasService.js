import { db } from "@/firebase"; // Ajusta la ruta según tu proyecto
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";

/**
 * Crea una nueva zona en Firestore
 * @param {string} nombre - Nombre de la zona (se almacenará en minúsculas y sin espacios)
 * @param {string} responsable - Responsable de la zona (opcional)
 */
export async function crearZona(nombre, responsable = "") {
    try {
        const idZona = nombre.toLowerCase().replace(/\s+/g, "");
        const zonaRef = doc(collection(db, "zonas"), idZona);

        await setDoc(zonaRef, {
            id: idZona,
            nombre: nombre,
            responsable: responsable
        });

        console.log("Zona creada con éxito");
    } catch (error) {
        console.error("Error al crear la zona:", error);
    }
}

/**
 * Obtiene todas las zonas de Firestore
 * @returns {Array} Lista de zonas
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

/**
 * Actualiza una zona en Firestore
 * @param {string} id - ID de la zona a actualizar
 * @param {Object} nuevosDatos - Datos actualizados de la zona
 */
export async function actualizarZona(id, nuevosDatos) {
    try {
        const zonaRef = doc(db, "zonas", id);
        await updateDoc(zonaRef, nuevosDatos);
        console.log("Zona actualizada con éxito");
    } catch (error) {
        console.error("Error al actualizar la zona:", error);
    }
}

/**
 * Elimina una zona de Firestore
 * @param {string} id - ID de la zona a eliminar
 */
export async function eliminarZona(id) {
    try {
        await deleteDoc(doc(db, "zonas", id));
        console.log("Zona eliminada con éxito");
    } catch (error) {
        console.error("Error al eliminar la zona:", error);
    }
}

export function obtenerNombreZona(zonaId, zonasLista) {
    if (!zonasLista || zonasLista.length === 0) return "Cargando...";
    const zona = zonasLista.find(z => z.id === zonaId);
    return zona ? zona.nombre : zonaId;
  }
