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
    <v-row>
      <v-col cols="12" sm="6" md="3" class="d-flex align-end">
        <v-btn label="Generar Informe" color="primary" @click="irAInforme" >
          Imprimir
        </v-btn>
      </v-col>    
      <v-col cols="12" sm="6" md="3" class="d-flex align-end ">
        <v-btn color="secondary" @click="limpiarFiltros" block>
          Limpiar Filtros
        </v-btn>
      </v-col>
    </v-row>

    <!-- Tabla de Asistencias -->
    <v-data-table :items="asistenciasFiltradas" :headers="headers" dense>
      <template v-slot:body.prepend>
        <tr>
          <th v-for="header in headers" :key="header.value">
          {{ header.text }}
          </th>
        </tr>
      </template>
      <template v-slot:item.fecha="{ item }">
        {{ item.fecha }}
      </template>
      <template v-slot:item.equipo_id="{ item }">
        {{ obtenerNombreEquipo(item.equipo_id,equipos) }}
      </template>
      <template v-slot:item.supervisor_id="{ item }">
        {{ item.supervisor_id }}
      </template>
      <template v-slot:item.asesores_dia="{ item }">
        {{ item.asesores_dia.join(', ') }}
      </template>
      <template v-slot:item.zona_id="{ item }">
        {{ obtenerNombreZona(item.zona_id,zonas) }}
      </template>
      <template v-slot:item.foto_url="{ item }">
        <v-btn color="primary" @click="verRegistro(item)">Ver Registro</v-btn>
      </template>
    </v-data-table>
    <ConfirmarAsistenciaDialog
        v-if="dialogVista && asistenciaVista"
        v-model="dialogVista"
        :asistencia="asistenciaVista"
        :fotoPreview="asistenciaVista?.foto_url"
        :zonas="zonas"
        :equipos="equipos"
        :supervisores="zonas" 
        :soloVista="true"
      />
  </v-container>
</template>

<script>
import ConfirmarAsistenciaDialog from "@/components/ConfirmarAsistenciaDialog.vue";
import { obtenerAsistencias } from "@/services/asistenciaService";
import { obtenerEquipos, obtenerNombreEquipo } from "@/services/equiposService";
import { obtenerNombreZona, obtenerZonas } from "@/services/zonasService";
import { setInforme } from "@/stores/informeStore";
import { computed, onMounted, ref } from "vue";
import { useRouter } from 'vue-router';

export default {

  components: {
    ConfirmarAsistenciaDialog
  },
  setup() {
    const asistencias = ref([]);
    const equipos = ref([]);
    const zonas = ref([]);
    const filtros = ref({ fechaInicio: "", fechaFin: "", zona: "", equipo: "" });
    const asistenciaVista = ref(null); // para guardar la asistencia seleccionada
    const dialogVista = ref(false);    // para controlar el modal
    const router = useRouter()

    const headers = [
      { text: "Fecha", value: "fecha" },
      { text: "Nombre de Equipo", value: "equipo_id" },
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

    const verRegistro = (item) => {
      asistenciaVista.value = item;
      dialogVista.value = true;
    };

    const irAInforme = () => {
      const periodoTexto = obtenerTextoPeriodo(asistenciasFiltradas.value, filtros.value);
      setInforme(asistenciasFiltradas.value, periodoTexto);
      router.push({ name: 'informe' });
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

    const limpiarFiltros = () => {
      filtros.value = {
        fechaInicio: "",
        fechaFin: "",
        zona: "",
        equipo: ""
      };
    };

    const verFoto = (url) => {
      window.open(url, "_blank");
    };

    const obtenerTextoPeriodo = (asistencias, filtros) => {
      if (filtros.fechaInicio && filtros.fechaFin) {
        return `Del ${formatearFecha(filtros.fechaInicio)} al ${formatearFecha(filtros.fechaFin)}`;
      }

      if (asistencias.length === 0) return "";

      const fechas = asistencias.map(a => a.fecha).sort();
      const inicio = fechas[0];
      const fin = fechas[fechas.length - 1];

      return `Del ${formatearFecha(inicio)} al ${formatearFecha(fin)}`;
    };

    function formatearFecha(fecha) {
      const opciones = { day: '2-digit', month: 'long', year: 'numeric' };
      return new Date(fecha).toLocaleDateString('es-ES', opciones);
    }

    onMounted(
      cargarDatos
    );

    return { 
      asistencias, 
      equipos, 
      zonas, 
      filtros, 
      headers, 
      asistenciasFiltradas, 
      verFoto,
      asistenciaVista,
      dialogVista,
      verRegistro,
      limpiarFiltros,
      irAInforme,
      obtenerNombreZona,
      obtenerTextoPeriodo,
      formatearFecha,
      obtenerNombreEquipo
    };
  }
};
</script>
