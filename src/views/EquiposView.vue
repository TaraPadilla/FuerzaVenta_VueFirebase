<template>
    <v-container>
      <v-card class="pa-5">
        <v-card-title class="text-h5">Gestión de Equipos</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="guardarEquipo">
            <v-text-field
              v-model="nuevoEquipo.nombre"
              label="Nombre del equipo"
              required
            ></v-text-field>

            <v-select
                v-model="nuevoEquipo.zona_id"
                :items="zonas"
                item-title="nombre"
                item-value="id"
                label="Selecciona una Zona"
                required
            ></v-select>

            <v-text-field
              v-model="asesorTemporal"
              label="Agregar asesor (nombre y apellido)"
              append-inner-icon="mdi-plus"
              @click:append-inner="agregarAsesor"
            ></v-text-field>
  
            <v-chip-group v-if="nuevoEquipo.asesores.length">
              <v-chip
                v-for="(asesor, index) in nuevoEquipo.asesores"
                :key="index"
                closable
                @click:close="eliminarAsesor(index)"
              >
                {{ asesor }}
              </v-chip>
            </v-chip-group>
  
            <v-btn type="submit" color="primary" class="mt-4">
              {{ editando ? "Actualizar Equipo" : "Crear Equipo" }}
            </v-btn>
            <v-btn v-if="editando" color="grey" class="mt-4 ml-2" @click="cancelarEdicion">
              Cancelar
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
  
      <v-divider class="my-5"></v-divider>
  
      <v-card class="pa-5">
        <v-card-title class="text-h5">Lista de Equipos</v-card-title>
        <v-card-text>
          <v-row>
            <v-col v-for="equipo in equipos" :key="equipo.id" cols="12" sm="6" md="4" lg="3">
              <v-card class="pa-3">
                <v-card-title class="text-h6">{{ equipo.nombre }}</v-card-title>
                <v-card-subtitle>Zona: {{ equipo.zona_id }}</v-card-subtitle>
                <v-card-text>
                  <v-chip v-for="asesor in equipo.asesores" :key="asesor" class="ma-1">
                    {{ asesor }}
                  </v-chip>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="blue" @click="editarEquipo(equipo)">Editar</v-btn>
                  <v-btn color="red" @click="eliminarEquipo(equipo.id)">Eliminar</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-alert v-if="equipos.length === 0" type="info" class="mt-4">
            No hay equipos registrados.
          </v-alert>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
import { actualizarEquipo, crearEquipo, eliminarEquipo, obtenerEquipos, obtenerZonas } from "@/services/equiposService";
import { onMounted, ref } from "vue";
  
  export default {
    setup() {
      const equipos = ref([]);
      const editando = ref(false);
      const equipoEditandoId = ref(null);
      const nuevoEquipo = ref({ nombre: "", zona_id: "", asesores: [] });
      const asesorTemporal = ref("");
      const zonas = ref([]);

      const cargarEquipos = async () => {
        equipos.value = await obtenerEquipos();
      };
  
      const guardarEquipo = async () => {
        if (!nuevoEquipo.value.nombre || !nuevoEquipo.value.zona_id || nuevoEquipo.value.asesores.length === 0) {
          alert("Completa todos los campos y agrega al menos un asesor.");
          return;
        }
  
        if (editando.value) {
          await actualizarEquipo(equipoEditandoId.value, {
            nombre: nuevoEquipo.value.nombre,
            zona_id: nuevoEquipo.value.zona_id.toLowerCase().replace(/\s+/g, ""),
            asesores: nuevoEquipo.value.asesores
          });
        } else {
          await crearEquipo(
            nuevoEquipo.value.nombre,
            nuevoEquipo.value.zona_id,
            nuevoEquipo.value.asesores
          );
        }
  
        cancelarEdicion();
        cargarEquipos();
      };
  
      const agregarAsesor = () => {
        if (asesorTemporal.value.trim() !== "") {
          nuevoEquipo.value.asesores.push(asesorTemporal.value.trim());
          asesorTemporal.value = "";
        }
      };
  
      const eliminarAsesor = (index) => {
        nuevoEquipo.value.asesores.splice(index, 1);
      };
  
      const editarEquipo = (equipo) => {
        editando.value = true;
        equipoEditandoId.value = equipo.id;
        nuevoEquipo.value = {
          nombre: equipo.nombre,
          zona_id: equipo.zona_id,
          asesores: [...equipo.asesores]
        };
      };
  
      const cancelarEdicion = () => {
        editando.value = false;
        equipoEditandoId.value = null;
        nuevoEquipo.value = { nombre: "", zona_id: "", asesores: [] };
        asesorTemporal.value = "";
      };
  
      const eliminarEquipo = async (id) => {
        if (confirm("¿Seguro que deseas eliminar este equipo?")) {
          await eliminarEquipo(id);
          cargarEquipos();
        }
      };

      const cargarZonas = async () => {
        zonas.value = await obtenerZonas();
      };
  
      onMounted(() => {
        cargarEquipos();
        cargarZonas();
      });
  
      return {
        equipos,
        nuevoEquipo,
        asesorTemporal,
        editando,
        equipoEditandoId,
        guardarEquipo,
        agregarAsesor,
        eliminarAsesor,
        editarEquipo,
        cancelarEdicion,
        eliminarEquipo,
        zonas,          // 👈 Agregar la variable de zonas
    cargarZonas     // 👈 Por si necesitas recargar las zonas manualmente
      };
    },
  };
  </script>
  