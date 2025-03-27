<!-- src/components/SeparadorZona.vue -->
<template>
    <div class="separador page">
      <div class="header-bar">
        <div class="logo-placeholder"></div>
        <div class="titulo-header">Informe Fuerza de Venta Directa</div>
      </div>
      <div class="contenido">
        <h2>ZONA</h2>
        <h1>{{ obtenerNombreZona(zona, zonas ) }}</h1>
      </div>
      <div class="footer-bar">
        <span class="footer-text">Informe del {{ periodo }}</span>
      </div>
    </div>
  </template>
  
<script setup>
  import { onMounted, ref } from 'vue';
import { obtenerNombreZona, obtenerZonas } from '../services/zonasService';

  const zonas = ref([]);

  defineProps({
    zona: String,
    periodo: String
  })


  onMounted(async () => {
  zonas.value = await obtenerZonas();
  });

  </script>
  
  <style scoped>
  .page {
    background: white;
    width: 794px;
    min-height: 1123px;
    padding: 60px;
    margin-bottom: 40px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    font-family: 'Times New Roman', serif;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #000;
  }
  
  .header-bar {
    display: flex;
    align-items: center;
    background-color: #f66;
    color: white;
    font-weight: bold;
    padding: 10px 20px;
    font-size: 18px;
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
  
  .contenido {
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  h1 {
    font-size: 48px;
    font-weight: bold;
    color: red;
    margin: 0;
  }
  
  h2 {
    font-size: 28px;
    font-weight: bold;
    color: red;
    margin: 0;
  }
  
  .nota {
    margin-top: 20px;
    font-size: 14px;
    color: red;
  }
  
  .footer-bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: linear-gradient(to right, #f66 80%, #aaa 80%);
    height: 20px;
    padding-right: 10px;
  }
  
  .footer-text {
    font-size: 12px;
    font-weight: bold;
    color: #555;
  }
  </style>
  