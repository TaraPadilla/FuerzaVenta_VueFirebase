import { db } from "@/firebase";
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";

/**
 * Crea un nuevo usuario en Firestore
 * @param {string} nombre - Nombre del usuario
 * @param {string} email - Email del usuario
 * @param {string} role - Rol del usuario ("admin" o "supervisor")
 * @param {boolean} activo - Estado del usuario (activo o deshabilitado)
 */
export async function crearUsuario(documento, tipo, nombre, email, role, activo = true) {
    try {
        const idUsuario = String(documento); // el ID del documento debe ser string

        const usuarioRef = doc(collection(db, "usuarios"), idUsuario);
        await setDoc(usuarioRef, {
            idUsuario,
            documento,
            tipo,
            nombre,
            email,
            role,
            fecha_creacion: new Date().toISOString(),
            activo: Boolean(activo)
        });

        console.log("Usuario creado con éxito");
    } catch (error) {
        console.error("Error al crear el usuario:", error);
    }
}

/**
 * Obtiene todos los usuarios de Firestore
 * @returns {Array} Lista de usuarios
 */
export async function obtenerUsuarios() {
    try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        let usuarios = [];
        querySnapshot.forEach(doc => {
            usuarios.push({ id: doc.id, ...doc.data() });
        });

        console.log("Usuarios obtenidos:", usuarios);
        return usuarios;
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        return [];
    }
}

/**
 * Actualiza un usuario en Firestore
 * @param {string} id - ID del usuario a actualizar
 * @param {Object} nuevosDatos - Datos actualizados del usuario
 */
export async function actualizarUsuario(id, nuevosDatos) {
    try {
        const usuarioRef = doc(db, "usuarios", id);
        await updateDoc(usuarioRef, nuevosDatos);
        console.log("Usuario actualizado con éxito");
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
    }
}

/**
 * Elimina un usuario de Firestore
 * @param {string} id - ID del usuario a eliminar
 */
export async function eliminarUsuario(id) {
    try {
        await deleteDoc(doc(db, "usuarios", id));
        console.log("Usuario eliminado con éxito");
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
    }
}

export async function obtenerUsuariosSupervisores() {
    try {
        const usuariosRef = collection(db, "usuarios");
        const q = query(usuariosRef, where("role", "==", "Supervisor"));
        const querySnapshot = await getDocs(q);

        let usuarios = [];
        querySnapshot.forEach(doc => {
            usuarios.push({ id: doc.id, ...doc.data() });
        });

        console.log("Supervisores obtenidos:", usuarios);
        return usuarios;
    } catch (error) {
        console.error("Error al obtener los supervisores:", error);
        return [];
    }
}

export function obtenerNombreSupervisor(SupervisorId, SupervisorLista) {
    if (!SupervisorLista || SupervisorLista.length === 0) return "Cargando...";
    const supervisor = SupervisorLista.find(z => z.id === SupervisorId);
    return supervisor ? supervisor.nombre : SupervisorId;
  }
