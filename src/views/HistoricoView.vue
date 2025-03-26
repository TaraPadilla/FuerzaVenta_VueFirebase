<template>
  <v-container>
    <h2>Histórico de Asistencias</h2>

    <!-- Filtros -->
    <v-row class="d-flex flex-wrap">
      <v-col cols="12" sm="6" md="3">
        <v-text-field label="Fecha Inicio" v-model="filtros.fechaInicio" type="date" outlined dense />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field label="Fecha Fin" v-model="filtros.fechaFin" type="date" outlined dense />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select label="Zona" v-model="filtros.zona" :items="zonas" item-title="nombre" item-value="id" outlined dense />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select label="Equipo" v-model="filtros.equipo" :items="equipos" item-title="nombre" item-value="id" outlined dense />
      </v-col>
    </v-row>

    <!-- Tabla de Asistencias -->
    <v-data-table :items="asistenciasFiltradas" :headers="headers" dense>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Listado de Asistencias</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:item.fecha="{ item }">
        {{ item.fecha }}
      </template>
      <template v-slot:item.equipo_nombre="{ item }">
        {{ item.equipo_nombre }}
      </template>
      <template v-slot:item.supervisor_id="{ item }">
        {{ item.supervisor_id }}
      </template>
      <template v-slot:item.asesores_dia="{ item }">
        {{ item.asesores_dia.join(', ') }}
      </template>
      <template v-slot:item.zona_id="{ item }">
        {{ item.zona_id }}
      </template>
      <template v-slot:item.foto_url="{ item }">
        <v-btn color="primary" @click="verFoto(item.foto_url)">Ver Foto</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { obtenerAsistencias } from "@/services/asistenciaService";
import { obtenerEquipos } from "@/services/equiposService";
import { obtenerZonas } from "@/services/zonasService";
import { computed, onMounted, ref } from "vue";

export default {
  setup() {
    const asistencias = ref([]);
    const equipos = ref([]);
    const zonas = ref([]);
    const filtros = ref({ fechaInicio: "", fechaFin: "", zona: "", equipo: "" });

    const headers = [
      { text: "Fecha", value: "fecha" },
      { text: "Nombre de Equipo", value: "equipo_nombre" },
      { text: "Supervisor", value: "supervisor_id" },
      { text: "Asesores", value: "asesores_dia" },
      { text: "Zona", value: "zona_id" },
      { text: "Ver Foto", value: "foto_url", sortable: false }
    ];

    const cargarDatos = async () => {
      asistencias.value = await obtenerAsistencias();
      equipos.value = await obtenerEquipos();
      zonas.value = await obtenerZonas();
    };

    const asistenciasFiltradas = computed(() => {
      return asistencias.value.filter(asistencia => {
        return (
          (!filtros.value.fechaInicio || asistencia.fecha >= filtros.value.fechaInicio) &&
          (!filtros.value.fechaFin || asistencia.fecha <= filtros.value.fechaFin) &&
          (!filtros.value.zona || asistencia.zona_id === filtros.value.zona) &&
          (!filtros.value.equipo || asistencia.equipo_id === filtros.value.equipo)
        );
      });
    });

    const verFoto = (url) => {
      window.open(url, "_blank");
    };

    onMounted(cargarDatos);

    return { 
      asistencias, 
      equipos, 
      zonas, 
      filtros, 
      headers, 
      asistenciasFiltradas, 
      verFoto
    };
  }
};
</script>
