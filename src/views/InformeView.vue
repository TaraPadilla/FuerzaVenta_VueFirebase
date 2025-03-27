<template>
    <div class="informe">
      <div class="acciones">
        <button @click="imprimir">Imprimir</button>
        <!-- <pre style="color: black;">{{ JSON.stringify(seccionesPorZona, null, 2) }}</pre> -->
    </div>

  
      <!-- Portada como componente -->
      <Portada :titulo="tituloRef" :anio="anioActual" />
  
      <!-- Secciones por zona -->
      <template v-for="(grupo, indexZona) in seccionesPorZona" :key="indexZona">
        <!-- Separador solo al inicio de la zona -->
        <SeparadorZona :zona="grupo.zona" :periodo="tituloRef" />
        
        <template v-for="(subgrupo, indexSupervisor) in grupo.supervisores" :key="indexSupervisor">
          <div class="page">  
            <div class="header-bar">
              <div class="logo-placeholder"></div>
              <div class="titulo-header">Informe Fuerza de Venta Directa</div>
            </div>
  
            <div class="encabezado-zona">
              <h2 v-if="supervisores.length">{{ obtenerNombreSupervisor(subgrupo.supervisor_id, supervisores) }}</h2>
              <h2 v-else>SUPERVISOR: Cargando...</h2>
              
              <p class="periodo">Periodo: {{ tituloRef }}</p>
              <p class="anio">Año: {{ anioActual }}</p>
            </div>
  
            <div class="tabla-asistencias">
              <div
                v-for="(registro, idx) in subgrupo.asistencias"
                :key="idx"
                class="registro tarjeta-asistencia"
              >
                <img :src="registro.foto_url" alt="Foto del equipo" class="foto" />
                <div class="info">
                  <p class="zona-nombre">
                     {{ zonas.length ? obtenerNombreZona(grupo.zona, zonas) : grupo.zona }}
                  </p>
                  <p><strong>Supervisor:</strong> {{ obtenerNombreSupervisor(registro.supervisor_id, supervisores) }}</p>
                  <p><strong>Día:</strong> {{ registro.fecha }}</p>
                  <p><strong>Equipo:</strong> {{ obtenerNombreEquipo(registro.equipo_id, equipos) }}</p>
                  <p><strong>Entrada:</strong> {{ registro.hora_entrada }} - {{ registro.hora_salida }}</p>
                  <ol class="asesores">
                    <li v-for="asesor in registro.asesores_dia" :key="asesor">{{ asesor }}</li>
                  </ol>
                </div>
              </div>
            </div>
  
            <div class="footer-bar">
              <span class="footer-text">Informe del {{ tituloRef }}</span>
            </div>
          </div>
  
          <div class="salto-pagina"></div>
        </template>
      </template>
    </div>
  </template>
  
  
  <script setup>
import Portada from '@/components/Portada.vue';
import { obtenerEquipos, obtenerNombreEquipo } from "@/services/equiposService";
import { obtenerNombreZona, obtenerZonas } from "@/services/zonasService";
import { getInforme } from '@/stores/informeStore';
import { computed, onMounted, ref } from 'vue';
import SeparadorZona from '../components/SeparadorZona.vue';
import { obtenerNombreSupervisor, obtenerUsuariosSupervisores } from '../services/usuariosService';

const zonas = ref([]);
const supervisores = ref([]);
const equipos = ref([]);
const { datos, titulo } = getInforme()
console.log(datos);
console.log(titulo);

onMounted(async () => {
  zonas.value = await obtenerZonas();
  supervisores.value = await obtenerUsuariosSupervisores();
  equipos.value = await obtenerEquipos();
  console.log('Datos cargados:', datosRef.value);
});

  const datosRef = ref(datos || [])
  const tituloRef = ref(titulo || '')
  
  const anioActual = new Date().getFullYear()
  
  const seccionesPorZona = computed(() => {
    const zonasAgrupadas = {};
    console.log('Procesando datos para seccionesPorZona...', datosRef.value); // <-- AQUI

    datosRef.value.forEach(registro => {
      const zona = registro.zona_id || 'Sin Zona';
      const supervisor = registro.supervisor_id || 'Sin Supervisor';

      if (!zonasAgrupadas[zona]) {
        zonasAgrupadas[zona] = {};
      }

      if (!zonasAgrupadas[zona][supervisor]) {
        zonasAgrupadas[zona][supervisor] = [];
      }

      zonasAgrupadas[zona][supervisor].push(registro);
    });

    return Object.entries(zonasAgrupadas).map(([zona, supervisoresMap]) => ({
      zona,
      supervisores: Object.entries(supervisoresMap).map(([supervisor_id, asistencias]) => ({
      supervisor_id,
      asistencias
    }))
    }));
  });

  
  const imprimir = () => {
    window.print()
  }
  </script>
  
  <style scoped>
  .informe {
    background-color: #f0f0f0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .acciones {
    width: 794px;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  
  .acciones button {
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .page {
    background: white;
    width: 794px;
    min-height: 1123px;
    padding: 60px;
    margin-bottom: 40px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    color: #000;
    font-family: 'Times New Roman', serif;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .header-bar {
    display: flex;
    align-items: center;
    background-color: #f66;
    color: white;
    font-weight: bold;
    padding: 10px 20px;
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  .logo-placeholder {
    width: 40px;
    height: 40px;
    border: 3px solid white;
    border-radius: 50%;
    margin-right: 15px;
  }
  
  .titulo-header {
    flex-grow: 1;
  }
  
  .footer-bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: linear-gradient(to right, #f66 80%, #aaa 80%);
    height: 20px;
    padding-right: 10px;
    margin-top: 40px;
  }
  
  .footer-text {
    font-size: 12px;
    font-weight: bold;
    color: #555;
  }
  
  .encabezado-zona {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .encabezado-zona h2 {
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  
  .tabla-asistencias {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  .tarjeta-asistencia {
    background-color: #fafafa;
    border: 1px solid #ccc;
    padding: 12px;
    display: flex;
    flex-direction: column;
    font-size: 12px;
  }
  
  .tarjeta-asistencia .foto {
    width: 100%;
    max-height: 180px;
    object-fit: cover;
    margin-bottom: 10px;
    border: 1px solid #ccc;
  }
  
  .tarjeta-asistencia .zona-nombre {
    font-weight: bold;
    font-size: 13px;
    margin-bottom: 5px;
  }
  
  .asesores {
    margin-top: 5px;
    padding-left: 18px;
  }
  
  .asesores li {
    font-size: 12px;
    margin-bottom: 3px;
  }
  
  .salto-pagina {
    page-break-after: always;
  }
  </style>