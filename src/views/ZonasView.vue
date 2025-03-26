<template>
    <v-container>
      <v-card>
        <v-card-title>Gestión de Zonas</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="zona.nombre" label="Nombre de la zona" required></v-text-field>
            <v-text-field v-model="zona.responsable" label="Responsable (opcional)"></v-text-field>
            <v-btn color="primary" @click="guardarZona">Guardar</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
  
      <v-list>
        <v-list-item v-for="zona in zonas" :key="zona.id">
          <v-list-item-content>
            <v-list-item-title>{{ zona.nombre }}</v-list-item-title>
            <v-list-item-subtitle>{{ zona.responsable || 'Sin responsable' }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon @click="editarZona(zona)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn icon @click="eliminarZona(zona.id)"><v-icon>mdi-delete</v-icon></v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-container>
  </template>
  
  <script>
  import { actualizarZona, crearZona, eliminarZona, obtenerZonas } from '@/services/zonasService';
import { onMounted, ref } from 'vue';
  
  export default {
    setup() {
      const zonas = ref([]);
      const zona = ref({ id: '', nombre: '', responsable: '' });
      
      const cargarZonas = async () => {
        zonas.value = await obtenerZonas();
      };
      
      const guardarZona = async () => {
        if (zona.value.id) {
          await actualizarZona(zona.value.id, zona.value);
        } else {
          await crearZona(zona.value.nombre, zona.value.responsable);
        }
        zona.value = { id: '', nombre: '', responsable: '' };
        cargarZonas();
      };
      
      const editarZona = (data) => {
        zona.value = { ...data };
      };
      
      const eliminarZonaHandler = async (id) => {
        await eliminarZona(id);
        cargarZonas();
      };
      
      onMounted(cargarZonas);
      
      return { zonas, zona, guardarZona, editarZona, eliminarZona: eliminarZonaHandler };
    }
  };
  </script>
  