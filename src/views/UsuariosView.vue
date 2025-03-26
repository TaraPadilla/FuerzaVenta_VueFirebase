<template>
  <v-container>
      <v-card class="pa-5">
        <v-card-title class="text-h5">Gestión de Usuarios</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="guardarUsuario">
            <v-text-field v-model="nuevoUsuario.nombre" label="Nombre" required></v-text-field>
            <v-text-field v-model="nuevoUsuario.email" label="Email" required></v-text-field>
            <v-select v-model="nuevoUsuario.role" :items="['admin', 'supervisor']" label="Rol" required></v-select>
            <v-switch v-model="nuevoUsuario.activo" label="Activo" color="primary"></v-switch>
            <v-btn type="submit" color="primary" class="mt-4">
              {{ editando ? "Actualizar Usuario" : "Crear Usuario" }}
            </v-btn>
            <v-btn v-if="editando" color="grey" class="mt-4 ml-2" @click="cancelarEdicion">
              Cancelar
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
      
      <v-divider class="my-5"></v-divider>
      
      <v-card class="pa-5">
        <v-card-title class="text-h5">Lista de Usuarios</v-card-title>
        <v-card-text>
            <!-- Tabla para pantallas grandes -->
            <v-data-table
                v-if="!esMovil"
                :items="usuariosFiltrados"
                :headers="headers"
                class="elevation-1"
            >
                <template v-slot:item.activo="{ item }">
                <v-icon v-if="item.activo" color="green">mdi-check-circle</v-icon>
                <v-icon v-else color="red">mdi-close-circle</v-icon>
                </template>
                <template v-slot:item.acciones="{ item }">
                <v-btn icon @click="editarUsuario(item)" size="small"><v-icon>mdi-pencil</v-icon></v-btn>
                </template>
            </v-data-table>
            <!-- Tarjetas para móviles -->
            <v-row v-else>
                <v-col v-for="usuario in usuariosFiltrados" :key="usuario.id" cols="12">
                <v-card>
                    <v-card-title>{{ usuario.nombre }}</v-card-title>
                    <v-card-subtitle>{{ usuario.email }}</v-card-subtitle>
                    <v-card-text>
                    <p><strong>Rol:</strong> {{ usuario.role }}</p>
                    <p><strong>Estado:</strong> 
                        <v-icon v-if="usuario.activo" color="green">mdi-check-circle</v-icon>
                        <v-icon v-else color="red">mdi-close-circle</v-icon>
                    </p>
                    </v-card-text>
                    <v-card-actions>
                    <v-btn color="primary" @click="editarUsuario(usuario)">Editar</v-btn>
                    </v-card-actions>
                </v-card>
                </v-col>
            </v-row>
        </v-card-text>
      </v-card>
    </v-container>
</template>
  
  <script>
  import { actualizarUsuario, crearUsuario, obtenerUsuarios } from "@/services/usuariosService";
import { computed, onMounted, ref } from "vue";
  
  export default {
    setup() {
      const usuarios = ref([]);
      const editando = ref(false);
      const usuarioEditandoId = ref(null);
      const nuevoUsuario = ref({ nombre: "", email: "", role: "", zona: "", activo: true });
      const esMovil = ref(false);
      
      const headers = ref([
        { text: "Nombre", value: "nombre" },
        { text: "Email", value: "email" },
        { text: "Rol", value: "role" },
        { text: "Zona", value: "zona" },
        { text: "Activo", value: "activo" },
        { text: "Acciones", value: "acciones", sortable: false }
      ]);
      
      const usuariosFiltrados = computed(() => {
        return usuarios.value.filter(usuario => usuario);
      });
      
      const cargarUsuarios = async () => {
        usuarios.value = await obtenerUsuarios();
      };
  
      const guardarUsuario = async () => {
            if (!nuevoUsuario.value.nombre || !nuevoUsuario.value.email || !nuevoUsuario.value.role) {
                alert("Completa todos los campos.");
                return;
            }
            if (editando.value) {
                await actualizarUsuario(usuarioEditandoId.value, { ...nuevoUsuario.value, activo: Boolean(nuevoUsuario.value.activo) });
            } else {
                await crearUsuario(
                    nuevoUsuario.value.nombre,
                    nuevoUsuario.value.email,
                    nuevoUsuario.value.role,
                    Boolean(nuevoUsuario.value.activo) // Asegurar que sea booleano
                );
            }
            cancelarEdicion();
            cargarUsuarios();
        };

  
      const editarUsuario = (usuario) => {
        editando.value = true;
        usuarioEditandoId.value = usuario.id;
        nuevoUsuario.value = { ...usuario };
      };
  
      const cancelarEdicion = () => {
        editando.value = false;
        usuarioEditandoId.value = null;
        nuevoUsuario.value = { nombre: "", email: "", role: "", zona: "", activo: true };
      };
  
      const eliminarUsuario = async (id) => {
        if (confirm("¿Seguro que deseas eliminar este usuario?")) {
          await eliminarUsuario(id);
          cargarUsuarios();
        }
      };
  
      onMounted(() => {
        esMovil.value = window.innerWidth < 768; // Detecta si es móvil
        window.addEventListener("resize", () => {
            esMovil.value = window.innerWidth < 768;
        });
      });

      onMounted(cargarUsuarios);

      return {
        usuarios,
        usuariosFiltrados,
        nuevoUsuario,
        editando,
        usuarioEditandoId,
        headers,
        guardarUsuario,
        editarUsuario,
        cancelarEdicion,
        eliminarUsuario,
        esMovil,
      };
    }
  };
  </script>
  